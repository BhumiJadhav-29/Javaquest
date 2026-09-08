import { DEDICATED_LESSON_TESTS, getLessonTest } from "../data/lessonTests";
import { COURSES } from "../data/coursesData";
import { Lesson, Question } from "../types";

export interface SubmittedAnswerItem {
  questionId: string;
  selected: string;
}

export interface QuizVerificationResult {
  success: boolean;
  lessonId: string;
  score: number;
  total: number;
  percentage: number;
  stars: number;
  passed: boolean;
  xpEarned: number;
  questionReviews: Array<{
    questionId: string;
    prompt: string;
    selected: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

// Locate any lesson across all courses by ID
function findLessonById(lessonId: string): Lesson | undefined {
  for (const course of COURSES) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonId) return lesson;
      }
    }
  }
  return undefined;
}

export function verifyQuizSubmission(
  lessonId: string,
  userAnswers: SubmittedAnswerItem[] | Record<string, string>
): QuizVerificationResult {
  // Convert map or array into lookup: questionId -> selected
  const answerMap: Record<string, string> = {};
  if (Array.isArray(userAnswers)) {
    userAnswers.forEach((item) => {
      if (item && item.questionId) {
        answerMap[item.questionId] = String(item.selected || "");
      }
    });
  } else if (typeof userAnswers === "object" && userAnswers !== null) {
    Object.entries(userAnswers).forEach(([k, v]) => {
      answerMap[k] = String(v || "");
    });
  }

  // 1. Resolve test questions
  let test = DEDICATED_LESSON_TESTS[lessonId];
  if (!test) {
    const lesson = findLessonById(lessonId);
    if (lesson) {
      test = getLessonTest(lesson);
    }
  }

  const questions: Question[] = test?.questions || [];
  const total = Math.max(1, questions.length);
  let correctCount = 0;

  const reviews: QuizVerificationResult["questionReviews"] = [];

  questions.forEach((q, idx) => {
    // Attempt lookup by question id, or fallback by index order
    let selected = answerMap[q.id];
    if (selected === undefined && Array.isArray(userAnswers) && userAnswers[idx]) {
      selected = userAnswers[idx].selected;
    }
    selected = selected ? String(selected).trim() : "";

    const cleanSelected = selected.toLowerCase();
    const cleanCorrect = String(q.correctAnswer).trim().toLowerCase();
    const isCorrect = cleanSelected === cleanCorrect;

    if (isCorrect) {
      correctCount++;
    }

    reviews.push({
      questionId: q.id,
      prompt: q.prompt,
      selected,
      correctAnswer: String(q.correctAnswer),
      isCorrect,
      explanation: q.explanation,
    });
  });

  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 70;
  const stars = percentage === 100 ? 3 : percentage >= 70 ? 2 : 1;
  const baseBonus = test?.xpBonus || 25;
  const xpEarned = passed ? baseBonus : Math.round(baseBonus / 2);

  return {
    success: true,
    lessonId,
    score: correctCount,
    total,
    percentage,
    stars,
    passed,
    xpEarned,
    questionReviews: reviews,
  };
}
