import React, { useState, useEffect, useRef } from "react";
import { UserState } from "../types";
import { COURSES } from "../data/coursesData";
import { getLevelForXp } from "../data/questsAndBadges";
import { refillHearts } from "../services/storageService";
import { useTheme } from "../hooks/useTheme";
import {
  Flame,
  Heart,
  Sparkles,
  Search,
  Bot,
  PlusCircle,
  Award,
  Sun,
  Moon,
  ChevronDown,
  Check,
  BookOpen,
  User,
  ShieldCheck,
  Trophy,
  RotateCcw,
  X,
  ExternalLink,
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

type ActiveDropdown = "course" | "streak" | "hearts" | "profile" | null;

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
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [heartsRefilledToast, setHeartsRefilledToast] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navContainerRef = useRef<HTMLDivElement>(null);

  const currentCourse =
    COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const levelInfo = getLevelForXp(user.xp);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDropdown = (menu: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleRefillHeartsAction = () => {
    refillHearts();
    setHeartsRefilledToast(true);
    setTimeout(() => {
      setHeartsRefilledToast(false);
    }, 2000);
  };

  // Completed lessons in currently selected course
  const courseLessons = currentCourse.modules.flatMap((m) => m.lessons);
  const completedInCurrent = courseLessons.filter((l) =>
    user.completedLessons.includes(l.id)
  ).length;
  const courseCompletionPercent = courseLessons.length
    ? Math.round((completedInCurrent / courseLessons.length) * 100)
    : 0;

  // Streak tracker days (last 7 days)
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const recentDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const isoDate = d.toISOString().split("T")[0];
    const dayLabel = daysOfWeek[(d.getDay() + 6) % 7];
    const isDone = user.streakHistory?.includes(isoDate) || (i === 6 && user.streak > 0);
    return { dayLabel, isDone, isToday: i === 6 };
  });

  return (
    <>
      {/* Backdrop overlay when any popover is active - prevents conflicting clicks and overlaps */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[0.5px]"
          onClick={() => setActiveDropdown(null)}
          aria-hidden="true"
        />
      )}

      <header
        ref={navContainerRef}
        className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200 w-full"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          {/* ================= LEFT: Brand & Course Switcher ================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            {/* Logo & Name */}
            <button
              onClick={() => {
                setActiveDropdown(null);
                onNavigate("dashboard");
              }}
              className="flex items-center gap-1.5 sm:gap-2 group text-left focus:outline-none shrink-0"
              aria-label="Go to JavaQuest dashboard"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 group-active:scale-95 transition-transform shrink-0">
                <span className="text-base sm:text-lg">☕</span>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1">
                  <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Java<span className="text-orange-500 dark:text-orange-400">Quest</span>
                  </span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50 hidden sm:inline-block">
                    Free
                  </span>
                </div>
              </div>
            </button>

            {/* Interactive Course Selector Dropdown Button */}
            <div className="relative shrink min-w-0">
              <button
                onClick={() => toggleDropdown("course")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all focus:outline-none whitespace-nowrap ${
                  activeDropdown === "course"
                    ? "bg-orange-50 dark:bg-orange-950/40 border-orange-400 text-orange-600 dark:text-orange-300 shadow-xs ring-2 ring-orange-400/20"
                    : "bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                }`}
                title="Switch programming track"
                aria-expanded={activeDropdown === "course"}
              >
                <span className="text-sm shrink-0">{currentCourse.icon}</span>
                <span className="hidden md:inline-block truncate max-w-[120px] lg:max-w-[140px]">
                  {currentCourse.title}
                </span>
                <span className="md:hidden font-bold truncate max-w-[65px] xs:max-w-[85px]">
                  {currentCourse.title.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeDropdown === "course" ? "rotate-180 text-orange-500" : ""
                  }`}
                />
              </button>

              {/* Course Selector Popover */}
              {activeDropdown === "course" && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Tracks
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Close track list"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Current Active Track Card */}
                  <div className="p-2.5 mb-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-950 dark:text-orange-200 mb-1">
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{currentCourse.icon}</span> {currentCourse.title}
                      </span>
                      <span className="text-[11px] font-black text-orange-600 dark:text-orange-400 shrink-0 ml-1">
                        {courseCompletionPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-orange-200 dark:bg-orange-900/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${Math.max(5, courseCompletionPercent)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-orange-700/80 dark:text-orange-400/80 mt-1 flex justify-between">
                      <span>{completedInCurrent} completed</span>
                      <span>{courseLessons.length} total lessons</span>
                    </div>
                  </div>

                  {/* List of all courses */}
                  <div className="space-y-1">
                    {COURSES.map((c) => {
                      const isSelected = c.id === selectedCourseId;
                      const cLessons = c.modules.flatMap((m) => m.lessons);
                      const done = cLessons.filter((l) =>
                        user.completedLessons.includes(l.id)
                      ).length;

                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCourse(c.id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-orange-500 text-white shadow-xs font-bold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{c.icon}</span>
                            <div className="min-w-0">
                              <div className="text-xs truncate flex items-center gap-1.5">
                                <span className="truncate">{c.title}</span>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded font-semibold shrink-0 ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                  }`}
                                >
                                  {c.difficulty}
                                </span>
                              </div>
                              <div
                                className={`text-[10px] truncate ${
                                  isSelected ? "text-orange-100" : "text-slate-400"
                                }`}
                              >
                                {done > 0
                                  ? `${done}/${cLessons.length} completed`
                                  : `${cLessons.length} lessons`}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-white shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onNavigate("courses");
                      }}
                      className="w-full py-1.5 text-center text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>View All Syllabi & Roadmaps</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= CENTER: Fast Global Search ================= */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all w-44 lg:w-64 justify-between group hover:border-orange-400 dark:hover:border-orange-500/50 shadow-xs shrink"
            title="Search lessons, syntax, OOP, concepts (⌘K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
              <span className="truncate">Search lessons, syntax...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 shadow-xs group-hover:border-orange-300 shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* ================= RIGHT: Gamified Stats & Tools ================= */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            {/* Mobile Search Icon Trigger */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Search (⌘K)"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Streak Counter with Interactive Popover */}
            <div className="relative shrink-0">
              <button
                onClick={() => toggleDropdown("streak")}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border text-xs font-black transition-all hover:scale-105 active:scale-95 shrink-0 ${
                  activeDropdown === "streak"
                    ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-300 ring-2 ring-amber-400/20"
                    : "bg-orange-50 dark:bg-orange-950/40 border-orange-200/70 dark:border-orange-800/70 text-orange-600 dark:text-orange-400"
                }`}
                title={`${user.streak} Day Streak! Click to view details`}
                aria-expanded={activeDropdown === "streak"}
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 shrink-0" />
                <span>{user.streak}</span>
              </button>

              {/* Streak Popover */}
              {activeDropdown === "streak" && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {user.streak} Day Streak!
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {user.streak > 0 ? "You're on fire!" : "Start your streak today!"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      aria-label="Close streak info"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-Day Visualizer */}
                  <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-800 my-2">
                    {recentDays.map((d, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400">
                          {d.dayLabel}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            d.isDone
                              ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          } ${d.isToday ? "ring-2 ring-orange-500" : ""}`}
                        >
                          {d.isDone ? "✓" : "·"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mb-3">
                    Solve 1 challenge or finish 1 lesson every day to protect your streak.
                  </p>

                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      onNavigate("dashboard");
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors text-center"
                  >
                    View Streak Rewards
                  </button>
                </div>
              )}
            </div>

            {/* Hearts / Lives Counter with Refill Drawer */}
            <div className="relative shrink-0">
              <button
                onClick={() => toggleDropdown("hearts")}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border text-xs font-black transition-all hover:scale-105 active:scale-95 shrink-0 ${
                  activeDropdown === "hearts"
                    ? "bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-300 ring-2 ring-rose-400/20"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200/70 dark:border-rose-800/70 text-rose-600 dark:text-rose-400"
                }`}
                title={`${user.hearts}/${user.maxHearts} Hearts. Click to refill`}
                aria-expanded={activeDropdown === "hearts"}
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0" />
                <span>{user.hearts}</span>
              </button>

              {activeDropdown === "hearts" && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {user.hearts} / {user.maxHearts} Hearts
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Educational Lives
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      aria-label="Close hearts info"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hearts Visual Display */}
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl my-2 border border-rose-100 dark:border-rose-900/40">
                    {Array.from({ length: user.maxHearts }, (_, i) => (
                      <Heart
                        key={i}
                        className={`w-6 h-6 transition-all ${
                          i < user.hearts
                            ? "fill-rose-500 text-rose-500 drop-shadow-xs"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mb-3">
                    Hearts protect your focus. JavaQuest education is 100% free and open—you can refill immediately!
                  </p>

                  {heartsRefilledToast ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                      <Check className="w-4 h-4" /> Hearts Fully Refilled!
                    </div>
                  ) : (
                    <button
                      onClick={handleRefillHeartsAction}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" /> Refill 5 Hearts (Free)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* XP Badge (hidden on mobile, visible on sm+) */}
            <div
              onClick={() => onNavigate("achievements")}
              title={`${user.xp} Total XP earned. Click to view quests`}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70 text-amber-700 dark:text-amber-300 text-xs font-black cursor-pointer hover:scale-105 transition-transform shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>{user.xp} XP</span>
            </div>

            {/* Level Badge (hidden on mobile/tablet, visible on lg+) */}
            <button
              onClick={() => onNavigate("achievements")}
              title={`Level ${user.level}: ${levelInfo.title}`}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <Award className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Lvl {user.level}</span>
            </button>

            {/* Promo Demo Video Shortcut (hidden on mobile/tablet to avoid clutter) */}
            {onOpenPromoDemo && (
              <button
                onClick={onOpenPromoDemo}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold transition-all hover:scale-105 shadow-xs shrink-0"
                title="Watch JavaQuest Interactive Demo Video"
              >
                <span className="text-xs">🎬</span>
                <span>Demo</span>
              </button>
            )}

            {/* Quest AI Tutor Shortcut Button */}
            <button
              onClick={onOpenAiTutor}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-xs shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
              title="Open Quest AI Tutor Assistant"
              aria-label="Quest AI Tutor"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Quest AI</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* User Profile Avatar with Menu */}
            <div className="relative shrink-0">
              <button
                onClick={() => toggleDropdown("profile")}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base border-2 transition-all ${
                  activeDropdown === "profile"
                    ? "border-orange-500 ring-2 ring-orange-400/30 scale-105"
                    : "border-orange-300 dark:border-orange-700 hover:border-orange-500 hover:scale-105"
                } bg-orange-100 dark:bg-orange-950/80 shadow-xs shrink-0`}
                title={`${user.username} (Lvl ${user.level}) - Click for account`}
                aria-expanded={activeDropdown === "profile"}
              >
                {user.avatar || "☕"}
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
              </button>

              {/* Profile Popover Menu */}
              {activeDropdown === "profile" && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95">
                  {/* User Header */}
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2.5">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-xl shrink-0">
                      {user.avatar || "☕"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                          {user.username}
                        </span>
                        {user.role === "admin" && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {user.email || "Private Local Account"}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Close profile menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Level & XP Quick Stat Strip */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-center mb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        LEVEL
                      </span>
                      <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                        {user.level}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        TOTAL XP
                      </span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {user.xp}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        STREAK
                      </span>
                      <span className="text-xs font-black text-amber-500">
                        {user.streak}d
                      </span>
                    </div>
                  </div>

                  {/* Quick Menu Links */}
                  <div className="space-y-1 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onOpenAuth();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onNavigate("achievements");
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Achievements & Badges</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onNavigate("review");
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="flex-1">Practice Mistakes</span>
                      {user.mistakeLessonIds.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 shrink-0">
                          {user.mistakeLessonIds.length}
                        </span>
                      )}
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate("admin");
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-left transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>Admin & System Metrics</span>
                      </button>
                    )}
                  </div>

                  {/* Switch / Sign Out Button */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        onOpenAuth();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl text-center text-xs font-bold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Switch Account / Authentication
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
