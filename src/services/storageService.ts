import { UserState, LeaderboardEntry, AdminMetricsData } from "../types";
import { getLevelForXp, BADGES } from "../data/questsAndBadges";

const STORAGE_KEY = "javaquest_user_state_v1";
const AUTH_SESSION_KEY = "javaquest_auth_session_v1";
const LOCAL_ACCOUNTS_KEY = "javaquest_registered_accounts_v1";

export interface StoredAuthAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "student" | "admin";
  avatar: string;
  agreedToPrivacyPolicy: boolean;
  privacyConsentDate: string;
  joinedDate: string;
  userState: UserState;
}

const INITIAL_FALLBACK_ACCOUNTS: StoredAuthAccount[] = [
  {
    id: "admin_bhumi_01",
    username: "Bhumi_Admin",
    email: "jadhavbhumi02@gmail.com",
    password: "AdminPassword123!",
    role: "admin",
    avatar: "🛡️",
    agreedToPrivacyPolicy: true,
    privacyConsentDate: "2026-09-01T00:00:00.000Z",
    joinedDate: "2026-09-01",
    userState: {
      id: "admin_bhumi_01",
      username: "Bhumi_Admin",
      email: "jadhavbhumi02@gmail.com",
      avatar: "🛡️",
      role: "admin",
      agreedToPrivacyPolicy: true,
      privacyConsentDate: "2026-09-01T00:00:00.000Z",
      level: 5,
      xp: 1250,
      streak: 15,
      lastActiveDate: new Date().toISOString().split("T")[0],
      streakHistory: [
        new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
        new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      ],
      hearts: 5,
      maxHearts: 5,
      lastHeartRegen: Date.now(),
      completedLessons: ["java_1_1", "java_1_2", "py_1_1", "js_1_1"],
      lessonTestScores: {
        java_1_1: { score: 3, total: 3, percentage: 100, stars: 3, passed: true, completedAt: "2026-09-01" },
      },
      solvedChallenges: ["ch_hello_world", "ch_variables"],
      completedProjects: ["proj_student_grade"],
      unlockedBadges: ["first_lesson", "first_code", "xp_100"],
      mistakeLessonIds: [],
      learningPreference: "Java",
      experienceLevel: "Advanced",
      isPublicLeaderboard: true,
      dailyChallengeDoneDate: "",
      joinedDate: "2026-09-01",
    },
  },
  {
    id: "admin_sys_02",
    username: "AdminMaster",
    email: "admin@javaquest.dev",
    password: "Admin@123",
    role: "admin",
    avatar: "👑",
    agreedToPrivacyPolicy: true,
    privacyConsentDate: "2026-09-01T00:00:00.000Z",
    joinedDate: "2026-09-01",
    userState: {
      id: "admin_sys_02",
      username: "AdminMaster",
      email: "admin@javaquest.dev",
      avatar: "👑",
      role: "admin",
      agreedToPrivacyPolicy: true,
      privacyConsentDate: "2026-09-01T00:00:00.000Z",
      level: 6,
      xp: 1800,
      streak: 20,
      lastActiveDate: new Date().toISOString().split("T")[0],
      streakHistory: [new Date().toISOString().split("T")[0]],
      hearts: 5,
      maxHearts: 5,
      lastHeartRegen: Date.now(),
      completedLessons: ["java_1_1", "java_1_2", "java_1_3"],
      lessonTestScores: {},
      solvedChallenges: ["ch_hello_world", "ch_variables", "ch_fizzbuzz"],
      completedProjects: ["proj_student_grade"],
      unlockedBadges: ["first_lesson", "first_code", "xp_100", "streak_7"],
      mistakeLessonIds: [],
      learningPreference: "Java",
      experienceLevel: "Advanced",
      isPublicLeaderboard: true,
      dailyChallengeDoneDate: "",
      joinedDate: "2026-09-01",
    },
  },
  {
    id: "user_quest_01",
    username: "AlexDeveloper",
    email: "alex@javaquest.dev",
    password: "Student@123",
    role: "student",
    avatar: "☕",
    agreedToPrivacyPolicy: true,
    privacyConsentDate: "2026-09-02T00:00:00.000Z",
    joinedDate: "2026-09-02",
    userState: {
      id: "user_quest_01",
      username: "AlexDeveloper",
      email: "alex@javaquest.dev",
      avatar: "☕",
      role: "student",
      agreedToPrivacyPolicy: true,
      privacyConsentDate: "2026-09-02T00:00:00.000Z",
      level: 2,
      xp: 140,
      streak: 3,
      lastActiveDate: new Date().toISOString().split("T")[0],
      streakHistory: [
        new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
        new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      ],
      hearts: 5,
      maxHearts: 5,
      lastHeartRegen: Date.now(),
      completedLessons: ["java_1_1", "java_1_2"],
      lessonTestScores: {
        java_1_1: {
          score: 3,
          total: 3,
          percentage: 100,
          stars: 3,
          passed: true,
          completedAt: "2026-09-01",
        },
      },
      solvedChallenges: ["ch_hello_world"],
      completedProjects: [],
      unlockedBadges: ["first_lesson", "first_code"],
      mistakeLessonIds: [],
      learningPreference: "Java",
      experienceLevel: "Beginner",
      isPublicLeaderboard: true,
      dailyChallengeDoneDate: "",
      joinedDate: "2026-09-01",
    },
  },
];

