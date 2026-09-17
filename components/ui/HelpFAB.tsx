'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircleQuestion } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function HelpFAB() {
  // Pull the toggle function from our Zustand brain
  const { toggleHelpDrawer } = useAppStore();

  return (
    <motion.button
      onClick={toggleHelpDrawer}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all z-40 print:hidden flex items-center justify-center"
      aria-label="Open Strategy Guide"
    >
      <MessageCircleQuestion className="w-6 h-6" />
    </motion.button>
  );
}