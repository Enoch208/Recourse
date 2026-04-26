"use client";

import { motion } from "motion/react";

const RADIUS = 60;
const STROKE = 8;
const CIRC = 2 * Math.PI * RADIUS;

const MOCK_REGIONS = [
  { code: "NSA", percent: 34 },
  { code: "FDCPA", percent: 28 },
  { code: "ERISA", percent: 22 },
  { code: "HIPAA", percent: 16 },
];

const TONES = ["bg-emerald-500", "bg-sky-500", "bg-amber-500", "bg-violet-500"];

type Props = {
  thisMonth?: number;
  lastMonth?: number;
  byStatute?: { code: string; percent: number }[];
  empty?: boolean;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function GoalsCard({ thisMonth, lastMonth, byStatute, empty }: Props = {}) {
  const isMock = thisMonth === undefined && !empty;
  const t = thisMonth ?? 4200;
  const l = lastMonth ?? 4008;
  const regions = (byStatute && byStatute.length > 0
    ? byStatute.slice(0, 4)
    : MOCK_REGIONS
  ).map((r, i) => ({ ...r, dot: TONES[i % TONES.length] }));

  // Goal: "in flight + recovered" toward an arbitrary monthly target.
  // For real users, base progress on this-month-recovered relative to a soft
  // per-week target ($1,400 -> $5,600 monthly). Keeps the donut meaningful.
  const monthlyGoal = 5600;
  const progress = empty
    ? 0
    : Math.min(1, t / monthlyGoal) || (isMock ? 0.75 : 0);
  const weekly = empty ? 0 : Math.round(t / 4) || (isMock ? 1050 : 0);
  const monthChange =
    isMock
      ? 8.2
      : l === 0
        ? t > 0
          ? 100
          : 0
        : Math.round(((t - l) / l) * 1000) / 10;

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
            {progress > 0 && (
              <circle
                cx="74"
                cy={74 - RADIUS}
                r={5}
                fill="white"
                stroke="rgb(16 185 129)"
                strokeWidth={2.5}
              />
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-[28px] leading-none tracking-tight text-ink">
              {Math.round(progress * 100)}%
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              {weekly > 0 ? `${usd(weekly)} / week` : "Awaiting audits"}
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
            <span className="font-mono text-[15px] text-amber-600">
              {usd(t)}
            </span>
            <span
              className={`font-mono text-[10px] ${
                monthChange >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {monthChange >= 0 ? "+" : ""}
              {monthChange}%
            </span>
          </div>
        </div>
        <div className="rounded-[10px] border border-neutral-100 bg-neutral-50/60 p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            Last month
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] text-ink">{usd(l)}</span>
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
        {regions.length === 0 ? (
          <div className="mt-3 rounded-[10px] border border-dashed border-neutral-200 px-3 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            No statutes flagged yet
          </div>
        ) : (
          <ul className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-4">
            {regions.map((r) => (
              <li key={r.code} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                <span className="truncate text-[12px] text-ink">{r.code}</span>
                <span className="ml-auto font-mono text-[11px] text-neutral-500">
                  {r.percent}%
                </span>
              </li>
            ))}
          </ul>
        )}
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