function getLocalAccounts(): StoredAuthAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(INITIAL_FALLBACK_ACCOUNTS));
      return INITIAL_FALLBACK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_ACCOUNTS;
  }
}

function saveLocalAccounts(accounts: StoredAuthAccount[]) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error("Failed to save local accounts", e);
  }
}

const DEFAULT_USER: UserState = INITIAL_FALLBACK_ACCOUNTS[2].userState;

type Listener = (state: UserState) => void;
const listeners: Set<Listener> = new Set();

type AuthListener = (isAuthenticated: boolean, user: UserState | null) => void;
const authListeners: Set<AuthListener> = new Set();

export function isUserAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    return Boolean(session && session.length > 5);
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserState(DEFAULT_USER);
      return DEFAULT_USER;
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
    return DEFAULT_USER;
  }
}

export function saveUserState(state: UserState) {
  try {
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Update in local accounts list
    const accounts = getLocalAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === state.email.toLowerCase());
    if (idx !== -1) {
      accounts[idx].userState = { ...state };
      accounts[idx].role = state.role;
      saveLocalAccounts(accounts);
    }

    listeners.forEach((fn) => fn({ ...state }));
  } catch (e) {
    console.error("Failed to save user state to localStorage", e);
  }
}

// User Registration with strict validation & privacy agreement
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

  // 1. Try server API
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const newUserState: UserState = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar || avatar,
        role: data.user.role || "student",
        agreedToPrivacyPolicy: true,
        privacyConsentDate: data.user.privacyConsentDate || new Date().toISOString(),
        level: data.user.level || 1,
        xp: data.user.xp || 50,
        streak: data.user.streak || 1,
        lastActiveDate: data.user.lastActiveDate || new Date().toISOString().split("T")[0],
        streakHistory: [new Date().toISOString().split("T")[0]],
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
        joinedDate: data.user.joinedDate || new Date().toISOString().split("T")[0],
      };

      localStorage.setItem(AUTH_SESSION_KEY, data.token || "token_active");
      saveUserState(newUserState);

      // Save to local accounts mirror
      const accounts = getLocalAccounts();
      if (!accounts.some((a) => a.email.toLowerCase() === data.user.email.toLowerCase())) {
        accounts.push({
          id: newUserState.id,
          username: newUserState.username,
          email: newUserState.email,
          password,
          role: newUserState.role,
          avatar: newUserState.avatar,
          agreedToPrivacyPolicy: true,
          privacyConsentDate: newUserState.privacyConsentDate || new Date().toISOString(),
          joinedDate: newUserState.joinedDate,
          userState: newUserState,
        });
        saveLocalAccounts(accounts);
      }

      notifyAuthChange(true, newUserState);
      return { success: true, user: newUserState };
    } else if (!res.ok) {
      return { success: false, error: data.error || "Registration failed." };
    }
  } catch (err) {
    console.warn("Server registration failed, attempting client store fallback:", err);
  }

  // 2. Client fallback
  const accounts = getLocalAccounts();
  const cleanEmail = email.trim().toLowerCase();
  if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "An account with this email is already registered. Please sign in." };
  }

  const isAdmin =
    adminCode === "ADMIN2026" ||
    cleanEmail === "jadhavbhumi02@gmail.com" ||
    cleanEmail === "admin@javaquest.dev";

  const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const nowIso = new Date().toISOString();
  const today = nowIso.split("T")[0];

  const newUserState: UserState = {
    id: newId,
    username: username.trim(),
    email: cleanEmail,
    avatar: avatar || "☕",
    role: isAdmin ? "admin" : "student",
    agreedToPrivacyPolicy: true,
    privacyConsentDate: nowIso,
    level: 1,
    xp: 50,
    streak: 1,
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
    joinedDate: today,
  };

  accounts.push({
    id: newId,
    username: newUserState.username,
    email: cleanEmail,
    password,
    role: newUserState.role,
    avatar: newUserState.avatar,
    agreedToPrivacyPolicy: true,
    privacyConsentDate: nowIso,
    joinedDate: today,
    userState: newUserState,
  });
  saveLocalAccounts(accounts);

  localStorage.setItem(AUTH_SESSION_KEY, `token_${newId}`);
  saveUserState(newUserState);
  notifyAuthChange(true, newUserState);

  return { success: true, user: newUserState };
}

