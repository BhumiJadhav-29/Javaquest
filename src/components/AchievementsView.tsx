import React from "react";
import { UserState } from "../types";
import { BADGES, LEVELS, DAILY_QUESTS } from "../data/questsAndBadges";
import { Award, CheckCircle2, Lock, Sparkles, Trophy, Zap, Star } from "lucide-react";

interface AchievementsViewProps {
  user: UserState;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user }) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Hall of Mastery
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Quests, Badges & Level Ranks
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Complete daily challenges, level up your engineering skills, and collect prestigious developer badges.
        </p>
      </div>

      {/* Section 1: Active Quests */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Active Quests</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_QUESTS.map((quest) => {
            // Compute real progress
            let current = 0;
            if (quest.id === "quest_daily_lesson") {
              current = Math.min(quest.requiredCount, user.completedLessons.length);
            } else if (quest.id === "quest_daily_challenge") {
              current = Math.min(quest.requiredCount, user.solvedChallenges.length);
            } else if (quest.id === "quest_streak_3") {
              current = Math.min(quest.requiredCount, user.streak);
            }

            const isDone = current >= quest.requiredCount;
            const progress = Math.min(100, Math.round((current / quest.requiredCount) * 100));

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{quest.icon}</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> +{quest.xpReward} XP
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                  {quest.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {quest.description}
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Progress</span>
                    <span>
                      {current} / {quest.requiredCount}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDone ? "bg-emerald-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Badges Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <span>Badge Collection</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {user.unlockedBadges.length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = user.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? "bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-md shadow-amber-500/5"
                    : "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-50 grayscale"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  {badge.icon}
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                  {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {badge.description}
                </p>

                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {badge.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: 10-Level Mastery Ladder */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>10-Level Developer Ranks</span>
        </h2>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden">
          {LEVELS.map((lvl) => {
            const isReached = user.level >= lvl.level;
            const isCurrent = user.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  isCurrent
                    ? "bg-orange-50/70 dark:bg-orange-950/40"
                    : isReached
                    ? "bg-white dark:bg-slate-900"
                    : "opacity-60 bg-slate-50/50 dark:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                      isCurrent
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400"
                        : isReached
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {lvl.level}
                  </div>

                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{lvl.title}</span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-500 text-white">
                          Current Rank
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {lvl.minXp} - {lvl.maxXp === Infinity ? "∞" : lvl.maxXp} XP required
                    </div>
                  </div>
                </div>

                <div>
                  {isReached ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
