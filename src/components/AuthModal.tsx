import React, { useState } from "react";
import { UserState } from "../types";
import {
  saveUserState,
  downloadUserDataJson,
  deleteUserAccountPermanently,
  logoutUser,
} from "../services/storageService";
import { getLevelForXp } from "../data/questsAndBadges";
import {
  X,
  Sparkles,
  Flame,
  Heart,
  RotateCcw,
  Check,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  UserPlus,
  Lock,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserState;
  onOpenRegisterPage?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenRegisterPage,
}) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleExportData = () => {
    downloadUserDataJson(user);
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    if (!deletePassword) {
      setDeleteError("Password confirmation is required to delete your account.");
      return;
    }

    const res = await deleteUserAccountPermanently(user, deletePassword);
    if (res.success) {
      alert("Your account and all associated educational data have been permanently erased.");
      window.location.reload();
    } else {
      setDeleteError(res.error || "Failed to delete account. Please verify your password.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
    if (onOpenRegisterPage) {
      onOpenRegisterPage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-3xl">
              {avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {username}
                </h3>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    user.role === "admin"
                      ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {user.role || "student"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email || "Registered Learner"} • Level {user.level} ({levelInfo.title})
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
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Display Name
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
              Choose Avatar
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {avatars.map((em) => (
                <button
                  key={em}
                  onClick={() => setAvatar(em)}
                  className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center border transition-all ${
                    avatar === em
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950 scale-110 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy & GDPR Rights Section */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Privacy & GDPR Controls</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              Consent Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleExportData}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>Export My Data</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete Account</span>
            </button>
          </div>

          {/* Delete confirmation drawer */}
          {showDeleteConfirm && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-2 animate-in fade-in">
              <span className="font-bold text-rose-800 dark:text-rose-300 block text-[11px]">
                Permanent Deletion (Right to Erasure): Enter your password to irreversibly erase all your records.
              </span>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 text-xs text-slate-900 dark:text-white"
              />
              {deleteError && (
                <span className="text-[10px] text-rose-600 block">{deleteError}</span>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirm Permanent Deletion
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2"
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

          <div className="flex gap-2">
            {onOpenRegisterPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegisterPage();
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-orange-500" />
                <span>Switch / Register</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
