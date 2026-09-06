import React, { useState, useEffect } from "react";
import { COURSES } from "../data/coursesData";
import { CODING_CHALLENGES } from "../data/challengesData";
import { Lesson, CodingChallenge } from "../types";
import { Search, BookOpen, Code2, ArrowRight, X } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: Lesson, moduleTitle: string) => void;
  onSelectChallenge: (challenge: CodingChallenge) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectChallenge,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Search lessons
  const matchingLessons = COURSES.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title, courseTitle: c.title }))
    )
  ).filter(
    (item) =>
      item.lesson.title.toLowerCase().includes(query.toLowerCase()) ||
      item.lesson.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  // Search challenges
  const matchingChallenges = CODING_CHALLENGES.filter(
    (ch) =>
      ch.title.toLowerCase().includes(query.toLowerCase()) ||
      ch.category.toLowerCase().includes(query.toLowerCase()) ||
      ch.problemStatement.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, challenges, OOP, syntax..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {/* Lessons group */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-2">
              Lessons & Concepts
            </div>
            {matchingLessons.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 italic">No lessons found</p>
            ) : (
              <div className="space-y-1">
                {matchingLessons.map((item) => (
                  <button
                    key={item.lesson.id}
                    onClick={() => {
                      onSelectLesson(item.lesson, item.moduleTitle);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {item.lesson.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.moduleTitle} • {item.courseTitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Challenges group */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-2">
              Coding Challenges
            </div>
            {matchingChallenges.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 italic">No challenges found</p>
            ) : (
              <div className="space-y-1">
                {matchingChallenges.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChallenge(ch);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ch.category} • {ch.difficulty}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-500">
                      +{ch.xpReward} XP
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search JavaQuest repository</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
