import React from "react";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Code2,
  Bot,
  Zap,
  BookOpen,
  Trophy,
  ShieldCheck,
} from "lucide-react";

interface LandingHomeViewProps {
  onStartLearning: () => void;
  onExploreCourses: () => void;
  onOpenPromoDemo?: () => void;
}

export const LandingHomeView: React.FC<LandingHomeViewProps> = ({
  onStartLearning,
  onExploreCourses,
  onOpenPromoDemo,
}) => {
  const steps = [
    { num: "01", title: "Learn", desc: "Bite-sized lessons with clear analogies and syntax breakdowns." },
    { num: "02", title: "Practice", desc: "Interactive questions, multiple choice, and code completions." },
    { num: "03", title: "Solve", desc: "20+ hands-on coding challenges in our simulated Java runner." },
    { num: "04", title: "Earn XP", desc: "Collect experience points and maintain your daily streak." },
    { num: "05", title: "Unlock", desc: "Progress along the Duolingo-inspired path from unit to unit." },
    { num: "06", title: "Build", desc: "Assemble real portfolio projects like ATM sims and REST APIs." },
    { num: "07", title: "Master", desc: "Graduate into enterprise-ready software engineering." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free • Gamified Programming Education</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Learn. Code. Quest.{" "}
          <span className="text-orange-600 dark:text-orange-500 underline decoration-orange-300 dark:decoration-orange-800">
            Master.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          The Duolingo for programming. Master Java, OOP, and Spring Boot through bite-sized interactive lessons, code challenges, streaks, and AI-guided hints.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-orange-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>START LEARNING (FREE)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenPromoDemo && (
            <button
              onClick={onOpenPromoDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700/80 shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-base">🎬</span>
              <span>WATCH PROMO DEMO</span>
            </button>
          )}

          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm transition-all"
          >
            EXPLORE CURRICULUM
          </button>
        </div>

        {/* Micro social proof */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Zero Installation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Self-Paced</span>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center text-2xl mb-4">
            🔥
          </div>
          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            Gamified Duolingo Experience
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Streaks, XP, and heart mechanics turn abstract programming concepts into a rewarding, habit-forming daily routine.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center text-2xl mb-4">
            🤖
          </div>
          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            Quest AI Personal Tutor
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Never get stuck. Quest AI acts like a senior mentor, offering Socratic hints and debugging guidance without spoiling solutions.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center text-2xl mb-4">
            ⚡
          </div>
          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            Interactive In-Browser Runner
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Write real Java code with instant AST evaluation, unit tests, and beginner-friendly error diagnostics in real time.
          </p>
        </div>
      </div>

      {/* The 7-Step Core Loop */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
            The Learning Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            The JavaQuest Mastery Loop
          </h2>
          <p className="text-xs text-slate-400">
            Learn → Practice → Solve → Earn XP → Unlock → Build → Master
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1.5"
            >
              <div className="text-[10px] font-black text-orange-400">{st.num}</div>
              <div className="font-extrabold text-sm">{st.title}</div>
              <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/20 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">
          Ready to begin your programming quest?
        </h2>
        <p className="text-sm text-orange-50 max-w-md mx-auto">
          Join thousands of learners mastering Java fundamentals and building real software applications.
        </p>
        <button
          onClick={onStartLearning}
          className="px-8 py-4 rounded-2xl bg-white text-orange-600 font-black text-sm shadow-md hover:scale-105 transition-all"
        >
          START YOUR FIRST LESSON NOW
        </button>
      </div>
    </div>
  );
};
