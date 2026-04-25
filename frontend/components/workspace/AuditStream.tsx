"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  Alert02Icon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "scan" | "extract" | "match" | "violation" | "draft";

type LogEntry = {
  ts: string;
  phase: Phase;
  text: string;
  citation?: string;
  amount?: string;
};

const LOG: LogEntry[] = [
  { ts: "09:14:01", phase: "scan", text: "Detected document — Memorial Health Medical Center" },
  { ts: "09:14:02", phase: "extract", text: "Patient identified: J. Ramirez" },
  { ts: "09:14:03", phase: "extract", text: "Date of service: 03/14/2026 · Account BA-2026-1298" },
  { ts: "09:14:04", phase: "extract", text: "Total balance: $8,290.00 · 9 line items" },
  {
    ts: "09:14:05",
    phase: "match",
    text: "Cross-referencing facility-fee surcharges against the No Surprises Act",
    citation: "NSA § 2799A-1",
  },
  {
    ts: "09:14:06",
    phase: "violation",
    text: "Out-of-network facility fee — billed without prior good-faith estimate",
    citation: "NSA § 2799A-1",
    amount: "$8,450.00",
  },
  {
    ts: "09:14:07",
    phase: "match",
    text: "Verifying CPT modifier integrity",
    citation: "MOD 59",
  },
  {
    ts: "09:14:08",
    phase: "match",
    text: "Itemized statement validated",
    citation: "HIPAA § 164.524",
  },
  {
    ts: "09:14:09",
    phase: "draft",
    text: "Demand letter compiled — 4 citations · 2 pages · ready",
  },
];

const TYPE_SPEED = 14;
const LINE_DELAY = 280;
const DRAFT_DELAY = 1100;

function useAuditCycle() {
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [drafting, setDrafting] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (drafting) return;
    if (lineIdx >= LOG.length) {
      const t = setTimeout(() => setDrafting(true), DRAFT_DELAY);
      return () => clearTimeout(t);
    }
    const txt = LOG[lineIdx].text;
    if (chars < txt.length) {
      const t = setTimeout(() => setChars((c) => c + 1), TYPE_SPEED);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setChars(0);
    }, LINE_DELAY);
    return () => clearTimeout(t);
  }, [lineIdx, chars, drafting, tick]);

  function reset() {
    setLineIdx(0);
    setChars(0);
    setDrafting(false);
    setTick((t) => t + 1);
  }

  return {
    completed: LOG.slice(0, lineIdx),
    typing:
      lineIdx < LOG.length
        ? { ...LOG[lineIdx], text: LOG[lineIdx].text.slice(0, chars) }
        : null,
    drafting,
    reset,
  };
}

const phaseStyles: Record<
  Phase,
  { tag: string; tagText: string; rail: string }
> = {
  scan: {
    tag: "border-neutral-100 bg-neutral-50 text-neutral-500",
    tagText: "Scan",
    rail: "bg-neutral-300",
  },
  extract: {
    tag: "border-neutral-100 bg-neutral-50 text-neutral-500",
    tagText: "Extract",
    rail: "bg-neutral-300",
  },
  match: {
    tag: "border-emerald-200 bg-emerald-50 text-emerald-700",
    tagText: "Match",
    rail: "bg-emerald-400",
  },
  violation: {
    tag: "border-rose-200 bg-rose-50 text-rose-700",
    tagText: "Violation",
    rail: "bg-rose-400",
  },
  draft: {
    tag: "border-neutral-300 bg-ink text-white",
    tagText: "Draft",
    rail: "bg-ink",
  },
};

