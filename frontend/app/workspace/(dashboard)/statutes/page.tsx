"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/workspace/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

type Statute = {
  code: string;
  title: string;
  category: "NSA" | "FDCPA" | "ERISA" | "HIPAA" | "Reg E";
  trigger: string;
  remedy: string;
  hits: number;
};

const statutes: Statute[] = [
  {
    code: "NSA § 2799A-1",
    title: "Surprise out-of-network facility billing",
    category: "NSA",
    trigger:
      "Out-of-network facility fee charged for emergency or in-network-facility care without consent.",
    remedy: "Bill must be re-priced to in-network rate; balance billing void.",
    hits: 14,
  },
  {
    code: "NSA § 2799A-2",
    title: "Out-of-network ancillary providers",
    category: "NSA",
    trigger:
      "Anesthesia, radiology, pathology billed out-of-network at an in-network facility.",
    remedy: "Patient liability capped at in-network cost share.",
    hits: 6,
  },
  {
    code: "FDCPA § 1692g",
    title: "Validation of debts",
    category: "FDCPA",
    trigger:
      "Collection notice without itemized validation within 30 days of first contact.",
    remedy: "Collection activity must cease until validation provided.",
    hits: 9,
  },
  {
    code: "FDCPA § 1692e",
    title: "False or misleading representations",
    category: "FDCPA",
    trigger:
      "Amount claimed exceeds itemized charges, or threats of credit reporting before validation.",
    remedy: "Statutory damages up to $1,000 per violation.",
    hits: 4,
  },
  {
    code: "ERISA § 503",
    title: "Adverse benefit determination notice",
    category: "ERISA",
    trigger:
      "Plan denied a claim without specific reasons, plan provisions, or appeal rights.",
    remedy: "Claim must be reprocessed; full appeal rights restored.",
    hits: 5,
  },
  {
    code: "HIPAA § 164.524",
    title: "Right to access itemized billing record",
    category: "HIPAA",
    trigger:
      "Provider refuses or delays itemized statement of charges beyond 30 days.",
    remedy: "OCR complaint eligible; statutory penalties to provider.",
    hits: 3,
  },
  {
    code: "Reg E § 1005.11",
    title: "Error resolution for electronic transfers",
    category: "Reg E",
    trigger:
      "Unauthorized HSA/FSA debit or duplicate facility charge through patient portal.",
    remedy: "Provisional credit within 10 business days; full investigation.",
    hits: 2,
  },
  {
    code: "NSA § 2799B-3",
    title: "Good Faith Estimate variance",
    category: "NSA",
    trigger:
      "Final bill exceeds Good Faith Estimate by more than $400 for self-pay patient.",
    remedy: "Patient may dispute via Patient-Provider Dispute Resolution.",
    hits: 4,
  },
];

const categories = ["All", "NSA", "FDCPA", "ERISA", "HIPAA", "Reg E"] as const;

const categoryTone: Record<Statute["category"], string> = {
  NSA: "text-emerald-700 bg-emerald-50",
  FDCPA: "text-rose-700 bg-rose-50",
  ERISA: "text-amber-700 bg-amber-50",
  HIPAA: "text-sky-700 bg-sky-50",
  "Reg E": "text-neutral-700 bg-neutral-100",
};

export default function StatutesPage() {
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
                  {statute.hits} matches in your bills
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
