'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Slider } from '@/components/ui/Slider';
import { Accordion } from '@/components/ui/Accordion';
import { HealthGauge } from '@/components/ui/HealthGauge';
import { InputSkeleton } from '@/components/ui/Skeleton';
import { StickyMobileHeader } from '@/components/ui/StickyMobileHeader';
import { Tooltip } from '@/components/ui/Tooltip';
import { HelpFAB } from '@/components/ui/HelpFAB';

export default function Home() {
  const [testCash, setTestCash] = useState(350000);
  const [testSlider, setTestSlider] = useState(12);

  return (
    <main className="min-h-screen p-4 md:p-8 pb-32">
      {/* This will pin to the top on mobile screens */}
      <StickyMobileHeader totalCashNeeded={testCash} isVisible={true} />
      
      <div className="max-w-2xl mx-auto space-y-8 mt-8">
        <h1 className="text-3xl font-bold text-slate-900">UI Component Test Lab V2</h1>
        <p className="text-slate-600 flex items-center">
          Hover this icon to test the Tooltip 
          <Tooltip text="This is a strict SaaS tooltip for complex property jargon!" />
        </p>
        
        <Card className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">1. Sliders & Gauges</h2>
            <CurrencyInput label="Test Currency" value={testCash} onChange={setTestCash} />
            
            <Slider 
              label="Visa Wait Time" 
              value={testSlider} 
              min={0} max={60} 
              onChange={setTestSlider} 
              valueLabel="Months" 
            />

            <div className="pt-4">
              <HealthGauge 
                label="Borrowing Capacity (Turns red over $500k)" 
                currentValue={testCash} 
                maxValue={500000} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">2. Animations & Loaders</h2>
            
            <Accordion title="Click me to expand" subtitle="Smooth animation test">
              <div className="space-y-4 p-2 text-slate-600">
                <p>This content should slide down smoothly. Below is our loading skeleton:</p>
                <InputSkeleton />
              </div>
            </Accordion>
          </div>

        </Card>
      </div>

      {/* Floating Action Button in the bottom right */}
      <HelpFAB onClick={() => alert('Help Drawer will open here!')} />
    </main>
  );
}