// User Login - Validates credentials strictly
export async function loginUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserState }> {
  if (!identifier || !password) {
    return { success: false, error: "Please enter your username/email and password." };
  }

  // 1. Try server API
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const loggedUser: UserState = {
        ...getUserState(),
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar || "☕",
        role: data.user.role || "student",
        agreedToPrivacyPolicy: true,
        level: data.user.level || 1,
        xp: data.user.xp || 40,
        streak: data.user.streak || 1,
        completedLessons: data.user.completedLessons || [],
        solvedChallenges: data.user.solvedChallenges || [],
        lessonTestScores: data.user.lessonTestScores || {},
        lastActiveDate: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem(AUTH_SESSION_KEY, data.token || "token_active");
      saveUserState(loggedUser);
      notifyAuthChange(true, loggedUser);
      return { success: true, user: loggedUser };
    } else if (!res.ok) {
      return { success: false, error: data.error || "Invalid user credentials." };
    }
  } catch (err) {
    console.warn("Server login failed, attempting local credentials verification:", err);
  }

  // 2. Client fallback
  const accounts = getLocalAccounts();
  const cleanId = identifier.trim().toLowerCase();
  const found = accounts.find(
    (a) => a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
  );

  if (!found) {
    return {
      success: false,
      error: "Invalid credentials: No account found matching this email or username.",
    };
  }

  if (found.password !== password) {
    return {
      success: false,
      error: "Invalid credentials: Incorrect password. Please try again.",
    };
  }

  const activeUser = {
    ...found.userState,
    role: found.role,
    lastActiveDate: new Date().toISOString().split("T")[0],
  };

  localStorage.setItem(AUTH_SESSION_KEY, `token_${found.id}`);
  saveUserState(activeUser);
  notifyAuthChange(true, activeUser);

  return { success: true, user: activeUser };
}

// Logout
export function logoutUser(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
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
    }
  } catch (err) {
    console.warn("Server admin fetch error, falling back to local accounts registry:", err);
  }

  // 2. Fallback from local accounts registry
  const accounts = getLocalAccounts();
  const totalUsers = accounts.length;
  const today = new Date().toISOString().split("T")[0];
  const activeToday = accounts.filter((a) => a.userState.lastActiveDate === today).length;
  const studentsCount = accounts.filter((a) => a.role === "student").length;
  const adminsCount = accounts.filter((a) => a.role === "admin").length;

  const totalLessonsCompleted = accounts.reduce(
    (sum, a) => sum + (a.userState.completedLessons?.length || 0),
    0
  );
  const totalTestsPassed = accounts.reduce(
    (sum, a) =>
      sum +
      Object.values(a.userState.lessonTestScores || {}).filter((t: any) => t?.passed).length,
    0
  );

  const safeUsers = accounts.map((a) => ({
    id: a.id,
    username: a.username,
    email: a.email,
    role: a.role,
    joinedDate: a.joinedDate,
    lastActiveDate: a.userState.lastActiveDate,
    level: a.userState.level,
    xp: a.userState.xp,
    completedLessonsCount: a.userState.completedLessons?.length || 0,
    testsTakenCount: Object.keys(a.userState.lessonTestScores || {}).length,
    agreedToPrivacyPolicy: a.agreedToPrivacyPolicy,
    privacyConsentDate: a.privacyConsentDate,
  }));

  return {
    success: true,
    data: {
      totalUsers,
      activeToday,
      studentsCount,
      adminsCount,
      totalLessonsCompleted,
      totalTestsPassed,
      users: safeUsers,
    },
  };
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

  // Remove from local accounts
  const accounts = getLocalAccounts().filter((a) => a.email.toLowerCase() !== user.email.toLowerCase());
  saveLocalAccounts(accounts);

  // Clear session & user storage
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
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
