"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BalanceScaleIcon,
  FileVerifiedIcon,
  Invoice01Icon,
  SignatureIcon,
  Stamp02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type LineVariant = "violation" | "match";

type AuditLine = {
  icon: IconSvgElement;
  title: string;
  detail: string;
  statute: string;
  meta: string;
  variant: LineVariant;
};

const auditLines: AuditLine[] = [
  {
    icon: BalanceScaleIcon,
    title: "Out-of-network facility fee",
    detail: "Balance-bill exposure identified",
    statute: "NSA § 2799A-1",
    meta: "$8,450",
    variant: "violation",
  },
  {
    icon: Invoice01Icon,
    title: "Duplicate CPT 99213 charge",
    detail: "Same provider, same service date",
    statute: "CPT 99213",
    meta: "× 2",
    variant: "violation",
  },
  {
    icon: FileVerifiedIcon,
    title: "Validation window active",
    detail: "Collector response clock is open",
    statute: "FDCPA § 1692g",
    meta: "29 days",
    variant: "match",
  },
  {
    icon: Stamp02Icon,
    title: "Itemized statement verified",
    detail: "Records request evidence attached",
    statute: "HIPAA § 164.524",
    meta: "READY",
    variant: "match",
  },
];

const STREAM_INTERVAL = 900;
const DRAFT_DELAY = 900;
const HOLD_DURATION = 3200;

const variantStyles: Record<
  LineVariant,
  { chip: string; dot: string; iconTint: string; iconBox: string; row: string }
> = {
  violation: {
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
    dot: "bg-rose-500",
    iconTint: "text-rose-600",
    iconBox: "border-rose-100 bg-rose-50/80",
    row: "border-rose-100/80 bg-[linear-gradient(180deg,#fff,#fff7f8)]",
  },
  match: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
    iconTint: "text-emerald-600",
    iconBox: "border-emerald-100 bg-emerald-50/80",
    row: "border-emerald-100/80 bg-[linear-gradient(180deg,#fff,#f7fffb)]",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;
const documentLines = [94, 72, 88, 63, 78, 52];

function useAuditCycle() {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const reset = setTimeout(() => {
        setVisible(0);
        setDone(false);
      }, HOLD_DURATION);
      return () => clearTimeout(reset);
    }
    if (visible < auditLines.length) {
      const next = setTimeout(
        () => setVisible((v) => v + 1),
        STREAM_INTERVAL,
      );
      return () => clearTimeout(next);
    }
    const draft = setTimeout(() => setDone(true), DRAFT_DELAY);
    return () => clearTimeout(draft);
  }, [visible, done]);

  const progress = Math.min(
    100,
    done ? 100 : (visible / auditLines.length) * 85,
  );

  return { visible, done, progress };
}

export function LiveAuditWorkspace() {
  const { visible, done, progress } = useAuditCycle();
  const matched = Math.min(visible, auditLines.length);

  return (
    <div className="relative w-full max-w-[690px] min-w-0">
      <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-white shadow-[0_18px_48px_rgb(15_23_42/0.08),0_2px_6px_rgb(15_23_42/0.04)]">
        <div className="flex h-11 items-center justify-between border-b border-border bg-background px-3.5 sm:px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_-1px_1px_rgb(0_0_0/0.16)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_-1px_1px_rgb(0_0_0/0.16)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[inset_0_-1px_1px_rgb(0_0_0/0.16)]" />
          </div>
          <div className="hidden rounded-md border border-border bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
            Audit Workspace / Memorial Health #48211
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            Live
          </span>
        </div>

        <div className="grid min-h-[372px] grid-cols-1 sm:grid-cols-[0.76fr_1.24fr]">
          <aside className="border-b border-border bg-background p-3.5 sm:border-b-0 sm:border-r sm:p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Document
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                OCR 98.4
              </span>
            </div>

            <div className="mt-3 rounded-lg border border-border bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-semibold text-ink">
                    Memorial Health
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Invoice #48211
                  </div>
                </div>
                <span className="rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  PDF
                </span>
              </div>

              <div className="relative mt-3 overflow-hidden rounded-md border border-border bg-background p-2.5">
                {!done && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-x-0 h-8 bg-[linear-gradient(180deg,transparent,rgba(16,185,129,0.10),transparent)]"
                    initial={{ y: -34 }}
                    animate={{ y: 112 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <div className="relative space-y-1.5">
                  {documentLines.map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full bg-border-strong"
                      style={{ width: `${w}%`, opacity: 0.96 - i * 0.08 }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-background p-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                    Balance
                  </div>
                  <div className="mt-1 font-mono text-[12px] text-ink tabular-nums">
                    $12,480
                  </div>
                </div>
                <div className="rounded-md border border-border bg-background p-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                    Service
                  </div>
                  <div className="mt-1 font-mono text-[12px] text-ink tabular-nums">
                    03/14/2026
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-md bg-white p-2.5 ring-1 ring-inset ring-border">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span>Rules matched</span>
                  <span>
                    {matched}/{auditLines.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-ink"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 bg-white p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Audit Trail
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                Streaming
              </span>
            </div>

            <ul className="mt-3 min-h-[252px] space-y-2">
              <AnimatePresence mode="popLayout">
                {auditLines.slice(0, visible).map((line) => {
                  const v = variantStyles[line.variant];
                  return (
                    <motion.li
                      key={line.statute}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className={`relative min-h-[58px] overflow-hidden rounded-md border px-3 py-2.5 ${v.row}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute bottom-2 left-0 top-2 w-[2px] rounded-r-full ${v.dot}`}
                      />
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${v.iconBox}`}
                        >
                          <HugeiconsIcon
                            icon={line.icon}
                            size={13}
                            strokeWidth={1.6}
                            className={v.iconTint}
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <span className="truncate text-[11px] font-semibold tracking-[-0.01em] text-ink">
                              {line.title}
                            </span>
                            <span className="shrink-0 font-mono text-[9px] text-neutral-500 tabular-nums">
                              {line.meta}
                            </span>
                          </div>
                          <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2">
                            <span className="truncate text-[10px] leading-none text-muted">
                              {line.detail}
                            </span>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.13em] ring-1 ring-inset ${v.chip}`}
                            >
                              <span
                                className={`h-1 w-1 rounded-full ${v.dot}`}
                              />
                              {line.statute}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <AnimatePresence>
              {done && (
                <motion.div
                  key="draft"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-3 flex min-h-[58px] items-center rounded-md bg-ink px-3.5 py-3 text-white"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-inset ring-white/10">
                      <HugeiconsIcon
                        icon={SignatureIcon}
                        size={13}
                        strokeWidth={1.75}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <span className="truncate text-[11px] font-semibold">
                          Demand letter drafted
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                          Ready
                        </span>
                      </div>
                      <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
                        2 pages · packet compiled
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
