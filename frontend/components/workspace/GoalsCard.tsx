"use client";

import { motion } from "motion/react";

const RADIUS = 60;
const STROKE = 8;
const CIRC = 2 * Math.PI * RADIUS;

const regions = [
  { label: "NSA", percent: 34, dot: "bg-emerald-500" },
  { label: "FDCPA", percent: 28, dot: "bg-sky-500" },
  { label: "ERISA", percent: 22, dot: "bg-amber-500" },
  { label: "HIPAA", percent: 16, dot: "bg-violet-500" },
];

export function GoalsCard() {
  const progress = 0.75;
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          Recovery progress
        </h3>
        <button
          type="button"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 hover:text-ink"
        >
          Region ▾
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="relative h-[148px] w-[148px]">
          <svg
            viewBox="0 0 148 148"
            className="h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="74"
              cy="74"
              r={RADIUS}
              fill="none"
              stroke="rgb(229 231 235)"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx="74"
              cy="74"
              r={RADIUS}
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${CIRC}` }}
              animate={{ strokeDasharray: `${CIRC * progress} ${CIRC}` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <circle
              cx="74"
              cy={74 - RADIUS}
              r={5}
              fill="white"
              stroke="rgb(16 185 129)"
              strokeWidth={2.5}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-[28px] leading-none tracking-tight text-ink">
              75%
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              $1,050 / week
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div className="rounded-[10px] border border-neutral-100 bg-neutral-50/60 p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            This month
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] text-amber-600">$4,200</span>
            <span className="font-mono text-[10px] text-emerald-600">+8.2%</span>
          </div>
        </div>
        <div className="rounded-[10px] border border-neutral-100 bg-neutral-50/60 p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            Last month
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] text-ink">$4,008</span>
            <span className="font-mono text-[10px] text-emerald-600">+4%</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-semibold tracking-tight text-ink">
            By statute
          </h4>
          <button
            type="button"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 hover:text-ink"
          >
            All ▾
          </button>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-4">
          {regions.map((r) => (
            <li key={r.label} className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
              <span className="text-[12px] text-ink">{r.label}</span>
              <span className="ml-auto font-mono text-[11px] text-neutral-500">
                {r.percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-amber-400 px-3 py-2.5 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.3)] transition-colors duration-150 hover:bg-amber-500"
      >
        View full report
      </button>
    </div>
  );
}
