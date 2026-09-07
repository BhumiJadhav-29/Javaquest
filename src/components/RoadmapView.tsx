import React, { useState } from "react";
import { Course, Lesson, Module, UserState } from "../types";
import { CheckCircle2, Lock, Play, Star, Sparkles, BookOpen, Trophy } from "lucide-react";

interface RoadmapViewProps {
  course: Course;
  user: UserState;
  onSelectLesson: (lesson: Lesson, moduleTitle: string, mode?: "lesson" | "test") => void;
  onNavigateToProjects: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  course,
  user,
  onSelectLesson,
  onNavigateToProjects,
}) => {
  const [activePreviewLesson, setActivePreviewLesson] = useState<{
    lesson: Lesson;
    moduleTitle: string;
  } | null>(null);

  // Helper to determine lesson status
  const getLessonStatus = (
    lesson: Lesson,
    moduleIdx: number,
    lessonIdx: number,
    allModules: Module[]
  ): "completed" | "active" | "locked" => {
    if (user.completedLessons.includes(lesson.id)) {
      return "completed";
    }

    // First lesson of first module is unlocked by default
    if (moduleIdx === 0 && lessonIdx === 0) {
      return "active";
    }

    // If previous lesson in current module is completed, this lesson is active
    if (lessonIdx > 0) {
      const prevLesson = allModules[moduleIdx].lessons[lessonIdx - 1];
      if (user.completedLessons.includes(prevLesson.id)) {
        return "active";
      }
    } else if (moduleIdx > 0) {
      // First lesson in new module: unlocked if last lesson of previous module completed
      const prevModule = allModules[moduleIdx - 1];
      const lastLessonOfPrev = prevModule.lessons[prevModule.lessons.length - 1];
      if (lastLessonOfPrev && user.completedLessons.includes(lastLessonOfPrev.id)) {
        return "active";
      }
    }

    return "locked";
  };

  // Horizontal offset pattern for the Duolingo winding path (in % or px offset)
  const getOffsetClass = (idx: number) => {
    const pattern = [
      "translate-x-0",
      "translate-x-4 sm:translate-x-12",
      "translate-x-6 sm:translate-x-20",
      "translate-x-3 sm:translate-x-10",
      "-translate-x-3 sm:-translate-x-10",
      "-translate-x-6 sm:-translate-x-20",
      "-translate-x-4 sm:-translate-x-12",
    ];
    return pattern[idx % pattern.length];
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-6 overflow-x-hidden">
      {/* Course Banner */}
      <div className="mb-6 sm:mb-10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
              {course.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                  {course.category}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-orange-100">
                  • {course.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">{course.title}</h1>
              <p className="text-xs sm:text-sm text-orange-50 mt-0.5 sm:mt-1 max-w-xl leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* Course Progress Mini Bar */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold text-orange-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Interactive Quest Path</span>
          </div>
          <div className="shrink-0">
            {course.modules.flatMap((m) => m.lessons).filter((l) => user.completedLessons.includes(l.id)).length} /{" "}
            {course.modules.flatMap((m) => m.lessons).length} Completed
          </div>
        </div>
      </div>

      {/* Modules Roadmap */}
      <div className="space-y-10 sm:space-y-16">
        {course.modules.map((module, mIdx) => {
          const completedInModule = module.lessons.filter((l) =>
            user.completedLessons.includes(l.id)
          ).length;
          const isModuleFullyComplete =
            completedInModule === module.lessons.length && module.lessons.length > 0;

          return (
            <div key={module.id} className="relative">
              {/* Module Header Capsule */}
              <div className="mb-6 sm:mb-10 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs sm:text-sm shrink-0">
                    {mIdx + 1}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-lg font-extrabold tracking-tight truncate">
                      {module.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {completedInModule} / {module.lessons.length}
                  </span>
                </div>
              </div>

              {/* Connecting Path Nodes */}
              <div className="flex flex-col items-center gap-5 sm:gap-7 relative py-2 sm:py-4">
                {module.lessons.map((lesson, lIdx) => {
                  const status = getLessonStatus(lesson, mIdx, lIdx, course.modules);
                  const isCompleted = status === "completed";
                  const isActive = status === "active";
                  const isLocked = status === "locked";
                  const offsetClass = getOffsetClass(lIdx);

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center transition-transform duration-300 ${offsetClass}`}
                    >
                      {/* Node Trigger Button */}
                      <button
                        onClick={() => {
                          if (!isLocked) {
                            setActivePreviewLesson({ lesson, moduleTitle: module.title });
                          }
                        }}
                        disabled={isLocked}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center relative transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 border-4 border-amber-300"
                            : isActive
                            ? "bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/40 hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-800 ring-4 ring-orange-400/50 animate-bounce"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-4 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75"
                        }`}
                        title={lesson.title}
                      >
                        {isCompleted && (
                          <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" />
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-white text-white" />
                              <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-white text-white" />
                              <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-white text-white" />
                            </div>
                          </div>
                        )}

                        {isActive && (
                          <div className="flex flex-col items-center">
                            <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-white ml-0.5 sm:ml-1 drop-shadow" />
                            <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase mt-0.5">
                              START
                            </span>
                          </div>
                        )}

                        {isLocked && <Lock className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      {/* Small Lesson Title Label under node */}
                      <div className="mt-1.5 sm:mt-2 text-center max-w-[130px] sm:max-w-[140px]">
                        <span
                          className={`text-[11px] sm:text-xs font-bold leading-tight block ${
                            isCompleted
                              ? "text-slate-800 dark:text-slate-200"
                              : isActive
                              ? "text-orange-600 dark:text-orange-400 font-extrabold"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Module Milestone / Boss Project Node */}
                <div className="mt-6 flex flex-col items-center">
                  <button
                    onClick={onNavigateToProjects}
                    className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                      isModuleFullyComplete
                        ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20 hover:scale-105"
                        : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs font-bold uppercase tracking-wider">
                        Module Milestone
                      </div>
                      <div className="text-xs">
                        {isModuleFullyComplete
                          ? "Unit Complete! Build a Project →"
                          : `Finish all ${module.lessons.length} lessons to unlock projects`}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Preview Modal Popup (Duolingo Style Card) */}
      {activePreviewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                {activePreviewLesson.moduleTitle}
              </span>
              <button
                onClick={() => setActivePreviewLesson(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {activePreviewLesson.lesson.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {activePreviewLesson.lesson.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Estimated</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {activePreviewLesson.lesson.estimatedMinutes} Minutes
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reward</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    +{activePreviewLesson.lesson.xpReward} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Lesson Test status badge if taken */}
            {user.lessonTestScores?.[activePreviewLesson.lesson.id] && (
              <div className="mb-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      Post-Lesson Test Passed
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Score: {user.lessonTestScores[activePreviewLesson.lesson.id].score} / {user.lessonTestScores[activePreviewLesson.lesson.id].total} ({user.lessonTestScores[activePreviewLesson.lesson.id].percentage}%)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${
                        starIdx <= (user.lessonTestScores?.[activePreviewLesson.lesson.id]?.stars || 1)
                          ? "fill-amber-400 text-amber-500"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  const item = activePreviewLesson;
                  setActivePreviewLesson(null);
                  onSelectLesson(item.lesson, item.moduleTitle, "lesson");
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START LESSON QUEST</span>
              </button>

              <button
                onClick={() => {
                  const item = activePreviewLesson;
                  setActivePreviewLesson(null);
                  onSelectLesson(item.lesson, item.moduleTitle, "test");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>📝</span>
                <span>
                  {user.lessonTestScores?.[activePreviewLesson.lesson.id]
                    ? "RETAKE POST-LESSON TEST"
                    : "TAKE POST-LESSON TEST DIRECTLY"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
