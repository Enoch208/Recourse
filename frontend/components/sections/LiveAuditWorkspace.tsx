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
  statute: string;
  meta: string;
  variant: LineVariant;
};

const auditLines: AuditLine[] = [
  {
    icon: BalanceScaleIcon,
    title: "Out-of-network facility fee",
    statute: "NSA § 2799A-1",
    meta: "$8,450",
    variant: "violation",
  },
  {
    icon: Invoice01Icon,
    title: "Duplicate CPT 99213 charge",
    statute: "CPT 99213",
    meta: "× 2",
    variant: "violation",
  },
  {
    icon: FileVerifiedIcon,
    title: "Validation window active",
    statute: "FDCPA § 1692g",
    meta: "29 days",
    variant: "match",
  },
  {
    icon: Stamp02Icon,
    title: "Itemized statement verified",
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
  { chip: string; dot: string; iconTint: string }
> = {
  violation: {
    chip: "bg-rose-50 text-rose-700 ring-rose-100",
    dot: "bg-rose-500",
    iconTint: "text-rose-600",
  },
  match: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
    iconTint: "text-emerald-600",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

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

  return (
    <div className="relative w-full max-w-[640px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[22px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(15,23,42,0.10),transparent_70%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[14px] border border-[#dedbd3] bg-white shadow-[0_30px_80px_rgb(15_23_42/0.14),0_8px_20px_rgb(15_23_42/0.05)] ring-1 ring-black/[0.04]">
        <div className="flex items-center justify-between border-b border-border bg-[#fbfbf9] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="rounded-full border border-border bg-white px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">
            Audit Workspace / Memorial Health #48211
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            Live
          </span>
        </div>

        <div className="grid grid-cols-5">
          <aside className="col-span-2 border-r border-border bg-[#fbfbf9] p-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              Document
            </div>
            <div className="mt-3 rounded-[7px] border border-border bg-white p-3 shadow-[0_8px_20px_rgb(15_23_42/0.04)]">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-ink">
                  Memorial Health
                </div>
                <span className="font-mono text-[9px] text-neutral-500">
                  #48211
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {[92, 78, 64, 88, 55].map((w, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-sm bg-border"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[5px] border border-border bg-[#fbfbf9] p-2">
                  <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-400">
                    Balance
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-ink">
                    $12,480
                  </div>
                </div>
                <div className="rounded-[5px] border border-border bg-[#fbfbf9] p-2">
                  <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-400">
                    Service
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-ink">
                    03/14/2026
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-[5px] bg-white p-2 ring-1 ring-inset ring-border">
                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-400">
                  <span>Rules matched</span>
                  <span>
                    {visible}/{auditLines.length}
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

          <div className="col-span-3 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                Audit Trail
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-700">
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

            <ul className="mt-3 space-y-2 min-h-[180px]">
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
                      className="flex items-center justify-between rounded-[7px] border border-border bg-[#fbfbf9] px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <HugeiconsIcon
                          icon={line.icon}
                          size={13}
                          strokeWidth={1.5}
                          className={v.iconTint}
                        />
                        <span className="truncate text-[11px] text-ink">
                          {line.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] ring-1 ring-inset ${v.chip}`}
                        >
                          <span className={`h-1 w-1 rounded-full ${v.dot}`} />
                          {line.statute}
                        </span>
                        <span className="hidden font-mono text-[9px] text-neutral-500 sm:inline">
                          {line.meta}
                        </span>
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
                  className="mt-3 flex items-center justify-between rounded-[7px] bg-ink px-3 py-2.5 text-white shadow-[0_18px_38px_rgb(0_0_0/0.16)]"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon
                      icon={SignatureIcon}
                      size={13}
                      strokeWidth={1.75}
                    />
                    <span className="text-[11px] font-semibold">
                      Demand letter drafted
                    </span>
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/70">
                    2 pages · ready
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
