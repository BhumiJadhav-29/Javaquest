import React from "react";
import { UserState, Lesson } from "../types";
import { COURSES } from "../data/coursesData";
import { refillHearts } from "../services/storageService";
import { RotateCcw, Sparkles, Heart, CheckCircle2, Play, AlertCircle } from "lucide-react";

interface ReviewViewProps {
  user: UserState;
  onSelectLesson: (lesson: Lesson, moduleTitle: string) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  user,
  onSelectLesson,
}) => {
  // Find all lessons that are in user.mistakeLessonIds
  const allLessonsWithModules = COURSES.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title, courseTitle: c.title }))
    )
  );

  const mistakeLessons = allLessonsWithModules.filter((item) =>
    user.mistakeLessonIds.includes(item.lesson.id)
  );

  // If no mistakes, show completed lessons for spaced repetition review
  const fallbackLessons = allLessonsWithModules
    .filter((item) => user.completedLessons.includes(item.lesson.id))
    .slice(0, 4);

  const reviewList = mistakeLessons.length > 0 ? mistakeLessons : fallbackLessons;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Spaced Repetition
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Review & Strengthen
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Practicing concepts right at the edge of forgetting builds permanent neural pathways. Review sessions restore hearts and award bonus XP!
        </p>
      </div>

      {/* Heart Recovery Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-2xl">
            ❤️
          </div>
          <div>
            <h3 className="font-black text-lg">Instant Heart Refill</h3>
            <p className="text-xs text-rose-100">
              Complete any review session to top up all {user.maxHearts} hearts instantly.
            </p>
          </div>
        </div>

        <button
          onClick={() => refillHearts()}
          className="px-5 py-2.5 rounded-xl bg-white text-rose-600 font-extrabold text-xs shadow-sm hover:scale-105 transition-all"
        >
          Refill Hearts Now
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-orange-500" />
            <span>
              {mistakeLessons.length > 0
                ? "Weak Concepts (Needs Review)"
                : "Spaced Practice Suggestions"}
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {reviewList.length} Item(s)
          </span>
        </div>

        {reviewList.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Zero Mistakes Recorded!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your memory is crystal clear. Jump into the Quest Path or Practice Arena to learn new concepts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {reviewList.map((item) => (
              <div
                key={item.lesson.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                      {item.moduleTitle}
                    </span>
                    <span className="text-xs text-slate-400">• {item.courseTitle}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.lesson.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectLesson(item.lesson, item.moduleTitle)}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-sm shadow-orange-500/20 transition-all hover:scale-105 flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Review Lesson</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
