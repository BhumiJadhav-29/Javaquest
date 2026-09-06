import React from "react";
import { UserState, Course } from "../types";
import { getLevelForXp, BADGES } from "../data/questsAndBadges";
import { CODING_CHALLENGES } from "../data/challengesData";
import { COURSES } from "../data/coursesData";
import {
  Flame,
  Sparkles,
  Play,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  ArrowRight,
  Clock,
  RotateCcw,
  BookOpen,
  Globe,
} from "lucide-react";

interface DashboardViewProps {
  user: UserState;
  currentCourse: Course;
  onNavigateToCourse: (courseId: string) => void;
  onStartDailyChallenge: () => void;
  onNavigate: (view: string) => void;
  onOpenPromoDemo?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  currentCourse,
  onNavigateToCourse,
  onStartDailyChallenge,
  onNavigate,
  onOpenPromoDemo,
}) => {
  const levelInfo = getLevelForXp(user.xp);
  const dailyChallenge = CODING_CHALLENGES[0]; // Even or Odd daily challenge
  const today = new Date().toISOString().split("T")[0];
  const isDailyDone = user.dailyChallengeDoneDate === today;

  // Calculate course completion %
  const totalLessons = currentCourse.modules.flatMap((m) => m.lessons).length;
  const completedInCourse = currentCourse.modules
    .flatMap((m) => m.lessons)
    .filter((l) => user.completedLessons.includes(l.id)).length;
  const coursePercent = Math.round((completedInCourse / Math.max(1, totalLessons)) * 100);

  // Past 7 days streak dots
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split("T")[0];
    const isToday = i === 6;
    const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const active = user.streakHistory.includes(iso);
    return { dayName, iso, isToday, active };
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Greeting & Streak Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
              {levelInfo.title}
            </span>
            <span className="text-xs font-semibold text-orange-100">
              Level {user.level} of 10
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-sm text-orange-50 max-w-xl leading-relaxed">
            Consistency is the secret to software mastery. You are on a{" "}
            <strong>{user.streak}-day streak!</strong>
          </p>
          {onOpenPromoDemo && (
            <div className="pt-2">
              <button
                onClick={onOpenPromoDemo}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold border border-white/30 backdrop-blur transition-all hover:scale-105 shadow-sm"
              >
                <span>🎬 Watch JavaQuest AI Demo Video</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  NEW
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Streak Week Tracker */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 fill-amber-300 text-amber-300 animate-pulse" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-100">
                Streak
              </div>
              <div className="text-xl font-black">{user.streak} Days</div>
            </div>
          </div>

          <div className="h-8 w-px bg-white/20 mx-1" />

          {/* Mini 7 day dots */}
          <div className="flex items-center gap-1.5">
            {last7Days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-orange-200">
                  {d.dayName}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    d.active
                      ? "bg-amber-300 text-amber-900 shadow-sm"
                      : "bg-white/10 text-white/50 border border-white/20"
                  }`}
                >
                  {d.active ? "✓" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Continue Current Track */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Track
              </span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {coursePercent}% Complete
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-2xl">
                {currentCourse.icon}
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {currentCourse.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedInCourse} / {totalLessons} Lessons Finished
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 mb-4">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, coursePercent)}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onNavigate("learn")}
            className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>CONTINUE QUEST PATH</span>
          </button>
        </div>

        {/* Card 2: Today's Daily Challenge */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Daily Challenge
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> +50 XP
              </span>
            </div>

            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">
              {dailyChallenge.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {dailyChallenge.problemStatement}
            </p>
          </div>

          {isDailyDone ? (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed Today! Great job!</span>
            </div>
          ) : (
            <button
              onClick={onStartDailyChallenge}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SOLVE DAILY CHALLENGE</span>
            </button>
          )}
        </div>

        {/* Card 3: Level & XP Progression */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-orange-500" /> Level {user.level}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {user.xp} Total XP
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {levelInfo.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Next Rank: Level {Math.min(10, user.level + 1)}
                </p>
              </div>
            </div>

            {/* Level XP Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((user.xp / Math.max(1, levelInfo.maxXp)) * 100)
                  )}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">
              {levelInfo.maxXp === Infinity
                ? "Max Level Reached!"
                : `${levelInfo.maxXp - user.xp} XP to next level`}
            </div>
          </div>

          <button
            onClick={() => onNavigate("achievements")}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>VIEW BADGES & QUESTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Programming Language Tracks Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              <span>Multi-Language Learning Paths & Mastery Tests</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch languages anytime. Every lesson includes concept theory, guided checkpoints, and an exit test.
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
            {COURSES.length} Languages Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {COURSES.map((course) => {
            const isCurrent = course.id === currentCourse.id;
            const courseLessons = course.modules.flatMap((m) => m.lessons);
            const courseCompleted = courseLessons.filter((l) => user.completedLessons.includes(l.id)).length;
            const testPassedCount = courseLessons.filter((l) => user.lessonTestScores?.[l.id]?.percentage >= 70).length;

            return (
              <button
                key={course.id}
                onClick={() => {
                  onNavigateToCourse(course.id);
                  onNavigate("learn");
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isCurrent
                    ? "bg-gradient-to-b from-orange-50 to-amber-50/50 dark:from-orange-950/40 dark:to-slate-900 border-orange-400 dark:border-orange-600 shadow-md ring-2 ring-orange-500/20"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{course.icon}</span>
                  {isCurrent ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-xs">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      {course.difficulty}
                    </span>
                  )}
                </div>

                <div className="font-black text-sm text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {course.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {course.description}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>{courseLessons.length} Lessons</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    ⭐ {testPassedCount}/{courseLessons.length} Tests
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Launchpad & Weak Topics Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice & Projects Hub */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span>Interactive Arenas</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate("practice")}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-orange-500 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                ⌨️
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                Practice Arena
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                20+ Hand-crafted Java coding challenges
              </div>
            </button>

            <button
              onClick={() => onNavigate("projects")}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-orange-500 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                🏗️
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                Projects Studio
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Build ATM, Calculator & Spring Boot REST API
              </div>
            </button>
          </div>
        </div>

        {/* Spaced Review & Mistakes practice */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-500" />
              <span>Smart Spaced Review</span>
            </h3>
            {user.mistakeLessonIds.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                {user.mistakeLessonIds.length} review item(s)
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            JavaQuest tracks the concepts you find challenging and schedules bite-sized reviews so knowledge sticks in long-term memory.
          </p>

          <button
            onClick={() => onNavigate("review")}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>START REVIEW SESSION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            <span>Recent Badges</span>
          </h3>
          <button
            onClick={() => onNavigate("achievements")}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            View All ({BADGES.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {BADGES.map((b) => {
            const isUnlocked = user.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40 grayscale"
                }`}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                  {b.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {b.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
