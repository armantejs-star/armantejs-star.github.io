'use client';

import React, { useEffect, useState } from 'react';

export function AnimatedNumber({ value, prefix = '' }: { value: number, prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 700; // 0.7 seconds of animation
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart easing function for a premium, smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}</span>;
}