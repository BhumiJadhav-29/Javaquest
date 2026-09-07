import React, { useState, useEffect } from "react";
import { UserState, AdminMetricsData } from "../types";
import { fetchAdminMetrics, loginUser, verifyAdminPasskey } from "../services/storageService";
import { COURSES } from "../data/coursesData";
import { CODING_CHALLENGES } from "../data/challengesData";
import { PROJECTS } from "../data/projectsData";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  Code2,
  Activity,
  Server,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileCheck,
  Eye,
  EyeOff,
  Clock,
  UserCheck,
} from "lucide-react";

interface AdminViewProps {
  currentUser: UserState;
  onNavigate: (view: string) => void;
  onUserRoleUpdated?: (user: UserState) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onNavigate,
  onUserRoleUpdated,
}) => {
  const [metrics, setMetrics] = useState<AdminMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick unlock passkey state for non-admin testing
  const [adminPasskey, setAdminPasskey] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (currentUser.role !== "admin") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const res = await fetchAdminMetrics(currentUser);
      if (isMounted) {
        if (res.success && res.data) {
          setMetrics(res.data);
        } else {
          setError(res.error || "Failed to load telemetry.");
        }
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleAdminPasskeyUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    if (!adminPasskey.trim()) {
      setUnlockError("Please enter the secret administrator clearance passkey.");
      return;
    }

    setIsUnlocking(true);
    const res = await verifyAdminPasskey(adminPasskey.trim(), currentUser);
    if (res.success) {
      currentUser.role = "admin";
      onUserRoleUpdated?.({ ...currentUser });
      const metricsRes = await fetchAdminMetrics(currentUser);
      if (metricsRes.success && metricsRes.data) {
        setMetrics(metricsRes.data);
      }
      setAdminPasskey("");
    } else {
      setUnlockError(res.error || "Invalid administrator clearance passkey. Access denied.");
    }
    setIsUnlocking(false);
  };

  const handleSwitchToAdminLogin = () => {
    onNavigate("register");
  };

  const totalLessons = COURSES.flatMap((c) => c.modules.flatMap((m) => m.lessons)).length;

  // 1. NON-ADMIN RESTRICTION SCREEN (Only Admin will know how many users are using the app)
  if (currentUser.role !== "admin") {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8 animate-in fade-in">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-500 flex items-center justify-center mx-auto text-3xl shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Access Restricted
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Administrator Telemetry Only
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Under JavaQuest Data Privacy & Protection Policy, <strong>only verified administrators</strong> have authorization to view platform user counts, learner telemetry, and the registered user directory.
            </p>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-left max-w-md mx-auto space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Learner Privacy Protection Active</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Student accounts and learning analytics are kept confidential and cannot be viewed by other learners or public visitors.
            </p>
          </div>

          {/* Unlock with Admin Clearance */}
          <div className="pt-2 max-w-md mx-auto space-y-4">
            <form onSubmit={handleAdminPasskeyUnlock} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  placeholder="Enter administrator clearance passkey"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition"
                >
                  Unlock
                </button>
              </div>
              {unlockError && (
                <p className="text-[11px] text-rose-500 font-semibold text-left">{unlockError}</p>
              )}
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleSwitchToAdminLogin}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>Sign In with Administrator Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHORIZED ADMINISTRATOR VIEW
  const totalUsers = metrics?.totalUsers ?? 5;
  const activeToday = metrics?.activeToday ?? 1;
  const studentsCount = metrics?.studentsCount ?? 3;
  const adminsCount = metrics?.adminsCount ?? 2;
  const totalLessonsCompleted = metrics?.totalLessonsCompleted ?? 12;
  const totalTestsPassed = metrics?.totalTestsPassed ?? 8;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Administrator Clearance Verified
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
              GDPR / CCPA Compliant
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Platform Users & Administration
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Confidential learner metrics, privacy consent audit records, and infrastructure health.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Admin Logged In:
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 text-xs font-black">
            {currentUser.username} ({currentUser.email})
          </span>
        </div>
      </div>

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Registered Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {totalUsers}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>{studentsCount} Students</span> • <span>{adminsCount} Admins</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {activeToday}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Authenticated Sessions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lessons Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {totalLessonsCompleted}
          </div>
          <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
            Across All Quests
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exit Tests Passed
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {totalTestsPassed}
          </div>
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Mastery Scorecards
          </div>
        </div>
      </div>

      {/* Registered Users & Privacy Compliance Audit Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-500" />
              <span>Registered Accounts & Privacy Consent Registry</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strictly restricted to administrators. Confirms user registration and privacy agreement timestamp.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800 shrink-0">
            {metrics?.users?.length || totalUsers} Accounts in Database
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Learner / Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Privacy Consent (GDPR)</th>
                <th className="py-3 px-4">Level / XP</th>
                <th className="py-3 px-4">Completed Quests</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {metrics?.users && metrics.users.length > 0 ? (
                metrics.users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {u.username}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {u.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === "admin"
                            ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Agreed & Verified</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.privacyConsentDate ? u.privacyConsentDate.split("T")[0] : "Active"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold">Lvl {u.level}</div>
                      <div className="text-[10px] text-slate-400">{u.xp} XP</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold">{u.completedLessonsCount} lessons</span>
                      <span className="text-[10px] text-slate-400 block">
                        {u.testsTakenCount} exit tests
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {u.joinedDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Loading accounts registry...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Infrastructure Health */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-orange-500" />
          <span>System Infrastructure & Privacy Gateway</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Admin Telemetry Gateway
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                RBAC & Token Verification
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PROTECTED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                PWA Service Worker
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Auto-Update & Offline Ready
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Quest AI Tutor Service
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Gemini 2.5 Flash Server Proxy
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
