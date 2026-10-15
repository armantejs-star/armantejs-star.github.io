'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TutorialGuide } from '@/components/modules/TutorialGuide';

export function KnowledgeBaseDrawer() {
  const { isKnowledgeBaseOpen, setKnowledgeBaseOpen } = useAppStore();

  if (!isKnowledgeBaseOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setKnowledgeBaseOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-100 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold">Broke Builder Knowledge Base</h2>
              <p className="text-xs text-slate-400 mt-1">Full documentation and operating guide</p>
            </div>
            <button
              onClick={() => setKnowledgeBaseOpen(false)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <TutorialGuide />
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
            Broke Builder Engine v4.0 • SA Property & Strategy Tool
          </div>

        </div>
      </div>
    </div>
  );
}