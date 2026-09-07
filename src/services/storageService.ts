import { UserState, LeaderboardEntry, AdminMetricsData } from "../types";
import { getLevelForXp, BADGES } from "../data/questsAndBadges";

const STORAGE_KEY = "javaquest_user_state_v1";
const AUTH_SESSION_KEY = "javaquest_auth_session_v1";
const LOCAL_ACCOUNTS_KEY = "javaquest_registered_accounts_v1";

export interface StoredAuthAccount {
  id: string;
  username: string;
  email: string;
  role: "student" | "admin";
  avatar: string;
  agreedToPrivacyPolicy: boolean;
  privacyConsentDate: string;
  joinedDate: string;
}

export const GUEST_USER_TEMPLATE: UserState = {
  id: "guest_visitor",
  username: "Guest Learner",
  email: "",
  avatar: "☕",
  role: "student",
  agreedToPrivacyPolicy: false,
  level: 1,
  xp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().split("T")[0],
  streakHistory: [],
  hearts: 5,
  maxHearts: 5,
  lastHeartRegen: Date.now(),
  completedLessons: [],
  lessonTestScores: {},
  solvedChallenges: [],
  completedProjects: [],
  unlockedBadges: [],
  mistakeLessonIds: [],
  learningPreference: "Java",
  experienceLevel: "Beginner",
  isPublicLeaderboard: false,
  dailyChallengeDoneDate: "",
  joinedDate: new Date().toISOString().split("T")[0],
};

function getUserProgressKey(userId: string): string {
  return `javaquest_user_progress_${userId}`;
}

type Listener = (state: UserState) => void;
const listeners: Set<Listener> = new Set();

type AuthListener = (isAuthenticated: boolean, user: UserState | null) => void;
const authListeners: Set<AuthListener> = new Set();

export function isUserAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    const rawUser = localStorage.getItem(STORAGE_KEY);
    if (!session || session.length < 5 || !rawUser) return false;
    const user: UserState = JSON.parse(rawUser);
    return Boolean(user && user.id && user.id !== "guest_visitor" && user.agreedToPrivacyPolicy);
  } catch {
    return false;
  }
}

export function subscribeAuth(listener: AuthListener): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

export function notifyAuthChange(isAuth: boolean, user: UserState | null) {
  authListeners.forEach((fn) => fn(isAuth, user));
}

export function getUserState(): UserState {
  try {
    if (!isUserAuthenticated()) {
      return { ...GUEST_USER_TEMPLATE };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...GUEST_USER_TEMPLATE };
    }

    const state: UserState = JSON.parse(raw);

    // Default missing role
    if (!state.role) state.role = "student";
    if (state.agreedToPrivacyPolicy === undefined) state.agreedToPrivacyPolicy = true;

    // Heart regeneration check (1 heart every 20 minutes)
    const now = Date.now();
    const regenInterval = 20 * 60 * 1000;
    if (state.hearts < state.maxHearts) {
      const elapsed = now - (state.lastHeartRegen || now);
      const heartsToAdd = Math.floor(elapsed / regenInterval);
      if (heartsToAdd > 0) {
        state.hearts = Math.min(state.maxHearts, state.hearts + heartsToAdd);
        state.lastHeartRegen = now - (elapsed % regenInterval);
        saveUserState(state);
      }
    }

    return state;
  } catch (e) {
    console.error("Failed to load user state from localStorage", e);
    return { ...GUEST_USER_TEMPLATE };
  }
}

export function saveUserState(state: UserState) {
  try {
    // If not authenticated or visitor, don't overwrite private records
    if (!state.id || state.id === "guest_visitor") {
      listeners.forEach((fn) => fn({ ...state }));
      return;
    }

    // Recalculate level
    const lvlInfo = getLevelForXp(state.xp);
    state.level = lvlInfo.level;

    // Check automatic badge unlocks
    BADGES.forEach((b) => {
      if (!state.unlockedBadges.includes(b.id)) {
        if (b.id === "xp_100" && state.xp >= 100) state.unlockedBadges.push(b.id);
        if (b.id === "streak_7" && state.streak >= 7) state.unlockedBadges.push(b.id);
        if (b.id === "challenges_10" && state.solvedChallenges.length >= 10) state.unlockedBadges.push(b.id);
        if (b.id === "first_lesson" && state.completedLessons.length >= 1) state.unlockedBadges.push(b.id);
        if (b.id === "first_code" && state.solvedChallenges.length >= 1) state.unlockedBadges.push(b.id);
        if (b.id === "code_master" && state.level >= 9) state.unlockedBadges.push(b.id);
      }
    });

    // Save active session
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Save strictly to private partition for this user
    localStorage.setItem(getUserProgressKey(state.id), JSON.stringify(state));

    // Sync private progress to backend in background
    if (state.email) {
      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          progress: {
            completedLessons: state.completedLessons,
            lessonTestScores: state.lessonTestScores,
            solvedChallenges: state.solvedChallenges,
            completedProjects: state.completedProjects,
            unlockedBadges: state.unlockedBadges,
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            hearts: state.hearts,
          },
        }),
      }).catch(() => {
        // Silently handled in offline mode
      });
    }

    listeners.forEach((fn) => fn({ ...state }));
  } catch (e) {
    console.error("Failed to save user state to localStorage", e);
  }
}

