'use client';

import React, { useState, useEffect } from 'react';
import { Lock, AlertOctagon } from 'lucide-react';

export function BetaLock({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  // ==========================================
  // ⚙️ DEVELOPER CONTROL PANEL
  // ==========================================
  // 1. The app will permanently lock on this date:
  const EXPIRY_DATE = new Date('2026-11-15T00:00:00'); 
  
  // 2. The secret PIN testers must enter:
  const CURRENT_VERSION_PASSCODE = 'BROKE26'; 
  // ==========================================

  useEffect(() => {
    setIsClient(true);
    
    // Check Timebomb
    if (new Date() > EXPIRY_DATE) {
      setIsExpired(true);
      return;
    }

    // Check if they previously unlocked the current version
    const savedPasscode = localStorage.getItem('brokebuilder_passcode');
    if (savedPasscode === CURRENT_VERSION_PASSCODE) {
      setIsAuthenticated(true);
    }
  }, []);

  // Prevent UI flashing during Next.js hydration
  if (!isClient) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === CURRENT_VERSION_PASSCODE) {
      localStorage.setItem('brokebuilder_passcode', CURRENT_VERSION_PASSCODE);
      setIsAuthenticated(true);
    } else {
      setError('Invalid access code.');
    }
  };

  // UI: The Timebomb Screen
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-slate-50 mb-2">Beta Expired</h1>
        <p className="text-slate-400 max-w-md">
          This testing build of Broke Builder has been deactivated. Contact the developer for the production release.
        </p>
      </div>
    );
  }

  // UI: The Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full">
          <Lock className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-50 mb-2">Broke Builder Beta</h1>
          <p className="text-slate-400 mb-6 text-sm">Enter your developer access code to test this software.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="text"
              placeholder="ENTER PIN"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-center text-white uppercase tracking-widest focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/50"
            >
              Unlock Engine
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If passed all checks, render the actual app
  return <>{children}</>;
}