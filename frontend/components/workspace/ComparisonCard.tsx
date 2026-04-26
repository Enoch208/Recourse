"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Exchange01Icon } from "@hugeicons/core-free-icons";

const MOCK_THIS = [44, 78, 56, 92, 64];
const MOCK_LAST = [38, 52, 71, 48, 60];

type Props = {
  thisMonth?: number;
  lastMonth?: number;
  thisBars?: number[];
  lastBars?: number[];
  delta?: number;
  empty?: boolean;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function MiniBars({
  values,
  tone,
  muted,
}: {
  values: number[];
  tone: "emerald" | "neutral";
  muted?: boolean;
}) {
  const max = Math.max(...values, 1);
  const fill = muted
    ? "bg-neutral-100"
    : tone === "emerald"
      ? "bg-emerald-400"
      : "bg-neutral-300";
  return (
    <div className="flex h-12 items-end gap-1">
      {values.map((v, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0.3, opacity: 0 }}
          animate={{
            scaleY: muted ? 0.15 : Math.max(v / max, 0.08),
            opacity: 1,
          }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "bottom" }}
          className={`w-2 rounded-t-[3px] ${fill}`}
        />
      ))}
    </div>
  );
}

export function ComparisonCard({
  thisMonth,
  lastMonth,
  thisBars,
  lastBars,
  delta,
  empty,
}: Props = {}) {
  const isMock = thisMonth === undefined && !empty;
  const t = thisMonth ?? 4200;
  const l = lastMonth ?? 3400;
  const d =
    delta ??
    (isMock
      ? 24
      : l === 0
        ? t > 0
          ? 100
          : 0
        : Math.round(((t - l) / l) * 100));
  const tBars = thisBars && thisBars.length ? thisBars : MOCK_THIS;
  const lBars = lastBars && lastBars.length ? lastBars : MOCK_LAST;

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
          <HugeiconsIcon icon={Exchange01Icon} size={13} strokeWidth={1.5} />
        </button>
      </header>

      {empty ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-neutral-200 bg-neutral-50/40 px-4 py-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Nothing yet
          </div>
          <div className="mt-2 max-w-[300px] text-[12.5px] leading-relaxed text-neutral-500">
            Run your first audit and your monthly recovery shows up here.
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                Recovered
              </div>
              <div className="mt-1 font-mono text-[22px] tracking-tight text-ink">
                {usd(t)}
              </div>
              <div
                className={`mt-1 inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 font-mono text-[10px] ${
                  d >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {d >= 0 ? "+" : ""}
                {d}%
              </div>
            </div>
            <MiniBars values={tBars} tone="emerald" />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                Last month
              </div>
              <div className="mt-1 font-mono text-[22px] tracking-tight text-neutral-500">
                {usd(l)}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-[5px] bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500">
                Prior
              </div>
            </div>
            <MiniBars values={lBars} tone="neutral" />
          </div>
        </div>
      )}

      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-amber-400 px-3 py-2.5 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.3)] transition-colors duration-150 hover:bg-amber-500"
      >
        See details
      </button>
    </div>
  );
}
