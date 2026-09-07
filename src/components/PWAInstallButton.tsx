import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Smartphone, Check, X, Share, PlusSquare, Sparkles } from "lucide-react";

interface PWAInstallButtonProps {
  variant?: "nav" | "sidebar" | "banner" | "compact";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "nav",
  className = "",
}) => {
  const { isInstallable, isInstalled, isIOS, install, markInstalled } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [justInstalled, setJustInstalled] = useState<boolean>(false);

  // If already installed, do not show install options again anywhere in the app
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Browser hasn't fired beforeinstallprompt yet or in iframe preview, open instruction dialog
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === "nav" && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 ${className}`}
          title="Install JavaQuest to your device"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === "sidebar" && (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-slate-900 border border-orange-200 dark:border-orange-800/60 text-orange-900 dark:text-orange-200 hover:border-orange-400 transition-all text-left group ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                Install App
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Offline & 1-Click Launch
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-600 dark:text-orange-300">
            Free
          </span>
        </button>
      )}

      {variant === "banner" && (
        <div className={`p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white border border-orange-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-white">Install JavaQuest Application</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/40">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Install on your Desktop, Android, or iPhone for instant access, offline quests, and distraction-free learning.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Install Now</span>
          </button>
        </div>
      )}

      {variant === "compact" && (
        <button
          onClick={handleInstallClick}
          className={`p-2 rounded-xl text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors ${className}`}
          title="Install JavaQuest"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* Guide Modal for iOS Safari and Desktop browser tips */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center text-xl">
                  📱
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Install JavaQuest
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fast installation guide for your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-orange-500" />
                  <span>On iPhone or iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>
                    Tap the <strong className="text-slate-700 dark:text-slate-200">Share</strong> button <Share className="w-3 h-3 inline text-sky-500 mx-0.5" /> in the Safari bottom bar.
                  </li>
                  <li>
                    Scroll down and select <strong className="text-slate-700 dark:text-slate-200">Add to Home Screen</strong> <PlusSquare className="w-3 h-3 inline text-emerald-500 mx-0.5" />.
                  </li>
                  <li>Tap <strong>Add</strong> in the top right corner.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>On Chrome, Edge, or Android:</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Look for the <strong className="text-slate-700 dark:text-slate-200">Install App</strong> icon in your browser URL address bar, or open the browser menu (⋮) and tap <strong className="text-slate-700 dark:text-slate-200">Install JavaQuest</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  markInstalled();
                  setShowIOSGuide(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>I've Installed It</span>
              </button>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
