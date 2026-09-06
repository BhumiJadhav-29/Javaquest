export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "code-completion"
  | "predict-output"
  | "find-error"
  | "mini-challenge";

export interface TestCase {
  id?: number;
  input?: string;
  expectedOutput: string;
  description: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  starterCode?: string;
  testCases?: TestCase[];
}

export interface LessonContent {
  intro: string;
  explanation: string;
  codeExample: string;
  outputPreview?: string;
  keyTakeaway: string;
}

export interface LessonTest {
  id: string;
  title: string;
  passingScorePercent: number; // e.g. 70
  estimatedMinutes?: number;
  xpBonus?: number;
  questions: Question[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  content: LessonContent;
  questions: Question[];
  test?: LessonTest;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  badgeId?: string;
  lessons: Lesson[];
}

export type CourseCategory = "Programming" | "Backend" | "Database" | "Web" | "Developer Tools" | "Systems";

export interface Course {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  category: CourseCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  totalLessons: number;
  estimatedHours: number;
  color: string;
  modules: Module[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  language?: string; // "java" | "python" | "javascript" | "cpp" | "go" | "rust" | "sql"
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  xpReward: number;
  problemStatement: string;
  inputExample?: string;
  outputExample?: string;
  starterCode: string;
  solutionCode?: string;
  hint: string;
  explanation: string;
  testCases: TestCase[];
}

export interface ProjectStep {
  id: string;
  title: string;
  instructions: string;
  codeHint: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  xpReward: number;
  description: string;
  requirements: string[];
  conceptsUsed: string[];
  steps: ProjectStep[];
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: "progression" | "streak" | "skill" | "special";
  xpBonus: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  icon: string;
  description: string;
  xpReward: number;
  requiredCount: number;
}

export interface Quest {
  id: string;
  title: string;
  icon: string;
  description: string;
  xpReward: number;
  badgeRewardId?: string;
  requiredLessonIds: string[];
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

export interface LessonTestScore {
  score: number;
  total: number;
  percentage: number;
  stars: number;
  passed: boolean;
  completedAt: string;
}

export type UserRole = "student" | "admin";

export interface UserState {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  agreedToPrivacyPolicy: boolean;
  privacyConsentDate?: string;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  streakHistory: string[]; // ISO dates
  hearts: number;
  maxHearts: number;
  lastHeartRegen: number; // timestamp
  completedLessons: string[]; // lessonIds
  lessonTestScores?: Record<string, LessonTestScore>;
  solvedChallenges: string[]; // challengeIds
  completedProjects: string[]; // projectIds
  unlockedBadges: string[]; // badgeIds
  mistakeLessonIds: string[]; // lessonIds where user made mistakes for spaced review
  learningPreference: string;
  experienceLevel: string;
  isPublicLeaderboard: boolean;
  dailyChallengeDoneDate: string;
  joinedDate: string;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  lastActiveDate: string;
  level: number;
  xp: number;
  completedLessonsCount: number;
  testsTakenCount: number;
  agreedToPrivacyPolicy: boolean;
  privacyConsentDate?: string;
}

export interface AdminMetricsData {
  totalUsers: number;
  activeToday: number;
  studentsCount: number;
  adminsCount: number;
  totalLessonsCompleted: number;
  totalTestsPassed: number;
  users: AdminUserRecord[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  isCurrentUser?: boolean;
}
