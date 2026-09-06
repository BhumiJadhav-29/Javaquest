import React, { useState } from "react";
import { CodingChallenge, UserState } from "../types";
import { runJavaCode, ExecutionResult } from "../services/codeRunner";
import { completeChallenge } from "../services/storageService";
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  X,
  Bot,
  Check,
  Award,
} from "lucide-react";

interface CodePlaygroundModalProps {
  challenge: CodingChallenge;
  user: UserState;
  onClose: () => void;
  onAskAi: (prompt: string) => void;
  onChallengeCompleted: (challengeId: string, xpReward: number) => void;
}

export const CodePlaygroundModal: React.FC<CodePlaygroundModalProps> = ({
  challenge,
  onClose,
  onAskAi,
  onChallengeCompleted,
}) => {
  const [code, setCode] = useState<string>(challenge.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"output" | "testcases" | "hint" | "solution">("output");
  const [solved, setSolved] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await runJavaCode(code, challenge.testCases, "java");
      setResult(res);

      if (res.allPassed && res.compiled) {
        setSolved(true);
        completeChallenge(challenge.id, challenge.xpReward);
        onChallengeCompleted(challenge.id, challenge.xpReward);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{challenge.title}</h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    challenge.difficulty === "Easy"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : challenge.difficulty === "Medium"
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> +{challenge.xpReward} XP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {challenge.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onAskAi(
                  `Help me solve this Java challenge: '${challenge.title}'.\nProblem: ${challenge.problemStatement}\n\nMy current code:\n${code}\n\nGive me a gentle pedagogical hint without giving away the direct full answer.`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body: Split Left (Problem/Output) & Right (Code Editor) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Problem description & Result Console */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-900/30 overflow-hidden">
            {/* Problem Statement Card */}
            <div className="p-5 overflow-y-auto max-h-60 border-b border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Problem Statement
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.problemStatement}
              </p>

              {challenge.outputExample && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
                  <span className="text-orange-400 font-bold">Expected Output: </span>
                  <span className="text-slate-200">{challenge.outputExample}</span>
                </div>
              )}
            </div>

            {/* Bottom Tabs: Output / Tests / Hint / Solution */}
            <div className="flex border-b border-slate-800 text-xs font-bold bg-slate-950">
              <button
                onClick={() => setActiveTab("output")}
                className={`px-4 py-2.5 transition-colors border-b-2 ${
                  activeTab === "output"
                    ? "border-orange-500 text-orange-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Console Output
              </button>
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === "testcases"
                    ? "border-orange-500 text-orange-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Tests</span>
                {result && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      result.allPassed ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("hint")}
                className={`px-4 py-2.5 transition-colors border-b-2 flex items-center gap-1 ${
                  activeTab === "hint"
                    ? "border-orange-500 text-orange-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Hint</span>
              </button>
              <button
                onClick={() => setActiveTab("solution")}
                className={`px-4 py-2.5 transition-colors border-b-2 ${
                  activeTab === "solution"
                    ? "border-orange-500 text-orange-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Solution
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300">
              {activeTab === "output" && (
                <div>
                  {result ? (
                    <div className="space-y-3">
                      {result.stdout && (
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase mb-1 font-bold">
                            Standard Output (stdout):
                          </div>
                          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 leading-relaxed overflow-x-auto">
                            {result.stdout}
                          </pre>
                        </div>
                      )}

                      {result.errors && result.errors.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 space-y-1.5 font-sans">
                          <div className="font-bold flex items-center gap-1.5 text-rose-400">
                            <XCircle className="w-4 h-4" /> Java Syntax Warning
                          </div>
                          {result.errors.map((err, i) => (
                            <div key={i} className="text-xs space-y-1">
                              <p className="font-mono text-rose-300">{err.message}</p>
                              <p className="text-[11px] text-slate-300">{err.explanation}</p>
                              <p className="text-[11px] text-emerald-300 font-semibold">
                                Suggested fix: {err.fix}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 font-sans italic">
                      Click "Run Code" to compile and execute your Java code.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "testcases" && (
                <div className="space-y-3 font-sans">
                  {challenge.testCases.map((tc, idx) => {
                    const testRun = result?.testResults?.find((t) => t.id === idx + 1);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          testRun
                            ? testRun.passed
                              ? "bg-emerald-950/30 border-emerald-800"
                              : "bg-rose-950/30 border-rose-800"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-200">
                            Test Case {idx + 1}: {tc.description}
                          </span>
                          {testRun && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                testRun.passed
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {testRun.passed ? (
                                <>
                                  <Check className="w-3 h-3" /> PASSED
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3" /> FAILED
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          Expected: <span className="text-emerald-400">{tc.expectedOutput}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "hint" && (
                <div className="space-y-3 font-sans">
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800 text-amber-200 text-xs leading-relaxed">
                    <p className="font-bold mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Pedagogical Hint
                    </p>
                    <p>{challenge.hint}</p>
                  </div>
                </div>
              )}

              {activeTab === "solution" && (
                <div className="space-y-2">
                  <p className="text-[11px] font-sans text-slate-400">
                    Try solving it on your own first! Here is the reference solution:
                  </p>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs overflow-x-auto leading-relaxed">
                    {challenge.solutionCode}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor */}
          <div className="w-full md:w-7/12 flex flex-col bg-slate-950">
            {/* Editor Top Bar */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">Main.java</span>
              <button
                onClick={() => setCode(challenge.starterCode)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset Code
              </button>
            </div>

            {/* Code Textarea with Tab Support */}
            <div className="flex-1 p-4 relative font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full bg-transparent text-amber-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none placeholder-slate-600"
                placeholder="Write your Java solution here..."
              />
            </div>

            {/* Editor Action Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
              <div>
                {solved && (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Challenge Solved! +{challenge.xpReward} XP Awarded</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={isRunning}
                  onClick={handleRun}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isRunning ? "Compiling..." : "Run Code"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
