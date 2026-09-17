'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertCircle, Building2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function KnowledgeBaseDrawer() {
  const { isHelpDrawerOpen, toggleHelpDrawer } = useAppStore();

  // Prevent scrolling on the main page when the drawer is open
  useEffect(() => {
    if (isHelpDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isHelpDrawerOpen]);

  return (
    <AnimatePresence>
      {isHelpDrawerOpen && (
        <>
          {/* Dark background overlay (clicking it closes the drawer) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleHelpDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* The actual sliding drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-600">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-800">Strategy Guide</h2>
              </div>
              <button 
                onClick={toggleHelpDrawer}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <section className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-500" />
                  SA PR Refund Loophole
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  RevenueSA applies a 7% foreign surcharge to temporary residents. However, if you receive your Permanent Residency (PR) within 12 months of the property settlement date, you can apply to have this 7% surcharge fully refunded. 
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Adelaide Soil Reactivity
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Adelaide is known for highly reactive clay soils. Standard builder quotes usually only include Class A or S (Low Risk) footings. If your engineering report returns a Class H or E, builders will charge a heavy variation (often $20k - $40k) to upgrade your slab. Always buffer for this pre-contract.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Joint Purchase Mix-Visa Rule
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  If you purchase a property as 50/50 Joint Tenants where one applicant is an Australian Citizen/PR and the other is a Temporary Resident, RevenueSA will only apply the 7% surcharge to the Temporary Resident's 50% share of the property (effectively halving the tax).
                </p>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}