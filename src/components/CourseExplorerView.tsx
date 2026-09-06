import React, { useState } from "react";
import { Course, UserState } from "../types";
import { COURSES } from "../data/coursesData";
import { Search, BookOpen, Clock, Play, CheckCircle2, ArrowRight } from "lucide-react";

interface CourseExplorerViewProps {
  user: UserState;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onStartCourse: (courseId: string) => void;
}

export const CourseExplorerView: React.FC<CourseExplorerViewProps> = ({
  user,
  selectedCourseId,
  onSelectCourse,
  onStartCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Programming", "Backend", "Database", "Web"];

  const filteredCourses = COURSES.filter((c) => {
    const matchesCategory =
      selectedCategory === "All" || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Curriculum Catalog
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Explore All Learning Tracks
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          From Java fundamentals to Spring Boot microservices, SQL databases, and full-stack integration. 100% free forever.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks or topics..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-9 pr-3.5 py-2 rounded-xl border border-transparent focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourseId === course.id;
          const totalLessons = course.modules.flatMap((m) => m.lessons).length;
          const completedCount = course.modules
            .flatMap((m) => m.lessons)
            .filter((l) => user.completedLessons.includes(l.id)).length;
          const percent = Math.round((completedCount / Math.max(1, totalLessons)) * 100);

          return (
            <div
              key={course.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between transition-all bg-white dark:bg-slate-900 ${
                isSelected
                  ? "border-orange-500 ring-2 ring-orange-500/20 shadow-lg shadow-orange-500/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900 flex items-center justify-center text-2xl">
                    {course.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {course.difficulty}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-500 text-white">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-1.5">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                    <span>{totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{course.estimatedHours} Hours</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-6">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Progress</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectCourse(course.id);
                    onStartCourse(course.id);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{percent > 0 ? "CONTINUE TRACK" : "START TRACK"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
