import React from "react";
import { COURSES } from "../data/coursesData";
import { CODING_CHALLENGES } from "../data/challengesData";
import { PROJECTS } from "../data/projectsData";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Code2,
  Flame,
  Activity,
  Server,
  Zap,
} from "lucide-react";

export const AdminView: React.FC = () => {
  const stats = [
    { label: "Total Learners", value: "14,820", icon: Users, change: "+18% this week" },
    { label: "Active Today", value: "2,194", icon: Activity, change: "Peak at 2 PM UTC" },
    { label: "Lessons Completed", value: "54,200", icon: CheckCircle2, change: "+1,240 today" },
    { label: "Code Submissions", value: "31,850", icon: Code2, change: "89% pass rate" },
  ];

  const totalLessons = COURSES.flatMap((c) => c.modules.flatMap((m) => m.lessons)).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Platform Telemetry
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Metrics & Platform Administration
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Real-time metrics, curriculum inventory, and system health status.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Infrastructure Health */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-orange-500" />
          <span>System Infrastructure Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Java Simulation Runner
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Regex AST & Expressions
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Quest AI Tutor Service
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Gemini 2.5 Flash / Pedagogical
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Client State Engine
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Local Reactive Store
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            Curriculum Content Catalog
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {COURSES.length} Courses • {totalLessons} Lessons • {CODING_CHALLENGES.length} Challenges • {PROJECTS.length} Projects
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {c.title}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {c.category} • {c.difficulty}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {c.modules.length} Modules
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {c.modules.flatMap((m) => m.lessons).length} Lessons
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">
                    ~{c.estimatedHours}h
                  </div>
                  <div className="text-[11px] text-slate-400">Duration</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
