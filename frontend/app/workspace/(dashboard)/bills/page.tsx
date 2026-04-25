"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UploadIcon,
  Search01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/workspace/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

type BillStatus = "active" | "drafting" | "resolved";

type Bill = {
  id: string;
  provider: string;
  facility: string;
  dos: string;
  amount: string;
  flags: string[];
  status: BillStatus;
  href: string;
};

const bills: Bill[] = [
  {
    id: "RCS-48211",
    provider: "Memorial Health",
    facility: "Memorial Health Medical Center",
    dos: "03/14/2026",
    amount: "$8,450.00",
    flags: ["NSA § 2799A-1", "FDCPA § 1692g"],
    status: "active",
    href: "/workspace/audit",
  },
  {
    id: "RCS-48184",
    provider: "Northwell Imaging",
    facility: "Northwell Diagnostic Imaging",
    dos: "02/27/2026",
    amount: "$2,140.00",
    flags: ["NSA § 2799A-1"],
    status: "drafting",
    href: "/workspace/audit",
  },
  {
    id: "RCS-48102",
    provider: "Sunrise ER",
    facility: "Sunrise Emergency Group",
    dos: "02/19/2026",
    amount: "$1,210.00",
    flags: ["FDCPA § 1692g"],
    status: "active",
    href: "/workspace/audit",
  },
  {
    id: "RCS-47988",
    provider: "Cedar Lab Co.",
    facility: "Cedar Reference Labs",
    dos: "02/04/2026",
    amount: "$640.50",
    flags: ["HIPAA § 164.524"],
    status: "drafting",
    href: "/workspace/audit",
  },
  {
    id: "RCS-47812",
    provider: "Riverside Anesthesia",
    facility: "Riverside Anesthesia Partners",
    dos: "01/22/2026",
    amount: "$3,120.00",
    flags: ["NSA § 2799A-2", "ERISA § 503"],
    status: "resolved",
    href: "/workspace/audit",
  },
  {
    id: "RCS-47644",
    provider: "Chestnut Hills",
    facility: "Chestnut Hills Surgical",
    dos: "01/08/2026",
    amount: "$5,980.00",
    flags: ["NSA § 2799A-1"],
    status: "resolved",
    href: "/workspace/audit",
  },
];

const statusStyles: Record<BillStatus, string> = {
  active: "bg-sky-50 text-sky-700",
  drafting: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
};

const statusLabel: Record<BillStatus, string> = {
  active: "Active",
  drafting: "Drafting",
  resolved: "Resolved",
};

const filters = ["All", "Active", "Drafting", "Resolved"] as const;

export default function BillsPage() {
  return (
    <>
      <PageHeader
        title="Bills"
        subtitle="Every bill you've ingested, with statute matches and dispute status."
        actions={
          <Link
            href="/workspace/audit"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500"
          >
            <HugeiconsIcon icon={UploadIcon} size={13} strokeWidth={1.75} />
            Ingest a bill
          </Link>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-7"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {filters.map((label, i) => (
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
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={13}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              placeholder="Search by provider or audit ID"
              className="h-9 w-[280px] rounded-[10px] border border-neutral-200 bg-white pl-8 pr-3 text-[12.5px] tracking-tight text-ink placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[16px] border border-neutral-200/70 bg-white">
          <div className="grid grid-cols-[1.4fr_0.9fr_0.7fr_1.3fr_0.7fr_auto] gap-4 border-b border-neutral-100 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            <span>Provider</span>
            <span>Date of service</span>
            <span>Amount</span>
            <span>Statutes flagged</span>
            <span>Status</span>
            <span className="w-[60px]" />
          </div>
          {bills.map((bill) => (
            <Link
              key={bill.id}
              href={bill.href}
              className="grid grid-cols-[1.4fr_0.9fr_0.7fr_1.3fr_0.7fr_auto] items-center gap-4 border-b border-neutral-100 px-5 py-3.5 text-[13px] transition-colors last:border-b-0 hover:bg-neutral-50/60"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-emerald-50 font-mono text-[10px] font-semibold tracking-tight text-emerald-700">
                  {bill.provider
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium tracking-tight text-ink">
                    {bill.facility}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    {bill.id}
                  </div>
                </div>
              </div>
              <div className="font-mono text-[12px] tracking-tight text-neutral-600">
                {bill.dos}
              </div>
              <div className="font-mono text-[13px] tracking-tight text-ink">
                {bill.amount}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {bill.flags.map((flag) => (
                  <span
                    key={flag}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] tracking-tight text-neutral-600"
                  >
                    {flag}
                  </span>
                ))}
              </div>
              <div>
                <span
                  className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium tracking-tight ${statusStyles[bill.status]}`}
                >
                  {statusLabel[bill.status]}
                </span>
              </div>
              <div className="flex justify-end">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-neutral-400 transition-colors group-hover:text-ink">
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

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          <span>Showing 6 of {bills.length} bills</span>
          <span>Library v1.4 · Verified</span>
        </div>
      </motion.div>
    </>
  );
}
