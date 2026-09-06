import React, { useState } from "react";
import { UserState } from "../types";
import { COURSES } from "../data/coursesData";
import { getLevelForXp } from "../data/questsAndBadges";
import { refillHearts } from "../services/storageService";
import {
  Flame,
  Heart,
  Sparkles,
  Search,
  Bot,
  PlusCircle,
  Award,
} from "lucide-react";

interface NavbarProps {
  user: UserState;
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
  onOpenSearch: () => void;
  onOpenAiTutor: () => void;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  onOpenPromoDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  selectedCourseId,
  onSelectCourse,
  onOpenSearch,
  onOpenAiTutor,
  onOpenAuth,
  onNavigate,
  onOpenPromoDemo,
}) => {
  const [showHeartMenu, setShowHeartMenu] = useState(false);
  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const levelInfo = getLevelForXp(user.xp);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Course Selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
            aria-label="Go to dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Java<span className="text-orange-600 dark:text-orange-500">Quest</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                  Free
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Learn. Code. Quest. Master.
              </p>
            </div>
          </button>

          {/* Current Course Dropdown */}
          <div className="relative hidden md:block">
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg border border-transparent focus:border-orange-500 focus:outline-none cursor-pointer transition-colors"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.title}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
              ▼
            </span>
          </div>
        </div>

        {/* Center: Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 text-xs font-medium border border-slate-200 dark:border-slate-700/60 transition-colors w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Java, OOP, SQL...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Right: Gamified Stats (Streaks, Hearts, XP, Level) & AI */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          <button
            onClick={() => onNavigate("dashboard")}
            title={`${user.streak} day streak! Keep practicing daily.`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs font-bold hover:scale-105 transition-transform"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{user.streak}</span>
          </button>

          {/* Hearts / Lives Counter with Refill Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowHeartMenu(!showHeartMenu)}
              title={`${user.hearts}/${user.maxHearts} Hearts`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:scale-105 transition-transform"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{user.hearts}</span>
            </button>

            {showHeartMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3.5 z-40 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> Hearts
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {user.hearts} / {user.maxHearts}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Hearts help you learn from mistakes. On JavaQuest, education is 100% free — you can refill anytime!
                </p>
                <button
                  onClick={() => {
                    refillHearts();
                    setShowHeartMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Practice to Refill Hearts
                </button>
              </div>
            )}
          </div>

          {/* Total XP */}
          <div
            title={`${user.xp} Total XP earned`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{user.xp} XP</span>
          </div>

          {/* Level Badge */}
          <button
            onClick={() => onNavigate("achievements")}
            title={`Level ${user.level}: ${levelInfo.title}`}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-orange-500" />
            <span>Lvl {user.level}</span>
          </button>

          {/* Promo Demo Video Button */}
          {onOpenPromoDemo && (
            <button
              onClick={onOpenPromoDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs"
              title="Watch JavaQuest AI Promo Demo Video"
            >
              <span className="text-xs">🎬</span>
              <span className="hidden sm:inline">Demo Video</span>
            </button>
          )}

          {/* Quest AI Tutor Button */}
          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">Quest AI</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenAuth}
            className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 flex items-center justify-center text-lg hover:ring-2 hover:ring-orange-400 transition-all"
            title={`${user.username} - View profile`}
          >
            {user.avatar || "☕"}
          </button>
        </div>
      </div>
    </header>
  );
};
