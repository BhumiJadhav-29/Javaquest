import React, { useState } from "react";
import { UserState } from "../types";
import { saveUserState } from "../services/storageService";
import { getLevelForXp } from "../data/questsAndBadges";
import { X, Sparkles, Flame, Heart, Award, RotateCcw, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, user }) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const levelInfo = getLevelForXp(user.xp);
  const avatars = ["☕", "🚀", "⚔️", "🛡️", "🧠", "✨", "🤖", "💻"];

  const handleSave = () => {
    user.username = username;
    user.avatar = avatar;
    saveUserState({ ...user });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your lesson and challenge progress?")) {
      user.xp = 0;
      user.level = 1;
      user.streak = 1;
      user.hearts = 5;
      user.completedLessons = [];
      user.solvedChallenges = [];
      user.completedProjects = [];
      user.unlockedBadges = [];
      user.mistakeLessonIds = [];
      saveUserState({ ...user });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-3xl">
              {avatar}
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {username}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Level {user.level} • {levelInfo.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500 text-xs font-bold mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Streak</span>
            </div>
            <div className="font-black text-sm text-slate-900 dark:text-white">
              {user.streak} Days
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Total XP</span>
            </div>
            <div className="font-black text-sm text-slate-900 dark:text-white">
              {user.xp}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-500 text-xs font-bold mb-0.5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Hearts</span>
            </div>
            <div className="font-black text-sm text-slate-900 dark:text-white">
              {user.hearts} / 5
            </div>
          </div>
        </div>

        {/* Edit Details */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Change Avatar
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
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2"
          >
            {savedMessage ? (
              <>
                <Check className="w-4 h-4" />
                <span>SAVED!</span>
              </>
            ) : (
              <span>SAVE PROFILE</span>
            )}
          </button>

          <button
            onClick={handleResetProgress}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
