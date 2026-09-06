import React, { useState } from "react";
import { UserState } from "../types";
import { getLeaderboardEntries, saveUserState } from "../services/storageService";
import { Trophy, Flame, Sparkles, Award, Shield, User } from "lucide-react";

interface LeaderboardViewProps {
  user: UserState;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user }) => {
  const [filter, setFilter] = useState<"weekly" | "allTime">("weekly");
  const entries = getLeaderboardEntries();

  const togglePublic = () => {
    user.isPublicLeaderboard = !user.isPublicLeaderboard;
    saveUserState({ ...user });
  };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Community Arena
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Global XP Leaderboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Learn with thousands of developers worldwide. Resets every Sunday midnight UTC.
          </p>
        </div>

        {/* Privacy Switch */}
        <button
          onClick={togglePublic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-orange-500" />
          <span>{user.isPublicLeaderboard ? "Public on Leaderboard" : "Private Profile"}</span>
        </button>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 pb-2 items-end">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl mb-1">{top3[1].avatar}</div>
            <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center mb-1.5 shadow-sm">
              2
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white text-center truncate max-w-[100px]">
              {top3[1].username}
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {top3[1].xp} XP
            </div>
            <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/60 rounded-t-2xl mt-3 flex items-center justify-center font-black text-slate-400 text-lg">
              🥈
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl mb-1 scale-110">{top3[0].avatar}</div>
            <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center mb-1.5 shadow-md ring-2 ring-amber-300">
              1
            </div>
            <div className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white text-center truncate max-w-[120px]">
              {top3[0].username}
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
              {top3[0].xp} XP
            </div>
            <div className="w-full h-32 bg-gradient-to-t from-amber-300 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/40 rounded-t-2xl mt-3 flex items-center justify-center font-black text-amber-600 text-2xl shadow-md">
              👑
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl mb-1">{top3[2].avatar}</div>
            <div className="w-7 h-7 rounded-full bg-orange-300 text-orange-950 font-black text-xs flex items-center justify-center mb-1.5 shadow-sm">
              3
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white text-center truncate max-w-[100px]">
              {top3[2].username}
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {top3[2].xp} XP
            </div>
            <div className="w-full h-20 bg-gradient-to-t from-orange-200 to-orange-100 dark:from-orange-950/60 dark:to-orange-900/40 rounded-t-2xl mt-3 flex items-center justify-center font-black text-orange-400 text-lg">
              🥉
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Developer</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Streak</span>
            <span>Score (XP)</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {entries.map((entry) => {
            const isUser = entry.isCurrentUser;

            return (
              <div
                key={entry.id}
                className={`px-4 py-3.5 flex items-center justify-between transition-colors ${
                  isUser
                    ? "bg-orange-50 dark:bg-orange-950/40 font-bold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 text-center text-xs font-black ${
                      entry.rank === 1
                        ? "text-amber-500 font-extrabold"
                        : entry.rank === 2
                        ? "text-slate-400"
                        : entry.rank === 3
                        ? "text-orange-400"
                        : "text-slate-500"
                    }`}
                  >
                    #{entry.rank}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xl">{entry.avatar}</span>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {entry.username}
                        {isUser && (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500 text-white font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Level {entry.level} • {entry.levelTitle}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{entry.streak}d</span>
                  </div>

                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{entry.xp} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
