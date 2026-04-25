"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Exchange01Icon } from "@hugeicons/core-free-icons";

const thisMonth = [44, 78, 56, 92, 64];
const lastMonth = [38, 52, 71, 48, 60];

function MiniBars({ values, tone }: { values: number[]; tone: "emerald" | "neutral" }) {
  const max = Math.max(...values);
  const fill = tone === "emerald" ? "bg-emerald-400" : "bg-neutral-300";
  return (
    <div className="flex h-12 items-end gap-1">
      {values.map((v, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0.3, opacity: 0 }}
          animate={{ scaleY: v / max, opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "bottom" }}
          className={`w-2 rounded-t-[3px] ${fill}`}
        />
      ))}
    </div>
  );
}

export function ComparisonCard() {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <header className="flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-ink">
            Comparison
          </div>
          <div className="mt-0.5 text-[12px] text-neutral-500">
            This month vs. last month
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
          aria-label="Swap"
        >
          <HugeiconsIcon
            icon={Exchange01Icon}
            size={13}
            strokeWidth={1.5}
          />
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Recovered
            </div>
            <div className="mt-1 font-mono text-[22px] tracking-tight text-ink">
              $4,200
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-[5px] bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700">
              +24%
            </div>
          </div>
          <MiniBars values={thisMonth} tone="emerald" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Last month
            </div>
            <div className="mt-1 font-mono text-[22px] tracking-tight text-neutral-500">
              $3,400
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-[5px] bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] text-rose-700">
              −16%
            </div>
          </div>
          <MiniBars values={lastMonth} tone="neutral" />
        </div>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-amber-400 px-3 py-2.5 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.3)] transition-colors duration-150 hover:bg-amber-500"
      >
        See details
      </button>
    </div>
  );
}