// User Registration with strict credential validation & privacy agreement
export async function registerUser(params: {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  agreedToPrivacyPolicy: boolean;
  adminCode?: string;
}): Promise<{ success: boolean; error?: string; user?: UserState }> {
  const { username, email, password, avatar = "☕", agreedToPrivacyPolicy, adminCode } = params;

  if (!agreedToPrivacyPolicy) {
    return { success: false, error: "You must accept the Privacy Policy and Terms of Service to register." };
  }
  if (!username || username.trim().length < 2) {
    return { success: false, error: "Username must be at least 2 characters long." };
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  // 1. Submit to server registration endpoint
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const nowIso = new Date().toISOString();
      const today = nowIso.split("T")[0];

      // Clean private progress for the newly registered user
      const newUserState: UserState = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar || avatar,
        role: data.user.role || "student",
        agreedToPrivacyPolicy: true,
        privacyConsentDate: data.user.privacyConsentDate || nowIso,
        level: data.user.level || 1,
        xp: data.user.xp || 50,
        streak: data.user.streak || 1,
        lastActiveDate: today,
        streakHistory: [today],
        hearts: 5,
        maxHearts: 5,
        lastHeartRegen: Date.now(),
        completedLessons: [],
        lessonTestScores: {},
        solvedChallenges: [],
        completedProjects: [],
        unlockedBadges: [],
        mistakeLessonIds: [],
        learningPreference: "Java",
        experienceLevel: "Beginner",
        isPublicLeaderboard: true,
        dailyChallengeDoneDate: "",
        joinedDate: data.user.joinedDate || today,
      };

      localStorage.setItem(AUTH_SESSION_KEY, data.token || `token_${newUserState.id}`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserState));
      localStorage.setItem(getUserProgressKey(newUserState.id), JSON.stringify(newUserState));

      notifyAuthChange(true, newUserState);
      return { success: true, user: newUserState };
    } else if (!res.ok) {
      return { success: false, error: data.error || "Registration failed." };
    }
  } catch (err) {
    console.warn("Server registration network error:", err);
  }

  return {
    success: false,
    error: "Unable to connect to authentication service. Please check your network and try again.",
  };
}

// User Login - Validates credentials strictly against server database
export async function loginUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserState }> {
  if (!identifier || !password) {
    return { success: false, error: "Please enter your username/email and password." };
  }

  // 1. Submit to server login API
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const userId = data.user.id;
      const progressKey = getUserProgressKey(userId);

      // Check if user has local cached progress for their own account
      let userProgress: Partial<UserState> = {};
      try {
        const cached = localStorage.getItem(progressKey);
        if (cached) {
          userProgress = JSON.parse(cached);
        }
      } catch (e) {
        // ignore parse error
      }

      const today = new Date().toISOString().split("T")[0];

      // Build private user state strictly for this user (no cross-contamination!)
      const loggedUser: UserState = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar || userProgress.avatar || "☕",
        role: data.user.role || userProgress.role || "student",
        agreedToPrivacyPolicy: true,
        privacyConsentDate: data.user.privacyConsentDate || userProgress.privacyConsentDate || new Date().toISOString(),
        level: data.user.level || userProgress.level || 1,
        xp: data.user.xp || userProgress.xp || 50,
        streak: data.user.streak || userProgress.streak || 1,
        lastActiveDate: today,
        streakHistory: userProgress.streakHistory || [today],
        hearts: userProgress.hearts ?? 5,
        maxHearts: 5,
        lastHeartRegen: userProgress.lastHeartRegen || Date.now(),
        completedLessons: data.user.completedLessons || userProgress.completedLessons || [],
        lessonTestScores: data.user.lessonTestScores || userProgress.lessonTestScores || {},
        solvedChallenges: data.user.solvedChallenges || userProgress.solvedChallenges || [],
        completedProjects: data.user.completedProjects || userProgress.completedProjects || [],
        unlockedBadges: data.user.unlockedBadges || userProgress.unlockedBadges || [],
        mistakeLessonIds: userProgress.mistakeLessonIds || [],
        learningPreference: userProgress.learningPreference || "Java",
        experienceLevel: userProgress.experienceLevel || "Beginner",
        isPublicLeaderboard: userProgress.isPublicLeaderboard ?? true,
        dailyChallengeDoneDate: userProgress.dailyChallengeDoneDate || "",
        joinedDate: data.user.joinedDate || userProgress.joinedDate || today,
      };

      localStorage.setItem(AUTH_SESSION_KEY, data.token || `token_${loggedUser.id}`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      localStorage.setItem(progressKey, JSON.stringify(loggedUser));

      notifyAuthChange(true, loggedUser);
      return { success: true, user: loggedUser };
    } else if (!res.ok) {
      return { success: false, error: data.error || "Invalid user credentials. Please check your username/email and password." };
    }
  } catch (err) {
    console.warn("Server login network error:", err);
  }

  return {
    success: false,
    error: "Unable to reach the authentication service. Please check your connection and try again.",
  };
}

