import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipForward,
  SkipBack,
  Sparkles,
  CheckCircle2,
  Mic,
  Code2,
  Bot,
  Flame,
  X,
  Share2,
  Copy,
  Check,
  Subtitles,
  ExternalLink,
  Layers,
  ArrowRight,
  Terminal,
} from "lucide-react";
import promoCover from "../assets/images/promo_video_cover_1788687635631.jpg";
import promoFeature from "../assets/images/promo_feature_scene_1788687655185.jpg";

interface PromoDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLearning: () => void;
  onOpenAiTutor: () => void;
  onOpenPractice: () => void;
}

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  duration: number; // in seconds
  narration: string;
  highlights: string[];
  visualType: "intro" | "roadmap" | "voice" | "code" | "ai" | "gamification" | "cta";
  bgGradient: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: "Welcome to JavaQuest",
    subtitle: "The Gamified Duolingo for Software Engineering",
    tagline: "Break free from passive video tutorials. Learn by coding, testing, and questing.",
    badge: "PRODUCT VISION",
    duration: 14,
    narration:
      "Welcome to JavaQuest! The world's first free, 100% gamified programming education platform. Designed to make mastering Java, object-oriented design, and modern backend engineering as engaging, addictive, and bite-sized as Duolingo.",
    highlights: [
      "100% Free Forever — Zero paywalls or credit cards",
      "Bite-sized interactive micro-lessons for busy learners",
      "No local IDE setup needed — code instantly in your browser",
    ],
    visualType: "intro",
    bgGradient: "from-amber-600/30 via-orange-600/20 to-slate-950",
  },
  {
    id: 2,
    title: "Structured Quest Roadmaps",
    subtitle: "A Clear Path from Beginner to Production Engineer",
    tagline: "Step-by-step modular progression with checkpoint challenges and milestone badges.",
    badge: "CURRICULUM",
    duration: 15,
    narration:
      "Explore comprehensive structured learning paths. From Java Foundations and Object-Oriented Programming, to Data Structures, Concurrency, and full-stack Spring Boot REST APIs. Every module tests your knowledge with interactive quizzes, checkpoints, and boss challenges.",
    highlights: [
      "Modular Quest Path with unlockable checkpoints",
      "Comprehensive curriculum: Core Java, OOP, SQL & Spring Boot",
      "Spaced-repetition review to ensure long-term retention",
    ],
    visualType: "roadmap",
    bgGradient: "from-blue-600/30 via-indigo-600/20 to-slate-950",
  },
  {
    id: 3,
    title: "Hands-Free Voice Answering",
    subtitle: "Interactive Speech-to-Text Question Answering",
    tagline: "Speak your answers naturally with real-time speech recognition and smart fuzzy matching.",
    badge: "NEW BREAKTHROUGH FEATURE",
    duration: 16,
    narration:
      "Introducing hands-free speech answering! Answer interactive lesson questions simply by speaking. Say 'Option B', 'System.out', or 'True', and JavaQuest's intelligent speech engine recognizes, transcribes, and matches your spoken words instantly.",
    highlights: [
      "Built-in Web Speech API voice transcription",
      "Intelligent matching for letters, numbers, and code keywords",
      "Auditory chime feedback & hands-free voice submission commands",
    ],
    visualType: "voice",
    bgGradient: "from-rose-600/30 via-orange-600/20 to-slate-950",
  },
  {
    id: 4,
    title: "In-Browser Code Playground",
    subtitle: "Instant Client-Side Code Execution & Test Cases",
    tagline: "Write, test, and debug real Java code with instant automated evaluation.",
    badge: "PRACTICE ARENA",
    duration: 15,
    narration:
      "Put theory into practice inside the interactive Code Playground. Write clean Java code, run it in real-time, and pass automated unit test cases with instant console feedback, line-by-line syntax error diagnostics, and hints.",
    highlights: [
      "Full-featured Monaco-style code editor with syntax highlighting",
      "Instant automated test runner with input/output assertions",
      "Comprehensive challenge library with difficulty tiers",
    ],
    visualType: "code",
    bgGradient: "from-emerald-600/30 via-teal-600/20 to-slate-950",
  },
  {
    id: 5,
    title: "Quest AI: 24/7 Personal Tutor",
    subtitle: "Powered by Gemini AI for Hints & Code Explanations",
    tagline: "Never get stuck. Ask questions, receive analogies, and debug errors in real-time.",
    badge: "AI MENTOR",
    duration: 14,
    narration:
      "Meet Quest AI, your personal 24/7 coding tutor. When you get stuck on a difficult algorithm or bug, Quest AI provides intuitive analogies, Socratic hints, and step-by-step guidance without ever spoiling the answer.",
    highlights: [
      "Server-side Gemini AI with deep Java knowledge",
      "Voice dictation: speak your questions directly to the tutor",
      "One-click 'Explain This Code' from any lesson or playground",
    ],
    visualType: "ai",
    bgGradient: "from-violet-600/30 via-purple-600/20 to-slate-950",
  },
  {
    id: 6,
    title: "Duolingo-Grade Gamification",
    subtitle: "Streaks, Hearts, XP Multipliers & Global Leagues",
    tagline: "Turn coding into an enjoyable daily habit with tangible rewards and achievements.",
    badge: "HABIT ENGINE",
    duration: 15,
    narration:
      "Stay motivated every single day. Build long-running streaks, earn XP to climb competitive weekly leagues, unlock legendary achievements, and protect your hearts. Learning software engineering has never been this addictive.",
    highlights: [
      "Daily streak counters and freeze protections",
      "Heart recovery review sessions to strengthen weak concepts",
      "Competitive leaderboards, milestone badges, and profile tiers",
    ],
    visualType: "gamification",
    bgGradient: "from-amber-600/30 via-yellow-600/20 to-slate-950",
  },
  {
    id: 7,
    title: "Start Your Quest Today",
    subtitle: "100% Free • Open to All Learners Worldwide",
    tagline: "Join thousands of developers leveling up their computer science skills today.",
    badge: "JOIN FREE NOW",
    duration: 12,
    narration:
      "Your engineering journey begins today. No credit cards, no complex installations, and no video lecture fatigue. Click 'Start Learning' to launch your very first Java quest now!",
    highlights: [
      "Beginner-friendly onboarding in under 60 seconds",
      "Cross-platform: practice on desktop, tablet, or mobile",
      "Start coding your future with JavaQuest!",
    ],
    visualType: "cta",
    bgGradient: "from-orange-600/40 via-amber-600/30 to-slate-950",
  },
];

