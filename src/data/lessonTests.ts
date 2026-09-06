import { Lesson, LessonTest, Question } from "../types";

// Pre-crafted dedicated tests for key lessons across all courses and languages
export const DEDICATED_LESSON_TESTS: Record<string, LessonTest> = {
  // Java 1.1 Test
  java_1_1: {
    id: "test_java_1_1",
    title: "Lesson 1 Exit Test: Java Foundations & JVM",
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 4,
    questions: [
      {
        id: "t_j1_1_1",
        type: "multiple-choice",
        prompt: "What is the primary role of the Java Virtual Machine (JVM)?",
        options: [
          "It executes compiled Java bytecode across any operating system",
          "It designs user interfaces automatically",
          "It converts Java source directly into HTML",
          "It connects exclusively to Oracle databases",
        ],
        correctAnswer: "It executes compiled Java bytecode across any operating system",
        explanation: "The JVM is the execution engine that provides platform independence ('Write Once, Run Anywhere').",
      },
      {
        id: "t_j1_1_2",
        type: "predict-output",
        prompt: "What will this Java statement output?",
        codeSnippet: `System.out.println("Java" + 10 + 20);`,
        options: ["Java30", "Java1020", "Java 10 20", "Compilation Error"],
        correctAnswer: "Java1020",
        explanation: "Evaluation proceeds left-to-right: 'Java' + 10 becomes 'Java10', and 'Java10' + 20 results in 'Java1020' string concatenation.",
      },
      {
        id: "t_j1_1_3",
        type: "find-error",
        prompt: "Identify the syntax error in this main method signature:",
        codeSnippet: `public void main(String[] args) {\n    System.out.println("Hello");\n}`,
        options: [
          "Missing 'static' keyword",
          "main cannot take String[] arguments",
          "System must be lowercase",
          "public is not allowed on main",
        ],
        correctAnswer: "Missing 'static' keyword",
        explanation: "The JVM invokes main without instantiating the class, so 'static' is strictly mandatory.",
      },
    ],
  },

  // Java 1.2 Test: Variables & Memory
  java_1_2: {
    id: "test_java_1_2",
    title: "Lesson 2 Exit Test: Variables & Memory",
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 4,
    questions: [
      {
        id: "t_j1_2_1",
        type: "multiple-choice",
        prompt: "Which keyword is used in modern Java (10+) for local variable type inference?",
        options: ["var", "val", "let", "auto"],
        correctAnswer: "var",
        explanation: "Java 10 introduced 'var' for local variable type inference when the type can be deduced from the initializer.",
      },
      {
        id: "t_j1_2_2",
        type: "predict-output",
        prompt: "What is the value of 'result' after executing this code?",
        codeSnippet: `int a = 15;\nint b = 4;\nint result = a / b;`,
        options: ["3.75", "3", "4", "3.0"],
        correctAnswer: "3",
        explanation: "Integer division truncates the decimal portion, so 15 / 4 evaluates to 3.",
      },
      {
        id: "t_j1_2_3",
        type: "code-completion",
        prompt: "Complete the statement to declare a constant integer in Java:",
        codeSnippet: "_____ int MAX_LEVEL = 100;",
        options: ["final", "const", "static", "immutable"],
        correctAnswer: "final",
        explanation: "In Java, 'final' marks a variable so its value cannot be reassigned.",
      },
    ],
  },

  // Java 1.3 Test: Primitive Data Types
  java_1_3: {
    id: "test_java_1_3",
    title: "Lesson 3 Exit Test: Primitive Types",
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 4,
    questions: [
      {
        id: "t_j1_3_1",
        type: "multiple-choice",
        prompt: "How many bits does a Java 'int' occupy in memory?",
        options: ["16 bits", "32 bits", "64 bits", "8 bits"],
        correctAnswer: "32 bits",
        explanation: "A standard Java 'int' is a 32-bit signed two's complement integer.",
      },
      {
        id: "t_j1_3_2",
        type: "find-error",
        prompt: "Why will this line fail to compile?",
        codeSnippet: `float pi = 3.14159;`,
        options: [
          "Floating-point literals are 'double' by default and need an 'f' suffix",
          "pi is a reserved keyword",
          "float cannot store decimal values",
          "Variable name must be capitalized",
        ],
        correctAnswer: "Floating-point literals are 'double' by default and need an 'f' suffix",
        explanation: "In Java, decimal literals like 3.14159 are treated as 'double'. You must write 3.14159f for a float.",
      },
      {
        id: "t_j1_3_3",
        type: "true-false",
        prompt: "In Java, 'char' stores a 16-bit Unicode character.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Java chars are 16-bit unsigned Unicode values supporting international characters.",
      },
    ],
  },

  // Python 1.1 Test
  py_1_1: {
    id: "test_py_1_1",
    title: "Lesson 1 Exit Test: Python Syntax & Scope",
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 4,
    questions: [
      {
        id: "t_py1_1_1",
        type: "multiple-choice",
        prompt: "How does Python define code blocks and scope?",
        options: [
          "Indentation (whitespace)",
          "Curly brackets { }",
          "BEGIN and END statements",
          "Parentheses ( )",
        ],
        correctAnswer: "Indentation (whitespace)",
        explanation: "Python enforces readability by using indentation to determine block hierarchy.",
      },
      {
        id: "t_py1_1_2",
        type: "predict-output",
        prompt: "What will this Python code print?",
        codeSnippet: `x = "Python"\nprint(x * 3)`,
        options: ["PythonPythonPython", "Python 3", "TypeError", "x x x"],
        correctAnswer: "PythonPythonPython",
        explanation: "In Python, multiplying a string by an integer repeats the string that many times.",
      },
      {
        id: "t_py1_1_3",
        type: "code-completion",
        prompt: "Complete the f-string in Python to display the player's level:",
        codeSnippet: `level = 5\nmessage = f"You are level _____"`,
        options: ["{level}", "(level)", "$level", "#level"],
        correctAnswer: "{level}",
        explanation: "Python f-strings interpolate expressions enclosed inside curly braces {expression}.",
      },
    ],
  },

  // JavaScript 1.1 Test
  js_1_1: {
    id: "test_js_1_1",
    title: "Lesson 1 Exit Test: Variables & Arrow Functions",
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 4,
    questions: [
      {
        id: "t_js1_1_1",
        type: "multiple-choice",
        prompt: "Which keyword should you use by default for variables that won't be reassigned?",
        options: ["const", "let", "var", "val"],
        correctAnswer: "const",
        explanation: "Best practice in modern JavaScript is to use 'const' by default, and 'let' only when mutation is necessary.",
      },
      {
        id: "t_js1_1_2",
        type: "predict-output",
        prompt: "What is the return value of this arrow function?",
        codeSnippet: `const square = x => x * x;\nconsole.log(square(4));`,
        options: ["16", "undefined", "NaN", "Error"],
        correctAnswer: "16",
        explanation: "Single-expression arrow functions have an implicit return, returning 4 * 4 = 16.",
      },
      {
        id: "t_js1_1_3",
        type: "find-error",
        prompt: "What happens when you run this code?",
        codeSnippet: `const xp = 100;\nxp = 150;`,
        options: [
          "TypeError: Assignment to constant variable",
          "Silent pass with xp = 150",
          "xp resets to 0",
          "SyntaxError: Missing semicolon",
        ],
        correctAnswer: "TypeError: Assignment to constant variable",
        explanation: "Reassigning a 'const' variable throws a runtime TypeError in JavaScript.",
      },
    ],
  },
};

