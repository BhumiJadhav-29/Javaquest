import React, { useState } from "react";
import { Lesson, Question, UserState } from "../types";
import { completeLesson, recordMistake, recordLessonTestResult } from "../services/storageService";
import { getLessonTest } from "../data/lessonTests";
import { VoiceAnswerControl } from "./VoiceAnswerControl";
import {
  Heart,
  X,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Flame,
  Code,
  Mic,
  Star,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LessonModalProps {
  lesson: Lesson;
  moduleTitle: string;
  initialMode?: "lesson" | "test";
  user: UserState;
  onClose: () => void;
  onComplete: (earnedXp: number) => void;
  onAskAi: (prompt: string) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  moduleTitle,
  initialMode = "lesson",
  user,
  onClose,
  onComplete,
  onAskAi,
}) => {
  const lessonTest = getLessonTest(lesson);
  const testQuestions = lessonTest.questions || [];

  // Phases: "lesson" (theory + guided questions), "transition_to_test", "test", "test_summary"
  const [phase, setPhase] = useState<"lesson" | "transition_to_test" | "test" | "test_summary">(
    initialMode === "test" ? "test" : "lesson"
  );

  // Lesson practice steps: 0 = Theory slide, 1..N = Guided Questions
  const [lessonStep, setLessonStep] = useState<number>(0);
  const totalLessonSteps = 1 + (lesson.questions?.length || 0);

  // Test steps
  const [testStep, setTestStep] = useState<number>(0);
  const [testCorrectCount, setTestCorrectCount] = useState<number>(0);
  const [testUserAnswers, setTestUserAnswers] = useState<
    Array<{
      question: Question;
      selected: string;
      isCorrect: boolean;
    }>
  >([]);

  // Current interactive question selection state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showReviewAccordion, setShowReviewAccordion] = useState<boolean>(true);

  // Safely resolve lesson theory content
  const theoryContent = lesson.content || (lesson as unknown as { theory?: typeof lesson.content }).theory || {
    intro: "",
    explanation: lesson.description || "",
    codeExample: "",
    keyTakeaway: "",
  };
  const theoryExplanation = theoryContent.explanation || theoryContent.intro || lesson.description || "";
  const theoryAnalogy = (theoryContent as unknown as { analogy?: string }).analogy;
  const theoryCodeSnippet = theoryContent.codeExample || (theoryContent as unknown as { codeSnippet?: string }).codeSnippet;
  const theoryTakeaway = theoryContent.keyTakeaway;

  // Active question depending on phase
  const currentGuidedQuestion: Question | undefined =
    phase === "lesson" && lessonStep > 0 && lesson.questions
      ? lesson.questions[lessonStep - 1]
      : undefined;

  const currentTestQuestion: Question | undefined =
    phase === "test" && testQuestions.length > 0
      ? testQuestions[testStep]
      : undefined;

  // Check answer for either guided practice or test
  const handleCheckAnswer = () => {
    const activeQuestion = phase === "lesson" ? currentGuidedQuestion : currentTestQuestion;
    if (!activeQuestion || selectedOption === null || selectedOption === "") return;

    const cleanSelected = String(selectedOption).trim().toLowerCase();
    const cleanCorrect = String(activeQuestion.correctAnswer).trim().toLowerCase();
    const correct = cleanSelected === cleanCorrect;

    setIsCorrect(correct);
    setHasChecked(true);

    if (phase === "lesson") {
      if (!correct) {
        recordMistake(lesson.id);
      }
    } else if (phase === "test") {
      if (correct) {
        setTestCorrectCount((prev) => prev + 1);
      }
      setTestUserAnswers((prev) => [
        ...prev,
        {
          question: activeQuestion,
          selected: selectedOption,
          isCorrect: correct,
        },
      ]);
    }
  };

  // Move to next step in lesson
  const handleNextLessonStep = () => {
    setHasChecked(false);
    setSelectedOption(null);

    if (lessonStep < totalLessonSteps - 1) {
      setLessonStep((prev) => prev + 1);
    } else {
      // Mark base lesson completed
      completeLesson(lesson.id, lesson.xpReward);
      // Seamlessly transition to the Post-Lesson Mastery Test!
      setPhase("transition_to_test");
    }
  };

  // Move to next step in test
  const handleNextTestStep = () => {
    setHasChecked(false);
    setSelectedOption(null);

    if (testStep < testQuestions.length - 1) {
      setTestStep((prev) => prev + 1);
    } else {
      // Test finished!
      const total = Math.max(1, testQuestions.length);
      recordLessonTestResult(lesson.id, testCorrectCount, total, lessonTest.xpBonus || 25);
      setPhase("test_summary");
    }
  };

  // Restart the test
  const handleRetakeTest = () => {
    setTestStep(0);
    setTestCorrectCount(0);
    setTestUserAnswers([]);
    setSelectedOption(null);
    setHasChecked(false);
    setIsCorrect(false);
    setPhase("test");
  };

  // ----------------------------------------------------
  // RENDER: Transition Card to Post-Lesson Test
  // ----------------------------------------------------
  if (phase === "transition_to_test") {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-orange-500/30">
            🎯
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Concept Phase Complete
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Ready for the Post-Lesson Test?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Every lesson concludes with a quick exit assessment test to verify your comprehension and earn your <strong>Mastery Stars ⭐⭐⭐</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3 my-6 text-left">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Test Length
              </div>
              <div className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">
                {testQuestions.length} Questions
              </div>
              <div className="text-xs text-amber-600/80 dark:text-amber-400/80">
                Pass mark: 70%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60">
              <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Bonus Reward
              </div>
              <div className="text-lg font-black text-orange-700 dark:text-orange-300 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> +{lessonTest.xpBonus || 25} XP
              </div>
              <div className="text-xs text-orange-600/80 dark:text-orange-400/80">
                Triple Star Rating
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setTestStep(0);
                setTestCorrectCount(0);
                setTestUserAnswers([]);
                setPhase("test");
              }}
              className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm tracking-wide shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>TAKE POST-LESSON TEST NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setPhase("lesson");
                setLessonStep(0);
              }}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              Review Theory Material Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: Test Summary & Mastery Certificate
  // ----------------------------------------------------
  if (phase === "test_summary") {
    const total = Math.max(1, testQuestions.length);
    const accuracy = Math.round((testCorrectCount / total) * 100);
    const passed = accuracy >= 70;
    const stars = accuracy === 100 ? 3 : accuracy >= 70 ? 2 : 1;
    const earnedBonus = passed ? (lessonTest.xpBonus || 25) : Math.round((lessonTest.xpBonus || 25) / 2);

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 my-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
          {/* Trophy / Stars */}
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-orange-500/30">
            {passed ? "🏆" : "💡"}
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-7 h-7 ${
                  starIndex <= stars
                    ? "fill-amber-400 text-amber-500 scale-110 drop-shadow-sm"
                    : "text-slate-300 dark:text-slate-700"
                } transition-all`}
              />
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {passed ? "Post-Lesson Test Passed!" : "Good Attempt! Keep Practicing"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lessonTest.title}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 my-6 text-left">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Score
              </div>
              <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
                {testCorrectCount} / {total}
              </div>
              <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-semibold">
                {accuracy}% Accuracy
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60">
              <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                XP Bonus
              </div>
              <div className="text-xl font-black text-orange-700 dark:text-orange-300 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> +{earnedBonus}
              </div>
              <div className="text-[11px] text-orange-600/80 dark:text-orange-400/80 font-semibold">
                Mastery XP
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Mastery Rating
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                {stars} / 3 Stars
              </div>
              <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold">
                {passed ? "Passed" : "Retake Available"}
              </div>
            </div>
          </div>

          {/* Test Questions Review Accordion */}
          <div className="mb-6 text-left border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
            <button
              onClick={() => setShowReviewAccordion((prev) => !prev)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>Review Test Questions & Explanations ({testUserAnswers.length})</span>
              </span>
              {showReviewAccordion ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showReviewAccordion && (
              <div className="p-4 space-y-4 max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
                {testUserAnswers.map((item, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-3" : ""}>
                    <div className="flex items-start gap-2 mb-1">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Q{idx + 1}: {item.question.prompt}
                        </div>
                        <div className="text-[11px] mt-1 space-y-0.5">
                          <div>
                            <span className="text-slate-500">Your answer: </span>
                            <span
                              className={`font-semibold ${
                                item.isCorrect
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {item.selected}
                            </span>
                          </div>
                          {!item.isCorrect && (
                            <div>
                              <span className="text-slate-500">Correct answer: </span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {item.question.correctAnswer}
                              </span>
                            </div>
                          )}
                          <div className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                            💡 {item.question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleRetakeTest}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETAKE TEST FOR 100%</span>
            </button>

            <button
              onClick={() => {
                onComplete(lesson.xpReward + earnedBonus);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>CONTINUE TO ROADMAP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CALCULATE PROGRESS & ACTIVE QUESTION
  // ----------------------------------------------------
  const isTestMode = phase === "test";
  const activeQuestion = isTestMode ? currentTestQuestion : currentGuidedQuestion;

  const currentStepNum = isTestMode ? testStep + 1 : lessonStep;
  const totalStepsNum = isTestMode ? testQuestions.length : totalLessonSteps;
  const progressPercent = Math.round((currentStepNum / Math.max(1, totalStepsNum)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between overflow-y-auto">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between gap-4">
        {/* Close Button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Exit lesson"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>
              {isTestMode ? "📝 Post-Lesson Test" : "Lesson Quest"}
            </span>
            <span>
              {currentStepNum} / {totalStepsNum}
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 shadow-inner ${
                isTestMode
                  ? "bg-gradient-to-r from-orange-500 to-amber-500"
                  : "bg-gradient-to-r from-amber-400 to-orange-500"
              }`}
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Hearts Life Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{user.hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center">
        {/* STEP 0: Theory / Bite-sized Lesson Slide (Only during lesson phase step 0) */}
        {!isTestMode && lessonStep === 0 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {moduleTitle} • Concept Guide
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {lesson.title}
              </h1>
            </div>

            {/* Explanation card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-slate-700 dark:text-slate-300 text-sm space-y-3">
              <p>{theoryExplanation}</p>

              {theoryAnalogy && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <strong>Real-World Analogy: </strong>
                    {theoryAnalogy}
                  </div>
                </div>
              )}
            </div>

            {/* Code Snippet Card */}
            {theoryCodeSnippet && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 shadow-md">
                <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-orange-400" />
                    <span>Syntax Example</span>
                  </div>
                </div>
                <div className="p-4 font-mono text-xs overflow-x-auto text-amber-200 leading-relaxed">
                  <pre>{theoryCodeSnippet}</pre>
                </div>
              </div>
            )}

            {/* Key Takeaway */}
            {theoryTakeaway && (
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-300">
                    Core Takeaway
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {theoryTakeaway}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE QUESTION (Either Guided Practice OR Post-Lesson Test) */}
        {(isTestMode || lessonStep > 0) && activeQuestion && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {isTestMode
                  ? `Test Question ${testStep + 1} of ${testQuestions.length} • ${activeQuestion.type}`
                  : `Question ${lessonStep} of ${lesson.questions?.length || 0} • ${activeQuestion.type}`}
              </span>
              {isTestMode && (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  <Star className="w-3 h-3 fill-amber-500" /> Mastery Exit Test
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeQuestion.prompt}
            </h2>

            {/* Optional Code Snippet inside question */}
            {activeQuestion.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed text-amber-200 shadow-sm">
                <pre>{activeQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* Speech-to-Text Voice Answering Integration */}
            <VoiceAnswerControl
              options={activeQuestion.options || []}
              selectedOption={selectedOption}
              onSelectOption={(opt) => setSelectedOption(opt)}
              onSubmitAnswer={handleCheckAnswer}
              disabled={hasChecked}
              questionPrompt={activeQuestion.prompt}
            />

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {(activeQuestion.options || []).map((option, idx) => {
                const isSelected = selectedOption === option;

                let stateClasses =
                  "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-orange-300 dark:hover:border-slate-700";

                if (isSelected && !hasChecked) {
                  stateClasses =
                    "border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100 shadow-sm ring-2 ring-orange-500/20";
                }

                if (hasChecked) {
                  if (option === activeQuestion.correctAnswer) {
                    stateClasses =
                      "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                  } else if (isSelected && !isCorrect) {
                    stateClasses =
                      "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasChecked}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-4 rounded-2xl border-2 font-medium text-sm transition-all flex items-center justify-between gap-3 ${stateClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>

                    {hasChecked && option === activeQuestion.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {hasChecked && isSelected && !isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Display spoken/typed response if it was customized */}
              {selectedOption &&
                activeQuestion.options &&
                !activeQuestion.options.includes(selectedOption) && (
                  <div className="p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        <Mic className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="text-[11px] uppercase font-bold text-orange-600 dark:text-orange-400 block">
                          Spoken / Custom Input
                        </span>
                        <span className="font-bold text-sm">
                          "{selectedOption}"
                        </span>
                      </div>
                    </div>
                    {hasChecked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {hasChecked && !isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action / Feedback Drawer */}
      <div
        className={`border-t transition-colors duration-200 ${
          hasChecked
            ? isCorrect
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback message */}
          {hasChecked ? (
            <div className="flex items-start gap-3 w-full sm:w-auto">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${
                  isCorrect ? "bg-emerald-500" : "bg-rose-500"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4
                  className={`font-black text-base ${
                    isCorrect
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-rose-800 dark:text-rose-200"
                  }`}
                >
                  {isCorrect ? "Correct! Well done! 🎉" : "Not quite right!"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-lg leading-relaxed">
                  {activeQuestion?.explanation}
                </p>
              </div>
            </div>
          ) : !isTestMode && lessonStep === 0 ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Read through the concept and code example above, then begin practice.
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Select or speak an answer above and click Check.
            </div>
          )}

          {/* Action Button */}
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-3">
            {!isTestMode && lessonStep === 0 ? (
              <button
                onClick={() => setLessonStep(1)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm tracking-wide shadow-md shadow-orange-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>LET'S PRACTICE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !hasChecked ? (
              <button
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm tracking-wide transition-all ${
                  selectedOption !== null
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 hover:scale-105"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                CHECK
              </button>
            ) : isTestMode ? (
              <button
                onClick={handleNextTestStep}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm tracking-wide text-white transition-all hover:scale-105 ${
                  isCorrect
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
                }`}
              >
                {testStep < testQuestions.length - 1 ? "NEXT QUESTION" : "VIEW TEST RESULTS"}
              </button>
            ) : (
              <button
                onClick={handleNextLessonStep}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm tracking-wide text-white transition-all hover:scale-105 ${
                  isCorrect
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
                }`}
              >
                CONTINUE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Leave {isTestMode ? "Test" : "Lesson"}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Your test session will not be saved. You can take it anytime.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                KEEP LEARNING
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                QUIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
