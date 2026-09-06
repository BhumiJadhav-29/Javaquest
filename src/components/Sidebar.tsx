import React from "react";
import {
  Compass,
  Map,
  BookOpen,
  Code2,
  FolderGit2,
  RotateCcw,
  Trophy,
  Award,
  ShieldCheck,
  Home,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mistakesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  mistakesCount,
}) => {
  const navItems = [
    { id: "home", label: "Overview", icon: Home, badge: null },
    { id: "dashboard", label: "Dashboard", icon: Compass, badge: null },
    { id: "learn", label: "Quest Path", icon: Map, highlight: true },
    { id: "courses", label: "Courses", icon: BookOpen, badge: "7 Tracks" },
    { id: "practice", label: "Practice", icon: Code2, badge: "20+" },
    { id: "projects", label: "Projects", icon: FolderGit2, badge: null },
    {
      id: "review",
      label: "Review",
      icon: RotateCcw,
      badge: mistakesCount > 0 ? `${mistakesCount}` : null,
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, badge: null },
    { id: "achievements", label: "Achievements", icon: Award, badge: null },
    { id: "admin", label: "Metrics & Admin", icon: ShieldCheck, badge: null },
  ];

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between py-6 px-3 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 pb-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Learning Journey
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400 dark:text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Motivation Mini Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-orange-950/30 border border-orange-200/50 dark:border-orange-900/40">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">🚀</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Daily Goal
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
          Complete 1 lesson every day to protect your streak and level up!
        </p>
      </div>
    </aside>
  );
};
