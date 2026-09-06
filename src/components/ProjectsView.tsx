import React, { useState } from "react";
import { Project, UserState } from "../types";
import { PROJECTS } from "../data/projectsData";
import { runJavaCode, ExecutionResult } from "../services/codeRunner";
import { completeProject } from "../services/storageService";
import {
  FolderGit2,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  X,
  Code2,
  Check,
} from "lucide-react";

interface ProjectsViewProps {
  user: UserState;
  onAskAi: (prompt: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  user,
  onAskAi,
}) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectCode, setProjectCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleOpenProject = (p: Project) => {
    setActiveProject(p);
    setProjectCode(p.starterCode);
    setExecResult(null);
    setIsCompleted(user.completedProjects.includes(p.id));
  };

  const handleRunProject = async () => {
    if (!activeProject) return;
    setIsRunning(true);
    try {
      const res = await runJavaCode(projectCode, activeProject.testCases, "java");
      setExecResult(res);

      if (res.allPassed && res.compiled) {
        setIsCompleted(true);
        completeProject(activeProject.id, activeProject.xpReward);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Portfolio Builders
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Practical Real-World Projects
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Put concepts into practice by constructing end-to-end applications: from simple terminal utilities to OOP simulations and Spring Boot APIs.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project) => {
          const isDone = user.completedProjects.includes(project.id);

          return (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {project.difficulty}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> +{project.xpReward} XP
                    </span>
                  </div>
                </div>

                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  {project.title}
                  {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Concepts Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.conceptsUsed.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>~{project.estimatedHours} Hours</span>
                </div>

                <button
                  onClick={() => handleOpenProject(project)}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-sm shadow-orange-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isDone ? "Review Code" : "Start Project"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Workspace Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-5xl h-[90vh] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold">
                  🏗️
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeProject.category} • +{activeProject.xpReward} XP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onAskAi(
                      `I am building the project '${activeProject.title}'.\nRequirements:\n${activeProject.requirements.join(
                        "\n"
                      )}\n\nCurrent code:\n${projectCode}\n\nCould you give me guidance on the next architectural step?`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold"
                >
                  Ask AI Tutor
                </button>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Instructions Left */}
              <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-800 p-5 overflow-y-auto space-y-4 bg-slate-900/30">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Requirements
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeProject.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Implementation Steps
                  </h4>
                  <div className="space-y-3">
                    {activeProject.steps.map((st) => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="font-bold text-slate-200">{st.title}</div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {st.instructions}
                        </p>
                        {st.codeHint && (
                          <div className="p-1.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px]">
                            {st.codeHint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Output Box */}
                {execResult && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Execution Output:
                    </div>
                    <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                      {execResult.stdout || "(No output)"}
                    </pre>
                  </div>
                )}
              </div>

              {/* Code Editor Right */}
              <div className="w-full md:w-7/12 flex flex-col bg-slate-950">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">Main.java</span>
                  <button
                    onClick={() => setProjectCode(activeProject.starterCode)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Starter
                  </button>
                </div>

                <div className="flex-1 p-4 font-mono text-xs">
                  <textarea
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-full bg-transparent text-amber-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                    placeholder="Write project implementation..."
                  />
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div>
                    {isCompleted && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Check className="w-4 h-4" /> Project Passed & XP Awarded!
                      </span>
                    )}
                  </div>

                  <button
                    disabled={isRunning}
                    onClick={handleRunProject}
                    className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRunning ? "Verifying..." : "Run & Verify Project"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