// Verify secret administrator clearance passkey via server
export async function verifyAdminPasskey(
  passkey: string,
  currentUser: UserState
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/verify-passkey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey, email: currentUser.email }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      currentUser.role = "admin";
      saveUserState(currentUser);
      if (data.token) {
        localStorage.setItem(AUTH_SESSION_KEY, data.token);
      }
      return { success: true };
    } else {
      return { success: false, error: data.error || "Invalid administrator clearance passkey." };
    }
  } catch (err) {
    return { success: false, error: "Network error while verifying administrator credentials." };
  }
}

// Logout - Completely clears active session and locks activities
export function logoutUser(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(STORAGE_KEY);
  notifyAuthChange(false, null);
}

// Admin Metrics Retrieval (strictly checks for admin role)
export async function fetchAdminMetrics(
  currentUser: UserState
): Promise<{ success: boolean; error?: string; data?: AdminMetricsData }> {
  if (currentUser.role !== "admin") {
    return {
      success: false,
      error: "Access Denied: You do not have administrator permissions to view registered user statistics.",
    };
  }

  // 1. Try server API
  try {
    const res = await fetch("/api/admin/users", {
      headers: {
        "x-user-role": currentUser.role,
        "x-user-email": currentUser.email,
        Authorization: `Bearer ${localStorage.getItem(AUTH_SESSION_KEY) || ""}`,
      },
    });
    if (res.ok) {
      const data: AdminMetricsData = await res.json();
      return { success: true, data };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.error || "Access Denied: Administrator clearance failed.",
      };
    }
  } catch (err) {
    return {
      success: false,
      error: "Unable to connect to administrator telemetry server. Please check your network.",
    };
  }
}