function LogRow({ entry, typing }: { entry: LogEntry; typing?: boolean }) {
  const s = phaseStyles[entry.phase];
  return (
    <div className="relative flex items-start gap-4 border-b border-neutral-100 px-6 py-3.5">
      <span aria-hidden className={`absolute left-0 top-3.5 bottom-3.5 w-[2px] ${s.rail}`} />
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 whitespace-nowrap pt-0.5">
        {entry.ts}
      </span>
      <span
        className={`inline-flex shrink-0 items-center gap-1 rounded-[3px] border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${s.tag}`}
      >
        {entry.phase === "match" && <HugeiconsIcon icon={Tick02Icon} size={9} strokeWidth={2.5} />}
        {entry.phase === "violation" && <HugeiconsIcon icon={Alert02Icon} size={9} strokeWidth={2} />}
        {s.tagText}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] leading-[1.55] text-ink">
          {entry.text}
          {typing && (
            <span className="ml-0.5 inline-block h-[12px] w-[6px] translate-y-[1px] bg-ink animate-pulse" />
          )}
        </div>
        {(entry.citation || entry.amount) && !typing && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {entry.citation && (
              <span
                className={`inline-flex items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] ${
                  entry.phase === "violation"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {entry.citation}
              </span>
            )}
            {entry.amount && (
              <span className="font-mono text-[11px] tracking-tight text-ink">
                {entry.amount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DraftLetter({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex h-full flex-col items-center justify-center px-8 py-8"
    >
      <div className="w-full max-w-[520px] border border-neutral-100 bg-white p-9">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <div className="font-display text-[22px] tracking-tight text-ink">
              Recourse
            </div>
            <div className="font-display text-[10px] italic text-neutral-500">
              You have recourse.
            </div>
          </div>
          <div className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            REF · RCS-48211
            <br />
            04/25/2026
          </div>
        </div>

        <div className="mt-6 space-y-1 font-mono text-[10px] text-neutral-500">
          <div>To: Memorial Health Medical Center</div>
          <div>Billing Department, 742 Evergreen Terrace</div>
          <div>Springfield, IL 62704</div>
        </div>

        <div className="mt-5 border-y border-neutral-100 py-4 font-display text-[14px] leading-[1.5] text-ink">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Re:
          </span>{" "}
          Account #BA-2026-1298 · DOS 03/14/2026 · Amount in dispute{" "}
          <span className="font-mono">$8,450.00</span>
        </div>

        <p className="mt-5 font-display text-[12.5px] leading-[1.7] text-ink">
          Pursuant to{" "}
          <span className="font-mono text-[12px] font-semibold">
            42 U.S.C. § 300gg-131 (No Surprises Act § 2799A-1)
          </span>
          , the facility fee of <span className="font-mono">$8,450.00</span>{" "}
          billed on 03/14/2026 violates the prohibition on out-of-network
          balance billing in the absence of a good-faith estimate. Under{" "}
          <span className="font-mono text-[12px] font-semibold">
            HIPAA § 164.524
          </span>
          , the patient has further requested an itemized accounting.
        </p>

        <p className="mt-4 font-display text-[12.5px] leading-[1.7] text-ink">
          Per the cited statutes, this charge must be removed and the patient
          balance restated within thirty (30) days of receipt of this letter.
        </p>

        <div className="mt-7 border-t border-neutral-100 pt-5">
          <div className="font-display text-[12.5px] italic text-ink">
            J. Ramirez
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Patient · drafted via Recourse
          </div>
        </div>

        <footer className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
          <span>2 pages · 4 citations · drafted in 90s</span>
          <span>Page 1 of 2</span>
        </footer>
      </div>

      <button
        type="button"
        onClick={onReplay}
        className="mt-6 inline-flex items-center gap-1.5 rounded-[3px] border border-neutral-100 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
      >
        <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.75} />
        Replay audit
      </button>
    </motion.div>
  );
}

export function AuditStream() {
  const { completed, typing, drafting, reset } = useAuditCycle();

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[20px] tracking-tight text-ink">
            Recourse Audit
          </h2>
          <span className="h-4 w-px bg-neutral-300" />
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {drafting ? "Draft Ready" : "Live Streaming"}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          <span>
            {completed.length} / {LOG.length} stages
          </span>
          <span className="hidden h-4 w-px bg-neutral-300 sm:block" />
          <span className="hidden sm:inline">RCS-48211</span>
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {drafting ? (
            <motion.div
              key="draft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="h-full"
            >
              <DraftLetter onReplay={reset} />
            </motion.div>
          ) : (
            <motion.div
              key="stream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="border-t border-neutral-100"
            >
              {completed.map((entry) => (
                <LogRow key={entry.ts} entry={entry} />
              ))}
              {typing && <LogRow entry={typing} typing />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
        <span>Statute Library v1.4 · Verified</span>
        <span className="inline-flex items-center gap-1.5">
          {drafting ? "Letter ready" : "Streaming…"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={1.5} />
        </span>
      </footer>
    </div>
  );
}
