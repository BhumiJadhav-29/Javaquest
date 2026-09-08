import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import pg from "pg";
import { DatabaseSync } from "node:sqlite";

export interface StoredAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  avatar: string;
  agreedToPrivacyPolicy: boolean;
  privacyConsentDate: string;
  joinedDate: string;
  lastActiveDate: string;
  level: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  solvedChallenges: string[];
  completedProjects: string[];
  lessonTestScores: Record<string, any>;
  unlockedBadges: string[];
  hearts: number;
  maxHearts: number;
  token?: string;
}

export interface QuizSubmissionRecord {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  total: number;
  percentage: number;
  stars: number;
  passed: boolean;
  xpAwarded: number;
  answersJson?: string;
  submittedAt: string;
}

export interface AdminStatsResult {
  totalUsers: number;
  activeToday: number;
  studentsCount: number;
  adminsCount: number;
  totalLessonsCompleted: number;
  totalTestsPassed: number;
  totalQuizSubmissions: number;
  totalAiInteractions: number;
  users: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
    joinedDate: string;
    lastActiveDate: string;
    level: number;
    xp: number;
    completedLessonsCount: number;
    testsTakenCount: number;
    agreedToPrivacyPolicy: boolean;
    privacyConsentDate: string;
  }>;
}

class DatabaseManager {
  private pgPool: pg.Pool | null = null;
  private sqliteDb: DatabaseSync | null = null;
  private isPostgres = false;
  private initialized = false;

  public async init(): Promise<void> {
    if (this.initialized) return;

    const databaseUrl = process.env.DATABASE_URL?.trim();

    if (databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
      try {
        console.log("Connecting to PostgreSQL database via connection pool...");
        this.pgPool = new pg.Pool({
          connectionString: databaseUrl,
          max: 20, // 20 pooled connections to support 200 concurrent users easily
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
          ssl: databaseUrl.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
        });

        // Test connection
        const client = await this.pgPool.connect();
        client.release();
        this.isPostgres = true;
        console.log("PostgreSQL connected successfully.");
        await this.initPostgresSchema();
      } catch (err: any) {
        console.warn("PostgreSQL connection failed. Falling back to persistent local SQLite:", err.message);
        this.pgPool = null;
        this.isPostgres = false;
        this.initSqlite();
      }
    } else {
      this.initSqlite();
    }

    await this.seedInitialAccountsIfEmpty();
    this.initialized = true;
  }

  private initSqlite(): void {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "javaquest.sqlite");
    console.log(`Using persistent local SQLite database at ${dbPath}`);
    this.sqliteDb = new DatabaseSync(dbPath);

