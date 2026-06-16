import { useState, useEffect } from "react";
import { Button } from "./ui";

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as any).standalone)
    ) {
      setIsInstalled(true);
    }

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[ServiceWorker] Registered successfully with scope:", reg.scope);
        })
        .catch((err) => {
          console.error("[ServiceWorker] Registration failed:", err);
        });
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log("[PWA] Application installed successfully.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    try {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] User accepted the install prompt");
        setIsInstalled(true);
        setInstallPrompt(null);
      } else {
        console.log("[PWA] User dismissed the install prompt");
      }
    } catch (err) {
      console.error("[PWA] Install prompt error:", err);
    }
  };

  return { installPrompt, isInstalled, triggerInstall };
}

export function InstallBanner() {
  const { installPrompt, isInstalled, triggerInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed || !installPrompt) return null;

  return (
    <div className="bg-gradient-to-r from-electric-500/20 via-sky-500/10 to-emerald-500/20 border-b border-sky-500/30 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg shadow-md glow-blue">
            📱
          </div>
          <div>
            <p className="font-bold text-white">Install RepairMaster Academy</p>
            <p className="text-xs text-slate-300">
              Install our Android PWA for instant offline access and native fullscreen repair labs!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="success" onClick={triggerInstall} className="!px-3 !py-1.5 !text-xs">
            ⬇ Install Free
          </Button>
          <Button variant="ghost" onClick={() => setDismissed(true)} className="!px-2.5 !py-1.5 !text-xs">
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}

export function InstallButton({ className = "" }: { className?: string }) {
  const { installPrompt, isInstalled, triggerInstall } = usePWA();

  if (isInstalled || !installPrompt) return null;

  return (
    <Button
      variant="success"
      onClick={triggerInstall}
      className={`!px-3 !py-1.5 !text-xs gap-1.5 shadow-emerald-500/20 animate-pulse ${className}`}
      title="Install App on your device"
    >
      <span>📱</span>
      <span>Install App</span>
    </Button>
  );
}
