'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 print:hidden"
    >
      <Smartphone className="w-4 h-4" />
      <span className="font-semibold text-sm">Install App</span>
    </button>
  );
}