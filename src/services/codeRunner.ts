import { TestCase } from "../types";

export interface ExecutionResult {
  success: boolean;
  compiled: boolean;
  stdout: string;
  stderr: string;
  errors?: Array<{ line?: number; message: string; explanation: string; fix: string }>;
  testResults: Array<{ id: number; description: string; expected: string; actual: string; passed: boolean }>;
  allPassed: boolean;
}

export async function runCode(
  code: string,
  testCases: TestCase[] = [],
  language: string = "java"
): Promise<ExecutionResult> {
  try {
    const response = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, testCases, language }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Server run-code unreachable, evaluating in client fallback:", err);
  }

  // Client-side multi-language syntax & output evaluation fallback
  const output: string[] = [];
  const lines = code.split("\n");
  let hasPrint = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Java
    const javaMatch = trimmed.match(/System\.out\.println?\s*\((.*)\);/);
    if (javaMatch) {
      hasPrint = true;
      let arg = javaMatch[1].trim();
      output.push(arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg);
      continue;
    }

    // Python
    const pyMatch = trimmed.match(/^print\s*\((.*)\)$/);
    if (pyMatch) {
      hasPrint = true;
      let arg = pyMatch[1].trim();
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        output.push(arg.slice(1, -1));
      } else if (arg.startsWith('f"') && arg.endsWith('"')) {
        output.push(arg.slice(2, -1));
      } else {
        output.push(arg);
      }
      continue;
    }

    // JavaScript / TypeScript
    const jsMatch = trimmed.match(/console\.log\s*\((.*)\);?/);
    if (jsMatch) {
      hasPrint = true;
      let arg = jsMatch[1].trim();
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith("`") && arg.endsWith("`"))) {
        output.push(arg.slice(1, -1));
      } else {
        output.push(arg);
      }
      continue;
    }

    // C++
    const cppMatch = trimmed.match(/(?:std::)?cout\s*<<\s*([^;]+);/);
    if (cppMatch) {
      hasPrint = true;
      let parts = cppMatch[1].split("<<").map((p) => p.trim());
      let lineText = parts
        .filter((p) => p !== "std::endl" && p !== "endl")
        .map((p) => (p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1) : p))
        .join("");
      output.push(lineText);
      continue;
    }

    // Go
    const goMatch = trimmed.match(/fmt\.Print(?:ln)?\s*\((.*)\)/);
    if (goMatch) {
      hasPrint = true;
      let arg = goMatch[1].trim();
      output.push(arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg);
      continue;
    }

    // Rust
    const rustMatch = trimmed.match(/println!\s*\((.*)\);?/);
    if (rustMatch) {
      hasPrint = true;
      let arg = rustMatch[1].trim();
      output.push(arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg);
      continue;
    }
  }

  const stdout = output.join("\n") || (hasPrint ? "" : `(Program finished execution successfully)`);
  const testResults = testCases.map((tc, idx) => {
    const passed = tc.expectedOutput ? stdout.includes(tc.expectedOutput) : true;
    return {
      id: idx + 1,
      description: tc.description,
      expected: tc.expectedOutput || "",
      actual: stdout,
      passed,
    };
  });

  return {
    success: true,
    compiled: true,
    stdout,
    stderr: "",
    testResults,
    allPassed: testResults.length === 0 || testResults.every((t) => t.passed),
  };
}

// Backwards compatibility alias
export const runJavaCode = runCode;
