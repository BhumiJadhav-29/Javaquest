import React, { useState, useEffect } from "react";
import { UserState, Lesson, CodingChallenge } from "./types";
import { getUserState, subscribeUserState } from "./services/storageService";
import { COURSES } from "./data/coursesData";
import { CODING_CHALLENGES } from "./data/challengesData";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { RoadmapView } from "./components/RoadmapView";
import { DashboardView } from "./components/DashboardView";
import { CourseExplorerView } from "./components/CourseExplorerView";
import { PracticeView } from "./components/PracticeView";
import { ProjectsView } from "./components/ProjectsView";
import { LeaderboardView } from "./components/LeaderboardView";
import { AchievementsView } from "./components/AchievementsView";
import { ReviewView } from "./components/ReviewView";
import { AdminView } from "./components/AdminView";
import { LandingHomeView } from "./components/LandingHomeView";
import { LessonModal } from "./components/LessonModal";
import { CodePlaygroundModal } from "./components/CodePlaygroundModal";
import { QuestAIPanel } from "./components/QuestAIPanel";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { AuthModal } from "./components/AuthModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { PromoDemoVideoModal } from "./components/PromoDemoVideoModal";

export default function App() {
  const [user, setUser] = useState<UserState>(getUserState());
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("java_foundations");

  // Modals & Panels
  const [activeLessonData, setActiveLessonData] = useState<{
    lesson: Lesson;
    moduleTitle: string;
    initialMode?: "lesson" | "test";
  } | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge | null>(null);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPromoDemoOpen, setIsPromoDemoOpen] = useState<boolean>(false);
  const [levelUpAlert, setLevelUpAlert] = useState<{ level: number } | null>(null);

  useEffect(() => {
    const unsub = subscribeUserState((updated) => {
      setUser(updated);
    });

    // Check onboarding
    const onboarded = localStorage.getItem("javaquest_onboarded");
    if (!onboarded) {
      setIsOnboardingOpen(true);
    }

    // Keyboard shortcut for search
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);

    return () => {
      unsub();
      window.removeEventListener("keydown", handleGlobalKey);
    };
  }, []);

  const currentCourse =
    COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPrompt(prompt);
    setIsAiOpen(true);
  };

  const handleStartLesson = (
    lesson: Lesson,
    moduleTitle: string,
    initialMode?: "lesson" | "test"
  ) => {
    setActiveLessonData({ lesson, moduleTitle, initialMode: initialMode || "lesson" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        user={user}
        selectedCourseId={selectedCourseId}
        onSelectCourse={(id) => {
          setSelectedCourseId(id);
          setCurrentView("learn");
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAiTutor={() => {
          setAiPrompt("");
          setIsAiOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={(view) => setCurrentView(view)}
        onOpenPromoDemo={() => setIsPromoDemoOpen(true)}
      />

      {/* Level Up Banner Notification */}
      {levelUpAlert && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 px-4 text-xs font-black tracking-wide flex items-center justify-center gap-2 animate-in slide-in-from-top">
          <span>🎉 LEVEL UP! You reached Level {levelUpAlert.level}!</span>
          <button
            onClick={() => setLevelUpAlert(null)}
            className="underline ml-2 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          mistakesCount={user.mistakeLessonIds.length}
        />

        {/* Viewport Content */}
        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">
          {currentView === "home" && (
            <LandingHomeView
              onStartLearning={() => setCurrentView("learn")}
              onExploreCourses={() => setCurrentView("courses")}
              onOpenPromoDemo={() => setIsPromoDemoOpen(true)}
            />
          )}

          {currentView === "dashboard" && (
            <DashboardView
              user={user}
              currentCourse={currentCourse}
              onNavigateToCourse={(id) => {
                setSelectedCourseId(id);
                setCurrentView("learn");
              }}
              onStartDailyChallenge={() => {
                setActiveChallenge(CODING_CHALLENGES[0]);
              }}
              onNavigate={(view) => setCurrentView(view)}
              onOpenPromoDemo={() => setIsPromoDemoOpen(true)}
            />
          )}

          {currentView === "learn" && (
            <RoadmapView
              course={currentCourse}
              user={user}
              onSelectLesson={handleStartLesson}
              onNavigateToProjects={() => setCurrentView("projects")}
            />
          )}

          {currentView === "courses" && (
            <CourseExplorerView
              user={user}
              selectedCourseId={selectedCourseId}
              onSelectCourse={(id) => setSelectedCourseId(id)}
              onStartCourse={(id) => {
                setSelectedCourseId(id);
                setCurrentView("learn");
              }}
            />
          )}

          {currentView === "practice" && (
            <PracticeView
              user={user}
              onOpenChallenge={(ch) => setActiveChallenge(ch)}
            />
          )}

          {currentView === "projects" && (
            <ProjectsView
              user={user}
              onAskAi={handleOpenAiWithPrompt}
            />
          )}

          {currentView === "leaderboard" && <LeaderboardView user={user} />}

          {currentView === "achievements" && <AchievementsView user={user} />}

          {currentView === "review" && (
            <ReviewView
              user={user}
              onSelectLesson={handleStartLesson}
            />
          )}

          {currentView === "admin" && <AdminView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 text-[10px] font-bold">
        {[
          { id: "dashboard", label: "Home", icon: "🏠" },
          { id: "learn", label: "Path", icon: "🗺️" },
          { id: "practice", label: "Practice", icon: "⌨️" },
          { id: "leaderboard", label: "Ranks", icon: "🏆" },
          { id: "achievements", label: "Quests", icon: "⭐" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              currentView === tab.id
                ? "text-orange-500 font-extrabold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Interactive Lesson Modal */}
      {activeLessonData && (
        <LessonModal
          lesson={activeLessonData.lesson}
          moduleTitle={activeLessonData.moduleTitle}
          initialMode={activeLessonData.initialMode}
          user={user}
          onClose={() => setActiveLessonData(null)}
          onComplete={(xp) => {
            // Check if leveled up
            setUser(getUserState());
          }}
          onAskAi={handleOpenAiWithPrompt}
        />
      )}

      {/* Coding Playground Modal */}
      {activeChallenge && (
        <CodePlaygroundModal
          challenge={activeChallenge}
          user={user}
          onClose={() => setActiveChallenge(null)}
          onAskAi={handleOpenAiWithPrompt}
          onChallengeCompleted={(id, xp) => {
            setUser(getUserState());
          }}
        />
      )}

      {/* Quest AI Floating Panel */}
      <QuestAIPanel
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        initialPrompt={aiPrompt}
        userLevel={user.level}
      />

      {/* Global Search (Cmd+K) Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleStartLesson}
        onSelectChallenge={(ch) => setActiveChallenge(ch)}
      />

      {/* User Profile / Settings Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
      />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={user}
      />

      {/* Official AI Promo Demo Video Showcase Modal */}
      <PromoDemoVideoModal
        isOpen={isPromoDemoOpen}
        onClose={() => setIsPromoDemoOpen(false)}
        onStartLearning={() => {
          setIsPromoDemoOpen(false);
          setCurrentView("learn");
        }}
        onOpenAiTutor={() => {
          setIsPromoDemoOpen(false);
          setAiPrompt("Can you introduce yourself and show me how you can mentor me in JavaQuest?");
          setIsAiOpen(true);
        }}
        onOpenPractice={() => {
          setIsPromoDemoOpen(false);
          setCurrentView("practice");
        }}
      />
    </div>
  );
}
