import { Badge, DailyQuest, LevelInfo, Quest } from "../types";

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Beginner", minXp: 0, maxXp: 100, badge: "🌱" },
  { level: 2, title: "Explorer", minXp: 100, maxXp: 300, badge: "🧭" },
  { level: 3, title: "Coder", minXp: 300, maxXp: 600, badge: "💻" },
  { level: 4, title: "Developer", minXp: 600, maxXp: 1000, badge: "⚡" },
  { level: 5, title: "Java Apprentice", minXp: 1000, maxXp: 1500, badge: "☕" },
  { level: 6, title: "Java Developer", minXp: 1500, maxXp: 2200, badge: "🛡️" },
  { level: 7, title: "Backend Developer", minXp: 2200, maxXp: 3000, badge: "🚀" },
  { level: 8, title: "Software Engineer", minXp: 3000, maxXp: 4000, badge: "🏰" },
  { level: 9, title: "Code Master", minXp: 4000, maxXp: 5500, badge: "⚔️" },
  { level: 10, title: "JavaQuest Legend", minXp: 5500, maxXp: 99999, badge: "👑" },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export const BADGES: Badge[] = [
  {
    id: "first_lesson",
    title: "First Lesson",
    icon: "🎯",
    description: "Completed your very first interactive lesson on JavaQuest.",
    category: "progression",
    xpBonus: 25,
  },
  {
    id: "first_code",
    title: "First Code",
    icon: "✨",
    description: "Successfully executed and passed your first code challenge.",
    category: "progression",
    xpBonus: 25,
  },
  {
    id: "xp_100",
    title: "Century Club",
    icon: "⭐",
    description: "Accumulated your first 100 XP on your journey.",
    category: "progression",
    xpBonus: 50,
  },
  {
    id: "streak_7",
    title: "7 Day Streak",
    icon: "🔥",
    description: "Maintained a continuous 7-day coding streak.",
    category: "streak",
    xpBonus: 100,
  },
  {
    id: "java_beginner",
    title: "Java Beginner",
    icon: "☕",
    description: "Finished all modules in the Java Beginner track.",
    category: "skill",
    xpBonus: 150,
  },
  {
    id: "oop_master",
    title: "OOP Master",
    icon: "🧩",
    description: "Mastered Classes, Inheritance, Polymorphism, and Encapsulation.",
    category: "skill",
    xpBonus: 200,
  },
  {
    id: "sql_explorer",
    title: "SQL Explorer",
    icon: "🗄️",
    description: "Completed the relational database and queries path.",
    category: "skill",
    xpBonus: 120,
  },
  {
    id: "jdbc_developer",
    title: "JDBC Developer",
    icon: "🔌",
    description: "Connected Java with relational databases via PreparedStatement.",
    category: "skill",
    xpBonus: 150,
  },
  {
    id: "spring_beginner",
    title: "Spring Beginner",
    icon: "🌱",
    description: "Learned Dependency Injection, Inversion of Control, and Beans.",
    category: "skill",
    xpBonus: 150,
  },
  {
    id: "spring_boot_dev",
    title: "Spring Boot Developer",
    icon: "🍃",
    description: "Built REST controllers, service layers, and database APIs.",
    category: "skill",
    xpBonus: 200,
  },
  {
    id: "hibernate_hero",
    title: "Hibernate Hero",
    icon: "🏛️",
    description: "Conquered Object-Relational Mapping (ORM) and JPA entities.",
    category: "skill",
    xpBonus: 180,
  },
  {
    id: "challenges_10",
    title: "10 Coding Challenges",
    icon: "🧠",
    description: "Solved 10 interactive algorithmic and syntax coding problems.",
    category: "progression",
    xpBonus: 150,
  },
  {
    id: "project_completed",
    title: "Project Completed",
    icon: "🏆",
    description: "Completed an end-to-end practical application project.",
    category: "special",
    xpBonus: 250,
  },
  {
    id: "code_master",
    title: "Code Master",
    icon: "👑",
    description: "Reached Level 9 with supreme Java knowledge and problem solving.",
    category: "special",
    xpBonus: 500,
  },
];

export const QUESTS: Quest[] = [
  {
    id: "quest_java_basics",
    title: "Java Fundamentals Quest",
    icon: "🚀",
    description: "Complete Variables, Data Types, Operators, Conditions, and Loops.",
    xpReward: 100,
    badgeRewardId: "java_beginner",
    requiredLessonIds: ["java_1_1", "java_1_2", "java_1_3", "java_1_4", "java_1_5"],
  },
  {
    id: "quest_control_flow",
    title: "Logic & Control Flow Quest",
    icon: "🔀",
    description: "Conquer if/else branches, switch statements, and loop iterations.",
    xpReward: 120,
    requiredLessonIds: ["java_2_1", "java_2_2", "java_2_3", "java_2_4", "java_2_5"],
  },
  {
    id: "quest_oop",
    title: "OOP Mastery Quest",
    icon: "🏛️",
    description: "Master Classes, Objects, Inheritance, Polymorphism, and Encapsulation.",
    xpReward: 200,
    badgeRewardId: "oop_master",
    requiredLessonIds: ["java_4_1", "java_4_2", "java_4_3", "java_4_4", "java_4_5"],
  },
  {
    id: "quest_collections",
    title: "Collections & Exceptions Quest",
    icon: "📦",
    description: "Learn ArrayList, HashMap, Try-Catch blocks, and Streams.",
    xpReward: 180,
    requiredLessonIds: ["java_5_1", "java_5_2", "java_5_3", "java_5_4", "java_5_5"],
  },
];

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "quest_daily_lesson",
    title: "Lesson Conqueror",
    icon: "🎯",
    description: "Complete at least 1 interactive lesson today.",
    xpReward: 30,
    requiredCount: 1,
  },
  {
    id: "quest_daily_challenge",
    title: "Code Challenger",
    icon: "⚡",
    description: "Solve at least 1 code challenge in the Practice Arena.",
    xpReward: 40,
    requiredCount: 1,
  },
  {
    id: "quest_streak_3",
    title: "Streak Guardian",
    icon: "🔥",
    description: "Maintain an active streak of 3 or more days.",
    xpReward: 50,
    requiredCount: 3,
  },
];

