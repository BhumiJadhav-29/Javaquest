import React, { useState } from "react";
import { CodingChallenge, UserState } from "../types";
import { CODING_CHALLENGES } from "../data/challengesData";
import { Search, Sparkles, CheckCircle2, Play, Code2, Flame } from "lucide-react";

interface PracticeViewProps {
  user: UserState;
  onOpenChallenge: (challenge: CodingChallenge) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  user,
  onOpenChallenge,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered = CODING_CHALLENGES.filter((ch) => {
    const matchesDiff = difficultyFilter === "All" || ch.difficulty === difficultyFilter;
    const matchesSearch =
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.category.toLowerCase().includes(search.toLowerCase()) ||
      ch.problemStatement.toLowerCase().includes(search.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const totalSolved = CODING_CHALLENGES.filter((c) =>
    user.solvedChallenges.includes(c.id)
  ).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Problem Solving Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Coding Practice Arena
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            20+ interactive Java challenges with built-in compiler, test suite, and AI hints.
          </p>
        </div>

        {/* Solved Counter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Challenges Solved
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {totalSolved} / {CODING_CHALLENGES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                difficultyFilter === diff
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keyword, topic, or concept..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-9 pr-3.5 py-2 rounded-xl border border-transparent focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((challenge) => {
          const isSolved = user.solvedChallenges.includes(challenge.id);

          return (
            <div
              key={challenge.id}
              className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 transition-all flex flex-col justify-between ${
                isSolved
                  ? "border-emerald-200 dark:border-emerald-950/80 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {challenge.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        challenge.difficulty === "Easy"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : challenge.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                  {challenge.title}
                  {isSolved && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {challenge.problemStatement}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-500">
                  {challenge.testCases.length} Test Case(s)
                </span>

                <button
                  onClick={() => onOpenChallenge(challenge)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSolved
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 hover:scale-105"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isSolved ? "Practice Again" : "Solve Challenge"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