// GDPR: Export Data as JSON file download
export function downloadUserDataJson(user: UserState): void {
  const exportData = {
    platform: "JavaQuest Interactive Programming",
    exportVersion: "GDPR-1.0",
    exportedAt: new Date().toISOString(),
    userProfile: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      joinedDate: user.joinedDate,
      privacyConsent: {
        agreedToTerms: user.agreedToPrivacyPolicy,
        consentDate: user.privacyConsentDate,
      },
    },
    educationalStats: {
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      streakHistory: user.streakHistory,
      hearts: user.hearts,
      completedLessons: user.completedLessons,
      lessonTestScores: user.lessonTestScores,
      solvedChallenges: user.solvedChallenges,
      completedProjects: user.completedProjects,
      unlockedBadges: user.unlockedBadges,
    },
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `javaquest_privacy_data_${user.username.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// GDPR: Delete User Account and wipe all records
export async function deleteUserAccountPermanently(
  user: UserState,
  passwordConfirm: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/user/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: passwordConfirm }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || "Failed to delete account from server." };
    }
  } catch (err) {
    console.warn("Server delete call failed, performing local erasure:", err);
  }

  // Clear session, active storage, and user private partition
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
  if (user.id) {
    localStorage.removeItem(getUserProgressKey(user.id));
  }
  notifyAuthChange(false, null);

  return { success: true };
}

export function subscribeUserState(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addXp(amount: number, reason?: string): { oldXp: number; newXp: number; leveledUp: boolean; newLevel: number } {
  const current = getUserState();
  const oldLvl = getLevelForXp(current.xp).level;
  const oldXp = current.xp;
  const newXp = oldXp + amount;
  current.xp = newXp;

  // Streak activity
  const today = new Date().toISOString().split("T")[0];
  if (current.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (current.lastActiveDate === yesterday) {
      current.streak += 1;
    } else {
      current.streak = 1;
    }
    current.lastActiveDate = today;
    if (!current.streakHistory.includes(today)) {
      current.streakHistory.push(today);
    }
  }

  saveUserState(current);
  const newLvl = getLevelForXp(newXp).level;
  return {
    oldXp,
    newXp,
    leveledUp: newLvl > oldLvl,
    newLevel: newLvl,
  };
}

export function deductHeart(): number {
  const current = getUserState();
  if (current.hearts > 0) {
    current.hearts -= 1;
    saveUserState(current);
  }
  return current.hearts;
}

export function refillHearts(): void {
  const current = getUserState();
  current.hearts = current.maxHearts;
  current.lastHeartRegen = Date.now();
  saveUserState(current);
}

export function completeLesson(lessonId: string, xpEarned: number) {
  const current = getUserState();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
  }
  // Remove from mistake list if mastered
  current.mistakeLessonIds = current.mistakeLessonIds.filter((id) => id !== lessonId);
  addXp(xpEarned, `Completed lesson ${lessonId}`);
}

export function recordLessonTestResult(
  lessonId: string,
  score: number,
  total: number,
  xpBonus: number = 25
): { passed: boolean; stars: number; xpEarned: number } {
  const current = getUserState();
  const percentage = Math.round((score / Math.max(1, total)) * 100);
  const passed = percentage >= 70;
  const stars = percentage === 100 ? 3 : percentage >= 70 ? 2 : 1;

  if (!current.lessonTestScores) {
    current.lessonTestScores = {};
  }

  // Preserve highest score
  const previousRecord = current.lessonTestScores[lessonId];
  if (!previousRecord || percentage >= previousRecord.percentage) {
    current.lessonTestScores[lessonId] = {
      score,
      total,
      percentage,
      stars,
      passed,
      completedAt: new Date().toISOString().split("T")[0],
    };
  }

  // Ensure marked completed if passed
  if (passed && !current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
  }

  const xpEarned = passed ? xpBonus : Math.round(xpBonus / 2);
  addXp(xpEarned, `Completed test for ${lessonId} (${percentage}%)`);
  saveUserState(current);

  return { passed, stars, xpEarned };
}

export function recordMistake(lessonId: string) {
  const current = getUserState();
  if (!current.mistakeLessonIds.includes(lessonId)) {
    current.mistakeLessonIds.push(lessonId);
  }
  deductHeart();
}

export function completeChallenge(challengeId: string, xpReward: number) {
  const current = getUserState();
  if (!current.solvedChallenges.includes(challengeId)) {
    current.solvedChallenges.push(challengeId);
  }
  addXp(xpReward, `Solved challenge ${challengeId}`);
}

export function completeDailyChallenge(challengeId: string) {
  const current = getUserState();
  const today = new Date().toISOString().split("T")[0];
  current.dailyChallengeDoneDate = today;
  if (!current.solvedChallenges.includes(challengeId)) {
    current.solvedChallenges.push(challengeId);
  }
  addXp(50, "Completed Daily Challenge");
}

export function completeProject(projectId: string, xpReward: number) {
  const current = getUserState();
  if (!current.completedProjects.includes(projectId)) {
    current.completedProjects.push(projectId);
  }
  addXp(xpReward, `Completed project ${projectId}`);
}

// Sample mock community leaderboard entries merged with current user
export function getLeaderboardEntries(): LeaderboardEntry[] {
  const user = getUserState();
  const baseCommunity: LeaderboardEntry[] = [
    { rank: 1, id: "u_1", username: "CodeNinja_99", avatar: "⚔️", xp: 1450, level: 5, levelTitle: "Java Apprentice", streak: 14 },
    { rank: 2, id: "u_2", username: "Rahul_Dev", avatar: "🚀", xp: 1280, level: 5, levelTitle: "Java Apprentice", streak: 12 },
    { rank: 3, id: "u_3", username: "Sarthak_K", avatar: "🛡️", xp: 1120, level: 5, levelTitle: "Java Apprentice", streak: 9 },
    { rank: 4, id: "u_4", username: "DevPriya", avatar: "✨", xp: 890, level: 4, levelTitle: "Developer", streak: 6 },
    { rank: 5, id: "u_5", username: "BitMaster", avatar: "🤖", xp: 740, level: 4, levelTitle: "Developer", streak: 8 },
    { rank: 6, id: "u_6", username: "Sarah_Java", avatar: "☕", xp: 580, level: 3, levelTitle: "Coder", streak: 4 },
    { rank: 7, id: "u_7", username: "TuringFan", avatar: "🧠", xp: 420, level: 3, levelTitle: "Coder", streak: 5 },
    { rank: 8, id: "u_8", username: "Ananya_CS", avatar: "💻", xp: 310, level: 3, levelTitle: "Coder", streak: 3 },
  ];

  if (user.isPublicLeaderboard) {
    const userLvl = getLevelForXp(user.xp);
    const userEntry: LeaderboardEntry = {
      rank: 0,
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      levelTitle: userLvl.title,
      streak: user.streak,
      isCurrentUser: true,
    };

    const combined = [...baseCommunity, userEntry].sort((a, b) => b.xp - a.xp);
    return combined.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }

  return baseCommunity;
}