export const PromoDemoVideoModal: React.FC<PromoDemoVideoModalProps> = ({
  isOpen,
  onClose,
  onStartLearning,
  onOpenAiTutor,
  onOpenPractice,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isVoiceoverMuted, setIsVoiceoverMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [showMediaKit, setShowMediaKit] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentScene = SCENES[currentSceneIdx];
  const totalVideoDuration = SCENES.reduce((acc, s) => acc + s.duration, 0);

  // Calculate cumulative timestamp
  const getSceneStartTime = (sceneIdx: number) => {
    let sum = 0;
    for (let i = 0; i < sceneIdx; i++) {
      sum += SCENES[i].duration;
    }
    return sum;
  };

  const currentSceneStartTime = getSceneStartTime(currentSceneIdx);
  const currentSceneProgress = Math.min(
    1,
    Math.max(0, (currentTime - currentSceneStartTime) / currentScene.duration)
  );

  // Speech Synthesis narration
  const speakNarration = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      if (isVoiceoverMuted || !isPlaying) return;

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05 * playbackSpeed;
        utterance.pitch = 1.0;
        utterance.lang = "en-US";

        // Try to pick natural English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Natural") ||
                v.name.includes("Google") ||
                v.name.includes("Samantha") ||
                v.name.includes("Daniel"))
          ) || voices.find((v) => v.lang.startsWith("en"));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error", e);
      }
    },
    [isVoiceoverMuted, isPlaying, playbackSpeed]
  );

  // Trigger narration when scene changes or when unmuting
  useEffect(() => {
    if (isOpen && isPlaying && !isVoiceoverMuted) {
      speakNarration(currentScene.narration);
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentSceneIdx, isOpen, isPlaying, isVoiceoverMuted, speakNarration, currentScene.narration]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Main video playback ticker
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setCurrentTime((prevTime) => {
        const newTime = prevTime + delta * playbackSpeed;

        // Check if exceeded total duration
        if (newTime >= totalVideoDuration) {
          setIsPlaying(false);
          return totalVideoDuration;
        }

        // Check if we crossed into next scene
        let accumulated = 0;
        for (let i = 0; i < SCENES.length; i++) {
          accumulated += SCENES[i].duration;
          if (newTime < accumulated) {
            if (i !== currentSceneIdx) {
              setCurrentSceneIdx(i);
            }
            break;
          }
        }

        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isPlaying, playbackSpeed, totalVideoDuration, currentSceneIdx]);

  // Handle Seek
  const handleSeek = (newTime: number) => {
    const clampedTime = Math.max(0, Math.min(totalVideoDuration, newTime));
    setCurrentTime(clampedTime);

    let accumulated = 0;
    for (let i = 0; i < SCENES.length; i++) {
      accumulated += SCENES[i].duration;
      if (clampedTime <= accumulated) {
        setCurrentSceneIdx(i);
        break;
      }
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < SCENES.length - 1) {
      const nextIdx = currentSceneIdx + 1;
      setCurrentSceneIdx(nextIdx);
      setCurrentTime(getSceneStartTime(nextIdx));
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      const prevIdx = currentSceneIdx - 1;
      setCurrentSceneIdx(prevIdx);
      setCurrentTime(getSceneStartTime(prevIdx));
    } else {
      setCurrentTime(0);
    }
  };

  const handleTogglePlay = () => {
    if (currentTime >= totalVideoDuration) {
      setCurrentTime(0);
      setCurrentSceneIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCopyScript = () => {
    const fullScript = SCENES.map(
      (s) => `[${s.badge} - ${s.title}]\n"${s.narration}"\n`
    ).join("\n");
    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        ref={videoContainerRef}
        className="w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto transition-all"
      >
        {/* Top Video Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <span className="text-base">🎬</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  JavaQuest • Official AI Promo Demo
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Full Feature Tour
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400">
                  4K AI Narrated
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMediaKit(!showMediaKit)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              title="View & copy promotional script & media assets"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Media Kit / Script</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Promo Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Video Viewport (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex flex-col justify-between group select-none">
          {/* Dynamic Background Backdrop */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-all duration-700 opacity-90`}
          />

          {/* Ambient Video Glow Effect */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Overlay Indicator: Scene Badge & Number */}
          <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-white font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{currentScene.badge}</span>
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg backdrop-blur">
                Scene {currentSceneIdx + 1} of {SCENES.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/60 text-xs font-mono font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>{formatSeconds(currentTime)}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{formatSeconds(totalVideoDuration)}</span>
              </div>
            </div>
          </div>

          {/* Center Stage: Interactive Scene Visual Showcase */}
          <div className="relative z-10 px-5 sm:px-10 py-2 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Narrative Headline & Value Pillars */}
              <div className="md:col-span-6 space-y-3 sm:space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                    {currentScene.title}
                  </h1>
                  <h2 className="text-sm sm:text-base font-bold text-orange-400 mt-1">
                    {currentScene.subtitle}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-lg">
                  {currentScene.tagline}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 pt-1">
                  {currentScene.highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Contextual Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  {currentScene.visualType === "roadmap" && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartLearning();
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 transition-all flex items-center gap-1.5"
                    >
                      <span>Explore Quest Road</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {currentScene.visualType === "voice" && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartLearning();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/30 transition-all flex items-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Try Voice Answering</span>
                    </button>
                  )}
                  {currentScene.visualType === "code" && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPractice();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Open Code Playground</span>
                    </button>
                  )}
                  {currentScene.visualType === "ai" && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAiTutor();
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Talk with Quest AI</span>
                    </button>
                  )}
                  {currentScene.visualType === "cta" && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartLearning();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/40 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <span>START FREE QUEST NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Live Simulated App Interface Demonstration */}
              <div className="md:col-span-6 flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/80 p-4 sm:p-5 shadow-2xl backdrop-blur relative overflow-hidden transition-all">
                  {/* Subtle top glare */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40" />

                  {/* Scene 1 Visual: Hero Promo Visual */}
                  {currentScene.visualType === "intro" && (
                    <div className="space-y-3 text-center py-2">
                      <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-md">
                        <img
                          src={promoCover}
                          alt="JavaQuest 3D World"
                          className="w-full h-36 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                          <span className="flex items-center gap-1 text-amber-300">
                            ☕ JavaQuest v2.0
                          </span>
                          <span className="px-2 py-0.5 rounded bg-orange-600 text-white text-[9px] uppercase font-black">
                            100% Free
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-orange-400 font-black text-sm">6+</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">
                            Full Courses
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-amber-400 font-black text-sm">30+</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">
                            Quests & Labs
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-emerald-400 font-black text-sm">0$</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">
                            No Paywall
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scene 2 Visual: Interactive Quest Road Preview */}
                  {currentScene.visualType === "roadmap" && (
                    <div className="space-y-3 py-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-orange-400" />
                          <span>Quest Path • Java Foundations</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          Module 1 of 5
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                              ✓
                            </span>
                            <div>
                              <div className="text-xs font-bold text-white">
                                1. Java Syntax & Print Statements
                              </div>
                              <div className="text-[10px] text-orange-300">
                                Completed • +10 XP
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-amber-300">⭐⭐⭐</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/90 border border-amber-500/60 shadow-lg shadow-amber-500/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center animate-pulse">
                              ▶
                            </span>
                            <div>
                              <div className="text-xs font-bold text-amber-300">
                                2. Variables & Memory Allocation
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Current Quest Node
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            IN PROGRESS
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 opacity-60 flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center">
                            🔒
                          </span>
                          <span className="text-xs text-slate-400">
                            3. Conditionals & Decision Trees
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scene 3 Visual: Hands-Free Speech-to-Text Feature */}
                  {currentScene.visualType === "voice" && (
                    <div className="space-y-3 py-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span>Voice Answering Engine</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          LISTENING LIVE
                        </span>
                      </div>

                      {/* Interactive visualizer */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40">
                            <Mic className="w-4 h-4 animate-bounce" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                              <span>Speech Recognition Active</span>
                            </div>
                            <div className="text-xs font-mono font-black text-white">
                              "Option B: System.out"
                            </div>
                          </div>
                        </div>

                        {/* Animated wave bars */}
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
                        </div>
                      </div>

                      {/* Verified match badge */}
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-200 font-bold">
                            Option B Matched & Auto-Checked!
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-extrabold">
                          +15 XP
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scene 4 Visual: Code Playground */}
                  {currentScene.visualType === "code" && (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Solution.java</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          ALL TESTS PASSED 3/3
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-amber-200">
                        <div>
                          <span className="text-indigo-400">public class</span>{" "}
                          <span className="text-yellow-300">Solution</span> {"{"}
                        </div>
                        <div className="pl-3">
                          <span className="text-indigo-400">public static void</span>{" "}
                          <span className="text-emerald-400">main</span>(String[] args) {"{"}
                        </div>
                        <div className="pl-6 text-slate-300">
                          System.out.println(
                          <span className="text-amber-400">"Welcome to JavaQuest!"</span>
                          );
                        </div>
                        <div className="pl-3">{"}"}</div>
                        <div>{"}"}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">Console:</span>
                          <span className="text-white">Welcome to JavaQuest!</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-[9px]">
                          ⚡ 14ms
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scene 5 Visual: Quest AI Tutor */}
                  {currentScene.visualType === "ai" && (
                    <div className="space-y-2.5 py-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-violet-400" />
                          <span>Quest AI • Intelligent Assistant</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                          GEMINI POWERED
                        </span>
                      </div>

                      {/* User query */}
                      <div className="p-2.5 rounded-xl bg-slate-800 text-xs text-slate-200 ml-6 border border-slate-700">
                        <span className="text-[10px] text-orange-400 font-bold block mb-0.5">
                          Learner Query:
                        </span>
                        "Why does Java require public static void main?"
                      </div>

                      {/* AI Mentor response */}
                      <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-1 text-violet-400 font-bold text-[10px]">
                          <Sparkles className="w-3 h-3" />
                          <span>Quest AI Explanation:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-200">
                          Think of <strong>main</strong> as the front door of your program!
                          The JVM needs to call it directly before creating any objects —
                          that's why it is marked <code>static</code>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Scene 6 Visual: Gamification & Streaks */}
                  {currentScene.visualType === "gamification" && (
                    <div className="space-y-3 py-1 text-center">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 flex items-center justify-around">
                        <div className="flex flex-col items-center">
                          <Flame className="w-6 h-6 fill-orange-500 text-orange-500 animate-bounce" />
                          <span className="font-black text-lg text-white">7 Days</span>
                          <span className="text-[9px] font-bold text-orange-300 uppercase">
                            Streak
                          </span>
                        </div>
                        <div className="h-8 w-px bg-slate-700" />
                        <div className="flex flex-col items-center">
                          <span className="text-xl">❤️</span>
                          <span className="font-black text-lg text-rose-400">5/5</span>
                          <span className="text-[9px] font-bold text-rose-300 uppercase">
                            Hearts
                          </span>
                        </div>
                        <div className="h-8 w-px bg-slate-700" />
                        <div className="flex flex-col items-center">
                          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
                          <span className="font-black text-lg text-amber-400">850</span>
                          <span className="text-[9px] font-bold text-amber-300 uppercase">
                            Total XP
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">
                          🏆 Diamond League • Rank #2
                        </span>
                        <span className="text-emerald-400 font-bold text-[10px]">
                          PROMOTION ZONE
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scene 7 Visual: CTA & Launch Banner */}
                  {currentScene.visualType === "cta" && (
                    <div className="space-y-3 text-center py-2">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-orange-500/30">
                        ☕
                      </div>
                      <h4 className="text-base font-black text-white">
                        Your Java Journey Starts Today
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        No credit card required. Zero setup. 100% free, interactive coding
                        curriculum.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onStartLearning();
                        }}
                        className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md shadow-orange-500/30"
                      >
                        Launch Level 1 Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Closed Captions / Subtitle Bar */}
          {showCaptions && (
            <div className="relative z-10 px-6 py-2.5 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md flex items-center justify-center text-center">
              <p className="text-xs sm:text-sm font-semibold text-amber-300/90 leading-snug max-w-3xl drop-shadow-sm font-sans">
                "{currentScene.narration}"
              </p>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playhead Bar */}
        <div className="px-5 pt-3 pb-2 bg-slate-950 border-t border-slate-800/80 select-none">
          {/* Progress Bar Container */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              handleSeek(ratio * totalVideoDuration);
            }}
            className="group relative h-2.5 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden transition-all hover:h-3.5"
          >
            {/* Total progress bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 transition-all"
              style={{
                width: `${(currentTime / totalVideoDuration) * 100}%`,
              }}
            />

            {/* Scene divider tick marks */}
            {SCENES.map((scene, idx) => {
              const pos = (getSceneStartTime(idx) / totalVideoDuration) * 100;
              return (
                <div
                  key={scene.id}
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-950/80 pointer-events-none"
                  style={{ left: `${pos}%` }}
                />
              );
            })}
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            {/* Left Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevScene}
                disabled={currentSceneIdx === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Previous Chapter"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all hover:scale-105"
                title={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
              </button>

              <button
                onClick={handleNextScene}
                disabled={currentSceneIdx === SCENES.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="Next Chapter"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Replay from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

              <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">
                {formatSeconds(currentTime)} / {formatSeconds(totalVideoDuration)}
              </span>
            </div>

            {/* Chapter Pills */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setCurrentSceneIdx(idx);
                    setCurrentTime(getSceneStartTime(idx));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                    currentSceneIdx === idx
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {idx + 1}. {scene.title.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Right Media Settings (Mute, Captions, Speed, Fullscreen) */}
            <div className="flex items-center gap-2">
              {/* Voiceover Mute Toggle */}
              <button
                onClick={() => setIsVoiceoverMuted(!isVoiceoverMuted)}
                className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                  isVoiceoverMuted
                    ? "bg-slate-800 border-slate-700 text-slate-500"
                    : "bg-orange-500/20 border-orange-500/40 text-orange-400"
                }`}
                title={
                  isVoiceoverMuted
                    ? "Unmute AI voiceover narration"
                    : "Mute AI voiceover narration"
                }
              >
                {isVoiceoverMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Captions Toggle */}
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                  showCaptions
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
                title={showCaptions ? "Turn off subtitles" : "Turn on subtitles"}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Playback Speed */}
              <button
                onClick={() => {
                  const speeds = [1, 1.25, 1.5, 2];
                  const nextSpeed =
                    speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                  setPlaybackSpeed(nextSpeed);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-bold"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleToggleFullscreen}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Media Kit & Promo Script Drawer (Expandable) */}
        {showMediaKit && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Promo Video Script & Media Assets</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ready-to-publish social media copy, timestamps, and narration script.
                </p>
              </div>

              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto space-y-2">
                <div className="text-orange-400 font-bold">
                  // YouTube & Social Video Description:
                </div>
                <p>
                  🚀 Meet JavaQuest — The Gamified Duolingo for Computer Science &
                  Java Engineering!
                </p>
                <p>
                  Master Java syntax, OOP, Concurrency, and Spring Boot through
                  interactive lessons, hands-free Speech-to-Text answers, and an
                  in-browser code runner. 100% free forever.
                </p>
                <p>👉 Start now: https://javaquest.app</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto space-y-2">
                <div className="text-amber-400 font-bold">// Video Chapters:</div>
                {SCENES.map((scene, idx) => (
                  <div key={scene.id} className="text-slate-400">
                    {formatSeconds(getSceneStartTime(idx))} - {scene.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