    // Optimize SQLite for high concurrency (Write-Ahead Logging + busy timeout)
    this.sqliteDb.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      PRAGMA synchronous = NORMAL;
      PRAGMA cache_size = -64000;

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        avatar TEXT DEFAULT '☕',
        agreed_to_privacy_policy INTEGER DEFAULT 1,
        privacy_consent_date TEXT,
        joined_date TEXT,
        last_active_date TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 50,
        streak INTEGER DEFAULT 1,
        hearts INTEGER DEFAULT 5,
        max_hearts INTEGER DEFAULT 5,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT PRIMARY KEY,
        completed_lessons TEXT DEFAULT '[]',
        lesson_test_scores TEXT DEFAULT '{}',
        solved_challenges TEXT DEFAULT '[]',
        completed_projects TEXT DEFAULT '[]',
        unlocked_badges TEXT DEFAULT '[]',
        mistake_lesson_ids TEXT DEFAULT '[]',
        streak_history TEXT DEFAULT '[]',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        stars INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        xp_awarded INTEGER NOT NULL,
        answers_json TEXT,
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_interactions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        mode TEXT,
        status TEXT,
        prompt_tokens INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_submissions(user_id, lesson_id);
    `);
  }

  private async initPostgresSchema(): Promise<void> {
    if (!this.pgPool) return;
    await this.pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(64) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(16) NOT NULL DEFAULT 'student',
        avatar VARCHAR(32) DEFAULT '☕',
        agreed_to_privacy_policy BOOLEAN DEFAULT TRUE,
        privacy_consent_date TEXT,
        joined_date TEXT,
        last_active_date TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 50,
        streak INTEGER DEFAULT 1,
        hearts INTEGER DEFAULT 5,
        max_hearts INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        completed_lessons TEXT DEFAULT '[]',
        lesson_test_scores TEXT DEFAULT '{}',
        solved_challenges TEXT DEFAULT '[]',
        completed_projects TEXT DEFAULT '[]',
        unlocked_badges TEXT DEFAULT '[]',
        mistake_lesson_ids TEXT DEFAULT '[]',
        streak_history TEXT DEFAULT '[]',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        lesson_id VARCHAR(64) NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        stars INTEGER NOT NULL,
        passed BOOLEAN NOT NULL,
        xp_awarded INTEGER NOT NULL,
        answers_json TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_interactions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        mode VARCHAR(32),
        status VARCHAR(32),
        prompt_tokens INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_submissions(user_id, lesson_id);
    `);
  }

  private async seedInitialAccountsIfEmpty(): Promise<void> {
    const existing = await this.getUserByEmail("admin@javaquest.dev");
    if (existing) return; // Already seeded

    console.log("Seeding initial demo and admin accounts with bcrypt password hashes...");

    const seedUsers = [
      {
        id: "admin_bhumi_01",
        username: "Bhumi_Admin",
        email: "jadhavbhumi02@gmail.com",
        plainPassword: process.env.ADMIN_SEED_PASSWORD || "AdminPassword123!",
        role: "admin" as const,
        avatar: "🛡️",
        level: 5,
        xp: 1250,
        streak: 15,
        completedLessons: ["java_1_1", "java_1_2", "py_1_1", "js_1_1"],
        solvedChallenges: ["ch_hello_world", "ch_variables"],
        completedProjects: ["proj_student_grade"],
        lessonTestScores: {
          java_1_1: { score: 3, total: 3, percentage: 100, stars: 3, passed: true },
        },
        unlockedBadges: ["first_lesson", "first_code", "xp_100"],
      },
      {
        id: "admin_sys_02",
        username: "AdminMaster",
        email: "admin@javaquest.dev",
        plainPassword: process.env.ADMIN_SEED_PASSWORD || "Admin@123",
        role: "admin" as const,
        avatar: "👑",
        level: 6,
        xp: 1800,
        streak: 20,
        completedLessons: ["java_1_1", "java_1_2", "java_1_3"],
        solvedChallenges: ["ch_hello_world", "ch_variables", "ch_fizzbuzz"],
        completedProjects: ["proj_student_grade"],
        lessonTestScores: {},
        unlockedBadges: ["first_lesson", "first_code", "xp_100", "streak_7"],
      },
      {
        id: "user_alex_01",
        username: "AlexDeveloper",
        email: "alex@javaquest.dev",
        plainPassword: "Student@123",
        role: "student" as const,
        avatar: "☕",
        level: 2,
        xp: 140,
        streak: 3,
        completedLessons: ["java_1_1", "java_1_2"],
        solvedChallenges: ["ch_hello_world"],
        completedProjects: [],
        lessonTestScores: {
          java_1_1: { score: 3, total: 3, percentage: 100, stars: 3, passed: true },
        },
        unlockedBadges: ["first_lesson", "first_code"],
      },
      {
        id: "user_sarah_02",
        username: "Sarah_Java",
        email: "sarah.codes@example.com",
        plainPassword: "Student@123",
        role: "student" as const,
        avatar: "✨",
        level: 3,
        xp: 580,
        streak: 4,
        completedLessons: ["java_1_1", "java_1_2", "java_1_3"],
        solvedChallenges: ["ch_hello_world", "ch_variables"],
        completedProjects: [],
        lessonTestScores: {},
        unlockedBadges: ["first_lesson", "first_code", "xp_100"],
      },
      {
        id: "user_rahul_03",
        username: "Rahul_Dev",
        email: "rahul.dev@example.com",
        plainPassword: "Student@123",
        role: "student" as const,
        avatar: "🚀",
        level: 5,
        xp: 1280,
        streak: 12,
        completedLessons: ["java_1_1", "java_1_2", "java_1_3", "java_2_1"],
        solvedChallenges: ["ch_hello_world", "ch_variables", "ch_fizzbuzz"],
        completedProjects: ["proj_student_grade"],
        lessonTestScores: {},
        unlockedBadges: ["first_lesson", "first_code", "xp_100", "streak_7"],
      },
    ];

    const today = new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();

    for (const item of seedUsers) {
      const passwordHash = await bcrypt.hash(item.plainPassword, 10);
      const user: StoredAccount = {
        id: item.id,
        username: item.username,
        email: item.email.toLowerCase(),
        passwordHash,
        role: item.role,
        avatar: item.avatar,
        agreedToPrivacyPolicy: true,
        privacyConsentDate: nowIso,
        joinedDate: today,
        lastActiveDate: today,
        level: item.level,
        xp: item.xp,
        streak: item.streak,
        completedLessons: item.completedLessons,
        solvedChallenges: item.solvedChallenges,
        completedProjects: item.completedProjects,
        lessonTestScores: item.lessonTestScores,
        unlockedBadges: item.unlockedBadges,
        hearts: 5,
        maxHearts: 5,
      };

      await this.createUser(user);
    }
  }

  public async getUserByEmail(email: string): Promise<StoredAccount | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE LOWER(u.email) = $1 LIMIT 1`,
        [cleanEmail]
      );
      if (res.rows.length === 0) return null;
      return this.mapUserRow(res.rows[0]);
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE LOWER(u.email) = ? LIMIT 1`
      );
      const row = stmt.get(cleanEmail) as any;
      if (!row) return null;
      return this.mapUserRow(row);
    }
    return null;
  }

  public async getUserById(id: string): Promise<StoredAccount | null> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE u.id = $1 LIMIT 1`,
        [id]
      );
      if (res.rows.length === 0) return null;
      return this.mapUserRow(res.rows[0]);
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE u.id = ? LIMIT 1`
      );
      const row = stmt.get(id) as any;
      if (!row) return null;
      return this.mapUserRow(row);
    }
    return null;
  }

  public async getUserByIdentifier(identifier: string): Promise<StoredAccount | null> {
    const clean = identifier.trim().toLowerCase();
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE LOWER(u.email) = $1 OR LOWER(u.username) = $1 LIMIT 1`,
        [clean]
      );
      if (res.rows.length === 0) return null;
      return this.mapUserRow(res.rows[0]);
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(
        `SELECT u.*, p.completed_lessons, p.lesson_test_scores, p.solved_challenges, 
                p.completed_projects, p.unlocked_badges, p.mistake_lesson_ids, p.streak_history
         FROM users u
         LEFT JOIN user_progress p ON u.id = p.user_id
         WHERE LOWER(u.email) = ? OR LOWER(u.username) = ? LIMIT 1`
      );
      const row = stmt.get(clean, clean) as any;
      if (!row) return null;
      return this.mapUserRow(row);
    }
    return null;
  }

  public async createUser(user: StoredAccount): Promise<StoredAccount> {
    const cleanEmail = user.email.toLowerCase();
    if (this.isPostgres && this.pgPool) {
      const client = await this.pgPool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `INSERT INTO users (id, username, email, password_hash, role, avatar, agreed_to_privacy_policy,
                              privacy_consent_date, joined_date, last_active_date, level, xp, streak, hearts, max_hearts)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            user.id,
            user.username,
            cleanEmail,
            user.passwordHash,
            user.role,
            user.avatar || "☕",
            user.agreedToPrivacyPolicy,
            user.privacyConsentDate,
            user.joinedDate,
            user.lastActiveDate,
            user.level || 1,
            user.xp || 50,
            user.streak || 1,
            user.hearts || 5,
            user.maxHearts || 5,
          ]
        );
        await client.query(
          `INSERT INTO user_progress (user_id, completed_lessons, lesson_test_scores, solved_challenges,
                                     completed_projects, unlocked_badges, mistake_lesson_ids, streak_history)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            user.id,
            JSON.stringify(user.completedLessons || []),
            JSON.stringify(user.lessonTestScores || {}),
            JSON.stringify(user.solvedChallenges || []),
            JSON.stringify(user.completedProjects || []),
            JSON.stringify(user.unlockedBadges || []),
            JSON.stringify([]),
            JSON.stringify([user.lastActiveDate]),
          ]
        );
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    } else if (this.sqliteDb) {
      const stmtUser = this.sqliteDb.prepare(
        `INSERT INTO users (id, username, email, password_hash, role, avatar, agreed_to_privacy_policy,
                            privacy_consent_date, joined_date, last_active_date, level, xp, streak, hearts, max_hearts)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmtUser.run(
        user.id,
        user.username,
        cleanEmail,
        user.passwordHash,
        user.role,
        user.avatar || "☕",
        user.agreedToPrivacyPolicy ? 1 : 0,
        user.privacyConsentDate,
        user.joinedDate,
        user.lastActiveDate,
        user.level || 1,
        user.xp || 50,
        user.streak || 1,
        user.hearts || 5,
        user.maxHearts || 5
      );

      const stmtProgress = this.sqliteDb.prepare(
        `INSERT INTO user_progress (user_id, completed_lessons, lesson_test_scores, solved_challenges,
                                   completed_projects, unlocked_badges, mistake_lesson_ids, streak_history)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmtProgress.run(
        user.id,
        JSON.stringify(user.completedLessons || []),
        JSON.stringify(user.lessonTestScores || {}),
        JSON.stringify(user.solvedChallenges || []),
        JSON.stringify(user.completedProjects || []),
        JSON.stringify(user.unlockedBadges || []),
        JSON.stringify([]),
        JSON.stringify([user.lastActiveDate])
      );
    }
    return user;
  }

  public async updateUser(id: string, updates: Partial<StoredAccount>): Promise<StoredAccount | null> {
    const existing = await this.getUserById(id);
    if (!existing) return null;

    const merged: StoredAccount = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable
      email: updates.email ? updates.email.toLowerCase() : existing.email,
    };

    if (this.isPostgres && this.pgPool) {
      const client = await this.pgPool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `UPDATE users SET
             username = $1, email = $2, role = $3, avatar = $4,
             last_active_date = $5, level = $6, xp = $7, streak = $8,
             hearts = $9, max_hearts = $10, password_hash = $11
           WHERE id = $12`,
          [
            merged.username,
            merged.email,
            merged.role,
            merged.avatar,
            merged.lastActiveDate,
            merged.level,
            merged.xp,
            merged.streak,
            merged.hearts,
            merged.maxHearts,
            merged.passwordHash,
            id,
          ]
        );

        if (
          updates.completedLessons !== undefined ||
          updates.lessonTestScores !== undefined ||
          updates.solvedChallenges !== undefined ||
          updates.completedProjects !== undefined ||
          updates.unlockedBadges !== undefined
        ) {
          await client.query(
            `UPDATE user_progress SET
               completed_lessons = $1, lesson_test_scores = $2, solved_challenges = $3,
               completed_projects = $4, unlocked_badges = $5, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $6`,
            [
              JSON.stringify(merged.completedLessons),
              JSON.stringify(merged.lessonTestScores),
              JSON.stringify(merged.solvedChallenges),
              JSON.stringify(merged.completedProjects),
              JSON.stringify(merged.unlockedBadges),
              id,
            ]
          );
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    } else if (this.sqliteDb) {
      const stmtUser = this.sqliteDb.prepare(
        `UPDATE users SET
           username = ?, email = ?, role = ?, avatar = ?,
           last_active_date = ?, level = ?, xp = ?, streak = ?,
           hearts = ?, max_hearts = ?, password_hash = ?
         WHERE id = ?`
      );
      stmtUser.run(
        merged.username,
        merged.email,
        merged.role,
        merged.avatar,
        merged.lastActiveDate,
        merged.level,
        merged.xp,
        merged.streak,
        merged.hearts,
        merged.maxHearts,
        merged.passwordHash,
        id
      );

      if (
        updates.completedLessons !== undefined ||
        updates.lessonTestScores !== undefined ||
        updates.solvedChallenges !== undefined ||
        updates.completedProjects !== undefined ||
        updates.unlockedBadges !== undefined
      ) {
        const stmtProg = this.sqliteDb.prepare(
          `UPDATE user_progress SET
             completed_lessons = ?, lesson_test_scores = ?, solved_challenges = ?,
             completed_projects = ?, unlocked_badges = ?, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = ?`
        );
        stmtProg.run(
          JSON.stringify(merged.completedLessons),
          JSON.stringify(merged.lessonTestScores),
          JSON.stringify(merged.solvedChallenges),
          JSON.stringify(merged.completedProjects),
          JSON.stringify(merged.unlockedBadges),
          id
        );
      }
    }

    return merged;
  }

  public async saveProgress(userId: string, progress: any): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const today = new Date().toISOString().split("T")[0];
    const updates: Partial<StoredAccount> = {
      lastActiveDate: today,
    };

    if (Array.isArray(progress.completedLessons)) updates.completedLessons = progress.completedLessons;
    if (progress.lessonTestScores && typeof progress.lessonTestScores === "object") {
      updates.lessonTestScores = progress.lessonTestScores;
    }
    if (Array.isArray(progress.solvedChallenges)) updates.solvedChallenges = progress.solvedChallenges;
    if (Array.isArray(progress.completedProjects)) updates.completedProjects = progress.completedProjects;
    if (Array.isArray(progress.unlockedBadges)) updates.unlockedBadges = progress.unlockedBadges;
    if (typeof progress.xp === "number" && progress.xp >= 0) updates.xp = progress.xp;
    if (typeof progress.level === "number" && progress.level > 0) updates.level = progress.level;
    if (typeof progress.streak === "number" && progress.streak >= 0) updates.streak = progress.streak;
    if (typeof progress.hearts === "number") updates.hearts = Math.max(0, Math.min(5, progress.hearts));

    await this.updateUser(userId, updates);
    return true;
  }

  public async recordQuizSubmission(sub: QuizSubmissionRecord): Promise<void> {
    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        `INSERT INTO quiz_submissions (id, user_id, lesson_id, score, total, percentage, stars, passed, xp_awarded, answers_json, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          sub.id,
          sub.userId,
          sub.lessonId,
          sub.score,
          sub.total,
          sub.percentage,
          sub.stars,
          sub.passed,
          sub.xpAwarded,
          sub.answersJson || "{}",
          sub.submittedAt,
        ]
      );
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(
        `INSERT INTO quiz_submissions (id, user_id, lesson_id, score, total, percentage, stars, passed, xp_awarded, answers_json, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run(
        sub.id,
        sub.userId,
        sub.lessonId,
        sub.score,
        sub.total,
        sub.percentage,
        sub.stars,
        sub.passed ? 1 : 0,
        sub.xpAwarded,
        sub.answersJson || "{}",
        sub.submittedAt
      );
    }
  }

  public async recordAiInteraction(record: { userId?: string; mode?: string; status?: string; promptTokens?: number }): Promise<void> {
    const id = `ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      if (this.isPostgres && this.pgPool) {
        await this.pgPool.query(
          `INSERT INTO ai_interactions (id, user_id, mode, status, prompt_tokens) VALUES ($1, $2, $3, $4, $5)`,
          [id, record.userId || "anonymous", record.mode || "general", record.status || "success", record.promptTokens || 0]
        );
      } else if (this.sqliteDb) {
        const stmt = this.sqliteDb.prepare(
          `INSERT INTO ai_interactions (id, user_id, mode, status, prompt_tokens) VALUES (?, ?, ?, ?, ?)`
        );
        stmt.run(id, record.userId || "anonymous", record.mode || "general", record.status || "success", record.promptTokens || 0);
      }
    } catch {
      // Non-blocking telemetry
    }
  }

  public async deleteUser(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase();
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query(`DELETE FROM users WHERE LOWER(email) = $1`, [cleanEmail]);
      return (res.rowCount ?? 0) > 0;
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`DELETE FROM users WHERE LOWER(email) = ?`);
      const info = stmt.run(cleanEmail);
      return info.changes > 0;
    }
    return false;
  }

  public async getAdminStats(): Promise<AdminStatsResult> {
    let rows: any[] = [];
    let totalSubmissions = 0;
    let totalAi = 0;

    if (this.isPostgres && this.pgPool) {
      const userRes = await this.pgPool.query(`
        SELECT u.id, u.username, u.email, u.role, u.joined_date, u.last_active_date, 
               u.level, u.xp, u.agreed_to_privacy_policy, u.privacy_consent_date,
               p.completed_lessons, p.lesson_test_scores
        FROM users u
        LEFT JOIN user_progress p ON u.id = p.user_id
        ORDER BY u.created_at DESC
      `);
      rows = userRes.rows;

      const subRes = await this.pgPool.query(`SELECT COUNT(*) as count FROM quiz_submissions`);
      totalSubmissions = parseInt(subRes.rows[0]?.count || "0", 10);

      const aiRes = await this.pgPool.query(`SELECT COUNT(*) as count FROM ai_interactions`);
      totalAi = parseInt(aiRes.rows[0]?.count || "0", 10);
    } else if (this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        SELECT u.id, u.username, u.email, u.role, u.joined_date, u.last_active_date, 
               u.level, u.xp, u.agreed_to_privacy_policy, u.privacy_consent_date,
               p.completed_lessons, p.lesson_test_scores
        FROM users u
        LEFT JOIN user_progress p ON u.id = p.user_id
        ORDER BY u.created_at DESC
      `);
      rows = stmt.all() as any[];

      const subStmt = this.sqliteDb.prepare(`SELECT COUNT(*) as count FROM quiz_submissions`);
      totalSubmissions = Number((subStmt.get() as any)?.count || 0);

      const aiStmt = this.sqliteDb.prepare(`SELECT COUNT(*) as count FROM ai_interactions`);
      totalAi = Number((aiStmt.get() as any)?.count || 0);
    }

    const today = new Date().toISOString().split("T")[0];
    const totalUsers = rows.length;
    const activeToday = rows.filter((r) => r.last_active_date === today).length;
    const studentsCount = rows.filter((r) => r.role === "student").length;
    const adminsCount = rows.filter((r) => r.role === "admin").length;

    let totalLessonsCompleted = 0;
    let totalTestsPassed = 0;

    const safeUsers = rows.map((r) => {
      let completedLessons: string[] = [];
      let lessonTestScores: Record<string, any> = {};

      try {
        completedLessons = typeof r.completed_lessons === "string" ? JSON.parse(r.completed_lessons) : r.completed_lessons || [];
      } catch {}
      try {
        lessonTestScores = typeof r.lesson_test_scores === "string" ? JSON.parse(r.lesson_test_scores) : r.lesson_test_scores || {};
      } catch {}

      totalLessonsCompleted += completedLessons.length;
      totalTestsPassed += Object.values(lessonTestScores).filter((t: any) => t?.passed).length;

      return {
        id: r.id,
        username: r.username,
        email: r.email,
        role: r.role,
        joinedDate: r.joined_date || today,
        lastActiveDate: r.last_active_date || today,
        level: r.level || 1,
        xp: r.xp || 0,
        completedLessonsCount: completedLessons.length,
        testsTakenCount: Object.keys(lessonTestScores).length,
        agreedToPrivacyPolicy: Boolean(r.agreed_to_privacy_policy),
        privacyConsentDate: r.privacy_consent_date || today,
      };
    });

    return {
      totalUsers,
      activeToday,
      studentsCount,
      adminsCount,
      totalLessonsCompleted,
      totalTestsPassed,
      totalQuizSubmissions: totalSubmissions,
      totalAiInteractions: totalAi,
      users: safeUsers,
    };
  }

  public async isHealthy(): Promise<boolean> {
    try {
      if (this.isPostgres && this.pgPool) {
        const res = await this.pgPool.query("SELECT 1 as ok");
        return res.rows.length > 0;
      } else if (this.sqliteDb) {
        const row = this.sqliteDb.prepare("SELECT 1 as ok").get() as any;
        return row?.ok === 1;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getEngine(): "postgresql" | "sqlite" {
    return this.isPostgres ? "postgresql" : "sqlite";
  }

  private mapUserRow(row: any): StoredAccount {
    let completedLessons: string[] = [];
    let lessonTestScores: Record<string, any> = {};
    let solvedChallenges: string[] = [];
    let completedProjects: string[] = [];
    let unlockedBadges: string[] = [];

    try {
      completedLessons = typeof row.completed_lessons === "string" ? JSON.parse(row.completed_lessons) : row.completed_lessons || [];
    } catch {}
    try {
      lessonTestScores = typeof row.lesson_test_scores === "string" ? JSON.parse(row.lesson_test_scores) : row.lesson_test_scores || {};
    } catch {}
    try {
      solvedChallenges = typeof row.solved_challenges === "string" ? JSON.parse(row.solved_challenges) : row.solved_challenges || [];
    } catch {}
    try {
      completedProjects = typeof row.completed_projects === "string" ? JSON.parse(row.completed_projects) : row.completed_projects || [];
    } catch {}
    try {
      unlockedBadges = typeof row.unlocked_badges === "string" ? JSON.parse(row.unlocked_badges) : row.unlocked_badges || [];
    } catch {}

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as "student" | "admin",
      avatar: row.avatar || "☕",
      agreedToPrivacyPolicy: Boolean(row.agreed_to_privacy_policy),
      privacyConsentDate: row.privacy_consent_date,
      joinedDate: row.joined_date,
      lastActiveDate: row.last_active_date,
      level: row.level,
      xp: row.xp,
      streak: row.streak,
      completedLessons,
      solvedChallenges,
      completedProjects,
      lessonTestScores,
      unlockedBadges,
      hearts: row.hearts,
      maxHearts: row.max_hearts,
    };
  }
}

export const db = new DatabaseManager();
