"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, RotateCcw, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface StepChecklistProps {
  slug: string;
  steps: string[];
}

export function StepChecklist({ slug, steps }: StepChecklistProps) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const storageKey = `checklist_progress_${slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedSteps(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggleStep = (index: number) => {
    let updated: number[];
    if (checkedSteps.includes(index)) {
      updated = checkedSteps.filter((i) => i !== index);
    } else {
      updated = [...checkedSteps, index];
      // If all completed, trigger confetti!
      if (updated.length === steps.length) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
    setCheckedSteps(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setCheckedSteps([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const progressPercent = steps.length > 0 ? Math.round((checkedSteps.length / steps.length) * 100) : 0;
  const isAllComplete = checkedSteps.length === steps.length && steps.length > 0;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Interactive Diagnostic Checklist
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Check off steps as you execute troubleshooting workflows. Saved locally in your browser.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-teal-700 dark:text-teal-400">
            {checkedSteps.length}/{steps.length} ({progressPercent}%)
          </span>
          {checkedSteps.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-1"
              title="Reset progress"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-300 ${
            isAllComplete ? "bg-emerald-500" : "bg-teal-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isChecked = checkedSteps.includes(index);
          return (
            <div
              key={index}
              onClick={() => toggleStep(index)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                isChecked
                  ? "bg-teal-50/70 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/60 text-stone-600 dark:text-stone-300"
                  : "bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  isChecked
                    ? "bg-teal-600 text-white"
                    : "border-2 border-stone-300 dark:border-stone-600 hover:border-teal-500"
                }`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <span className={`text-sm leading-relaxed ${isChecked ? "line-through opacity-70" : ""}`}>
                {step.replace(/^(Step \d+:|\d+\.)\s*/, "")}
              </span>
            </div>
          );
        })}
      </div>

      {isAllComplete && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>All troubleshooting steps verified! The system should now operate normally.</span>
        </div>
      )}
    </div>
  );
}
