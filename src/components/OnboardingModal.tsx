import React, { useState } from "react";
import { UserState } from "../types";
import { saveUserState } from "../services/storageService";
import { Sparkles, ArrowRight, Check } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>("Java");
  const [exp, setExp] = useState<string>("Complete Beginner");
  const [username, setUsername] = useState<string>(user.username || "CoderQuest");
  const [avatar, setAvatar] = useState<string>(user.avatar || "☕");

  if (!isOpen) return null;

  const avatars = ["☕", "🚀", "⚔️", "🛡️", "🧠", "✨", "🤖", "💻"];

  const handleFinish = () => {
    user.username = username;
    user.avatar = avatar;
    user.learningPreference = goal;
    user.experienceLevel = exp;
    saveUserState({ ...user });
    localStorage.setItem("javaquest_onboarded", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-600">Step 1 of 3</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                What would you like to master?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We'll personalize your roadmap and practice exercises.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { title: "Java Foundations", desc: "Core syntax, loops, methods & variables" },
                { title: "Object-Oriented Programming", desc: "Classes, inheritance & encapsulation" },
                { title: "Spring Boot & Backend", desc: "APIs, Microservices, and Databases" },
                { title: "Full Stack & Multi-Language", desc: "Java, SQL, Python & JavaScript" },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => setGoal(item.title)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                    goal === item.title
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>
                    <div className="font-extrabold">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                  {goal === item.title && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-600">Step 2 of 3</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                What is your experience level?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                No judgment! JavaQuest starts from first principles.
              </p>
            </div>

            <div className="space-y-2">
              {[
                "Complete Beginner (Never written a line of code)",
                "Some Experience (Know variables and basic logic)",
                "Intermediate (Comfortable with OOP and data structures)",
                "Advanced (Building real software and APIs)",
              ].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setExp(lvl)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all ${
                    exp === lvl
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-600">Step 3 of 3</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                Choose your avatar & handle
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Appear on the community leaderboard and collect achievements.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
              />

              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block pt-2">
                Avatar Emoji
              </label>
              <div className="flex items-center gap-2">
                {avatars.map((em) => (
                  <button
                    key={em}
                    onClick={() => setAvatar(em)}
                    className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border transition-all ${
                      avatar === em
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950 scale-110 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs tracking-wide shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>START JAVA QUEST</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
