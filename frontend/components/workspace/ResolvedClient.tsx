"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  ArrowRight01Icon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/workspace/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

export type Outcome = "refunded" | "voided" | "reduced";

export type ResolutionRow = {
  id: string;
  auditId: string;
  facility: string;
  closedOn: string;
  recovered: string;
  cited: string;
  outcome: Outcome;
  daysToClose: number;
};

const outcomeStyles: Record<Outcome, string> = {
  refunded: "bg-emerald-50 text-emerald-700",
  voided: "bg-sky-50 text-sky-700",
  reduced: "bg-amber-50 text-amber-700",
};

const outcomeLabel: Record<Outcome, string> = {
  refunded: "Refunded",
  voided: "Voided",
  reduced: "Reduced",
};

export function ResolvedClient({
  resolutions,
  totalRecovered,
  empty,
}: {
  resolutions: ResolutionRow[];
  totalRecovered: number;
  empty?: boolean;
}) {
  return (
    <>
      <PageHeader
        title="Resolved"
        subtitle="Closed disputes and recovered amounts. Every letter is archived with the original bill."
        actions={
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400"
          >
            <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={1.5} />
            Export CSV
          </button>
        }
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="mt-7 space-y-5"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, ease: EASE }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-emerald-100 text-emerald-700">
                <HugeiconsIcon
                  icon={TickDouble02Icon}
                  size={13}
                  strokeWidth={1.75}
                />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700">
                Total recovered
              </span>
            </div>
            <div className="mt-3 font-mono text-[28px] tracking-tight text-ink">
              $
              {totalRecovered.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 text-[12px] text-neutral-500">
              Across {resolutions.length} closed dispute
              {resolutions.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="rounded-[16px] border border-neutral-200/70 bg-white p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Win rate
            </span>
            <div className="mt-3 font-mono text-[28px] tracking-tight text-ink">
              {resolutions.length === 0 ? "—" : "92"}
              <span className="text-neutral-400">%</span>
            </div>
            <div className="mt-1 text-[12px] text-neutral-500">
              Last 90 days · disputes closed in your favor
            </div>
          </div>

          <div className="rounded-[16px] border border-neutral-200/70 bg-white p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Avg. days to close
            </span>
            <div className="mt-3 font-mono text-[28px] tracking-tight text-ink">
              {resolutions.length === 0 ? "—" : "10.8"}
            </div>
            <div className="mt-1 text-[12px] text-neutral-500">
              From letter sent to provider response
            </div>
          </div>
        </motion.div>

        {empty ? (
          <div className="rounded-[16px] border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Nothing resolved yet
            </div>
            <h3 className="mt-2 font-display text-[18px] tracking-tight text-ink">
              Closed disputes will land here
            </h3>
            <p className="mx-auto mt-2 max-w-[400px] text-[12.5px] leading-relaxed text-neutral-500">
              Once a provider responds and the dispute closes, the audit moves
              to Resolved with the recovered amount.
            </p>
          </div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden rounded-[16px] border border-neutral-200/70 bg-white"
          >
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.5fr_0.9fr_0.8fr_1fr_0.8fr_auto] gap-4 border-b border-neutral-100 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  <span>Facility</span>
                  <span>Closed</span>
                  <span>Recovered</span>
                  <span>Statute cited</span>
                  <span>Outcome</span>
                  <span className="w-[60px]" />
                </div>
                {resolutions.map((r) => (
                  <Link
                    key={r.id}
                    href="/workspace/audit"
                    className="grid grid-cols-[1.5fr_0.9fr_0.8fr_1fr_0.8fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-3.5 text-[13px] transition-colors last:border-b-0 hover:bg-neutral-50/60"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium tracking-tight text-ink">
                        {r.facility}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                        {r.auditId} · {r.daysToClose}d
                      </div>
                    </div>
                    <div className="font-mono text-[12px] tracking-tight text-neutral-600">
                      {r.closedOn}
                    </div>
                    <div className="font-mono text-[13px] tracking-tight text-emerald-700">
                      {r.recovered}
                    </div>
                    <div className="font-mono text-[11px] tracking-tight text-neutral-600">
                      {r.cited}
                    </div>
                    <div>
                      <span
                        className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium tracking-tight ${outcomeStyles[r.outcome]}`}
                      >
                        {outcomeLabel[r.outcome]}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-neutral-400">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={14}
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
