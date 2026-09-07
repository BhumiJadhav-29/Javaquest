import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Comprehensive check for installed / standalone mode
  const checkIsInstalled = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      if (localStorage.getItem("javaquest_pwa_installed") === "true") {
        return true;
      }
      if (window.matchMedia("(display-mode: standalone)").matches) {
        return true;
      }
      if (window.matchMedia("(display-mode: minimal-ui)").matches) {
        return true;
      }
      if (window.matchMedia("(display-mode: window-controls-overlay)").matches) {
        return true;
      }
      if ((window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        return true;
      }
      if (typeof document !== "undefined" && document.referrer && document.referrer.startsWith("android-app://")) {
        return true;
      }
    } catch {
      // ignore storage access restrictions
    }
    return false;
  };

  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsInstalled());
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Re-verify installed state
    setIsInstalled(checkIsInstalled());

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // If already installed, don't capture prompt
      if (checkIsInstalled()) {
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      try {
        localStorage.setItem("javaquest_pwa_installed", "true");
      } catch {
        // ignore
      }
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const markInstalled = () => {
    try {
      localStorage.setItem("javaquest_pwa_installed", "true");
    } catch {
      // ignore
    }
    setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        try {
          localStorage.setItem("javaquest_pwa_installed", "true");
        } catch {
          // ignore
        }
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn("PWA install error:", err);
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    isIOS,
    install,
    markInstalled,
  };
}
