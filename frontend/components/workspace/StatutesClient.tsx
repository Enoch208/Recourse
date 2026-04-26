"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/workspace/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

export type StatuteCategory = "NSA" | "FDCPA" | "ERISA" | "HIPAA" | "Reg E";

export type StatuteEntry = {
  code: string;
  title: string;
  category: StatuteCategory;
  trigger: string;
  remedy: string;
  hits: number;
};

const categories = ["All", "NSA", "FDCPA", "ERISA", "HIPAA", "Reg E"] as const;

const categoryTone: Record<StatuteCategory, string> = {
  NSA: "text-emerald-700 bg-emerald-50",
  FDCPA: "text-rose-700 bg-rose-50",
  ERISA: "text-amber-700 bg-amber-50",
  HIPAA: "text-sky-700 bg-sky-50",
  "Reg E": "text-neutral-700 bg-neutral-100",
};

export function StatutesClient({
  statutes,
  showHits,
}: {
  statutes: StatuteEntry[];
  showHits: boolean;
}) {
  return (
    <>
      <PageHeader
        title="Statutes"
        subtitle="Verified statute library — every match is deterministic, never paraphrased."
        actions={
          <span className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-emerald-100 bg-emerald-50 px-3 text-[12px] font-medium tracking-tight text-emerald-700">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              size={13}
              strokeWidth={1.75}
            />
            <span className="font-mono text-[11px]">v1.4 · Verified</span>
          </span>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-7"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`h-8 rounded-[8px] px-3 text-[12px] tracking-tight transition-colors ${
                  i === 0
                    ? "bg-ink text-white"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <HugeiconsIcon
              icon={Search01Icon}
              size={13}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              placeholder="Search citations or triggers"
              className="h-9 w-full rounded-[10px] border border-neutral-200 bg-white pl-8 pr-3 text-[12.5px] tracking-tight text-ink placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none sm:w-[280px]"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {statutes.map((statute) => (
            <article
              key={statute.code}
              className="rounded-[16px] border border-neutral-200/70 bg-white p-5 transition-colors hover:border-neutral-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-[12px] tracking-tight text-ink">
                    {statute.code}
                  </div>
                  <h3 className="mt-1 text-[14px] font-semibold tracking-tight text-ink">
                    {statute.title}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] ${categoryTone[statute.category]}`}
                >
                  {statute.category}
                </span>
              </div>

              <dl className="mt-4 space-y-2.5 text-[12.5px] leading-snug">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    Trigger
                  </dt>
                  <dd className="mt-0.5 text-neutral-600">{statute.trigger}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    Remedy
                  </dt>
                  <dd className="mt-0.5 text-neutral-600">{statute.remedy}</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  {showHits
                    ? statute.hits === 0
                      ? "Not yet flagged in your bills"
                      : `${statute.hits} match${statute.hits === 1 ? "" : "es"} in your bills`
                    : "Available in v1.4 library"}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-600">
                  Active
                </span>
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </>
  );
}