/**
 * Retrieves the post-lesson test for a given lesson.
 * If a custom test is explicitly attached to the lesson, it uses that.
 * If a dedicated test exists in DEDICATED_LESSON_TESTS, it uses that.
 * Otherwise, it dynamically synthesizes a high-quality 3-question mastery test
 * based on the lesson's content, code sample, questions, and takeaways.
 */
export function getLessonTest(lesson: Lesson): LessonTest {
  if (lesson.test) {
    return lesson.test;
  }

  if (DEDICATED_LESSON_TESTS[lesson.id]) {
    return DEDICATED_LESSON_TESTS[lesson.id];
  }

  // Synthesize test from lesson questions or content
  const sourceQuestions = lesson.questions && lesson.questions.length > 0 ? lesson.questions : [];
  let testQuestions: Question[] = [];

  if (sourceQuestions.length >= 3) {
    // Take a challenging subset or shuffle for the post-lesson test
    testQuestions = sourceQuestions.slice(0, 3).map((q, idx) => ({
      ...q,
      id: `test_${lesson.id}_${idx + 1}`,
      prompt: `[Test] ${q.prompt.replace(/^\[Test\]\s*/, "")}`,
    }));
  } else if (sourceQuestions.length > 0) {
    testQuestions = sourceQuestions.map((q, idx) => ({
      ...q,
      id: `test_${lesson.id}_${idx + 1}`,
      prompt: `[Test] ${q.prompt.replace(/^\[Test\]\s*/, "")}`,
    }));

    // Add a takeaway confirmation question
    testQuestions.push({
      id: `test_${lesson.id}_takeaway`,
      type: "true-false",
      prompt: `[Test] Based on this lesson: ${lesson.content?.keyTakeaway || lesson.description}`,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "This is a fundamental concept taught in this lesson.",
    });
  } else {
    // Default conceptual assessment
    testQuestions = [
      {
        id: `test_${lesson.id}_1`,
        type: "multiple-choice",
        prompt: `What is the central focus of '${lesson.title}'?`,
        options: [
          lesson.description || "Mastering syntax and programming principles",
          "Connecting to an external cloud printer",
          "Formatting hard drives",
          "Uninstalling software",
        ],
        correctAnswer: lesson.description || "Mastering syntax and programming principles",
        explanation: "The lesson directly focuses on this core programming concept.",
      },
      {
        id: `test_${lesson.id}_2`,
        type: "true-false",
        prompt: `Key Takeaway: ${lesson.content?.keyTakeaway || "Consistent practice is required to master this concept."}`,
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Mastering programming requires continuous hands-on reinforcement.",
      },
    ];
  }

  return {
    id: `test_${lesson.id}`,
    title: `Post-Lesson Test: ${lesson.title}`,
    passingScorePercent: 70,
    xpBonus: 25,
    estimatedMinutes: 3,
    questions: testQuestions,
  };
}
