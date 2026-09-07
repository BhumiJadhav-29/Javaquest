import React, { useState } from "react";
import { UserState } from "../types";
import { registerUser, loginUser } from "../services/storageService";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileText,
  KeyRound,
  Download,
  Shield,
  HelpCircle,
  Copy,
  Check,
  Share2,
  Smartphone,
} from "lucide-react";
import { PWAInstallButton } from "./PWAInstallButton";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface RegisterViewProps {
  currentUser: UserState;
  onSuccess: (user: UserState) => void;
  onNavigate: (view: string) => void;
  initialMode?: "register" | "login";
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  currentUser,
  onSuccess,
  onNavigate,
  initialMode = "register",
}) => {
  const { isInstalled } = usePWAInstall();
  const [mode, setMode] = useState<"register" | "login">(initialMode);

  // Form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("☕");
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const avatars = ["☕", "🚀", "⚔️", "🛡️", "🧠", "✨", "🤖", "💻"];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!username.trim() || username.trim().length < 2) {
      setError("Please choose a username with at least 2 characters.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreedToPrivacy) {
      setError("You must agree to the Privacy Policy & Terms of Service to register.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        avatar,
        agreedToPrivacyPolicy: true,
        adminCode: adminCode.trim(),
      });

      if (res.success && res.user) {
        setSuccessMsg("Account registered successfully! Welcome to JavaQuest.");
        setTimeout(() => {
          onSuccess(res.user!);
          onNavigate("dashboard");
        }, 800);
      } else {
        setError(res.error || "Registration failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setError("Please enter your email or username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(email.trim(), password);

      if (res.success && res.user) {
        setSuccessMsg(`Welcome back, ${res.user.username}!`);
        setTimeout(() => {
          onSuccess(res.user!);
          onNavigate("dashboard");
        }, 800);
      } else {
        setError(res.error || "Invalid user credentials. Access denied.");
      }
    } catch (err: any) {
      setError("Unable to authenticate with provided credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6 space-y-4 sm:space-y-6">
      {/* Top Banner with PWA Install Prompt - Only shown if NOT yet installed */}
      {!isInstalled && (
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-lg sm:text-xl shrink-0">
              📲
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-white">Install JavaQuest App on Your Device</h4>
              <p className="text-[11px] sm:text-xs text-orange-100">
                Install as a mobile or desktop application with offline access to study anywhere.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition backdrop-blur shadow-xs"
              title="Copy installation link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
            </button>
            <PWAInstallButton variant="nav" className="bg-slate-900 text-white hover:bg-slate-800 shrink-0 shadow-md" />
          </div>
        </div>
      )}

      {/* Main Registration & Sign-In Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Right Form Body - Displayed FIRST on mobile so it fits the screen immediately */}
        <div className="order-1 md:order-2 md:col-span-7 p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg sm:rounded-xl text-xs font-black transition-all ${
                mode === "register"
                  ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              User Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg sm:rounded-xl text-xs font-black transition-all ${
                mode === "login"
                  ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In (Valid Credentials)
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          {mode === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. CodeNinja26"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choose Learner Avatar
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {avatars.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setAvatar(em)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border transition-all ${
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

              {/* Admin Code Accordion (Optional) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminField(!showAdminField)}
                  className="text-[11px] font-bold text-slate-500 hover:text-orange-500 dark:text-slate-400 flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showAdminField ? "Hide Administrator Passkey" : "Have an Administrator Passkey?"}</span>
                </button>
                {showAdminField && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 animate-in fade-in">
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter administrator clearance passkey"
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-xs font-mono border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Admin clearance grants access to total user telemetry and platform administration.
                    </span>
                  </div>
                )}
              </div>

              {/* Privacy Terms & Conditions Checkbox (Mandatory) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-orange-500 focus:ring-orange-400 border-slate-300 dark:border-slate-700 accent-orange-500"
                  />
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    <span>
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-orange-600 dark:text-orange-400 font-bold underline hover:text-orange-700"
                      >
                        Privacy Policy and Terms of Service
                      </button>
                      . I understand that my learning progress is recorded securely, and user counts and directory telemetry are strictly restricted to administrators.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <span className="animate-pulse">Registering Secure Account...</span>
                ) : (
                  <>
                    <span>REGISTER ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email or Username <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email or username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Account opens strictly with valid credentials matching registered records.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <span className="animate-pulse">Validating Credentials...</span>
                ) : (
                  <>
                    <span>SIGN IN TO ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy Note Footer */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Read JavaQuest Data Privacy & Governance Agreement</span>
            </button>
          </div>
        </div>

        {/* Informational Column - On desktop: left col (order-1), on mobile: below form (order-2) */}
        <div className="order-2 md:order-1 md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 p-5 sm:p-8 text-white flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">☕</span>
              <div>
                <span className="font-black text-lg tracking-tight text-white">JavaQuest</span>
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  Security & Privacy First
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-black text-base sm:text-lg leading-snug">
                {mode === "register"
                  ? "Start Your Interactive Coding Journey"
                  : "Welcome Back to Your Code Quests"}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                JavaQuest provides gamified multi-language learning with live code sandboxes, mastery exit tests, and personal progress tracking.
              </p>
            </div>

            {/* Step-by-Step Flow Guide */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 block">
                How It Works:
              </span>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white block">
                    {isInstalled ? "Launch via Installed App:" : "Install or Launch:"}
                  </strong>
                  <span>
                    {isInstalled
                      ? "Running in standalone app mode with offline readiness."
                      : "Install app on your device for native performance and offline study."}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white block">Register Private Account:</strong>
                  <span>Valid credentials establish an isolated, private learning session.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white block">Unlock All Activities:</strong>
                  <span>Full access to quest roadmaps, live challenges, projects, and AI tutor.</span>
                </div>
              </div>
            </div>

            {/* Privacy Commitments */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy:</strong> Student progress is strictly private and isolated. Admin metrics and user telemetry are restricted.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            Protected by JavaQuest Educational Data Policy.
          </div>
        </div>
      </div>

      {/* Comprehensive Privacy Policy & Terms Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center text-xl">
                  🛡️
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    Privacy Policy & Educational Terms
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    GDPR, CCPA & Student Data Governance Compliance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 pr-2 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 font-semibold text-orange-900 dark:text-orange-200">
                Summary: JavaQuest treats student and developer privacy as a fundamental human right. We do not sell your personal data, track cross-site cookies, or expose student progress to unauthorized third parties.
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                  1. Information We Collect
                </h4>
                <p>
                  When you register an account, we collect your selected username, email address, chosen avatar, and secure credential hashes. During your learning sessions, we record completed quest lessons, exit test scores, earned badges, streak counters, and coding sandbox attempts.
                </p>
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                  2. Strict Administrator Role-Based Access (RBAC)
                </h4>
                <p>
                  To protect learner privacy, <strong>only verified administrators</strong> possess authorization to access user directories, registered student tallies, and platform-wide analytics. Students cannot view or scrape private accounts or user counts.
                </p>
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                  3. Credential Security & Authentication
                </h4>
                <p>
                  User accounts open strictly with valid, verified credentials. Authentication sessions are validated across client sessions and API requests.
                </p>
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                  4. GDPR Right to Data Portability
                </h4>
                <p>
                  You have the full right to download an offline machine-readable JSON copy of all your educational records, scorecards, and user profile data at any time via your account settings.
                </p>
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                  5. GDPR Right to Erasure ("Right to be Forgotten")
                </h4>
                <p>
                  You may permanently purge your account, credentials, and all recorded educational progress at any time. All database entries associated with your email are irreversibly deleted upon verification.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => {
                  setAgreedToPrivacy(true);
                  setShowPrivacyModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-sm"
              >
                I Understand & Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
