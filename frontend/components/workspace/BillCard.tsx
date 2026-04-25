"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

type Status = "violation" | "resolved" | "pending";

type Props = {
  provider: string;
  amount: string;
  account: string;
  dos: string;
  status: Status;
  topStatute: string;
  statuteCount: number;
  lastUpdated: string;
  href?: string;
};

const statusStyles: Record<
  Status,
  { tag: string; label: string; rail: string }
> = {
  violation: {
    tag: "bg-rose-50 text-rose-700 ring-rose-100",
    label: "Flag",
    rail: "bg-rose-400",
  },
  resolved: {
    tag: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    label: "Resolved",
    rail: "bg-emerald-400",
  },
  pending: {
    tag: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    label: "Pending",
    rail: "bg-neutral-300",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function BillCard({
  provider,
  amount,
  account,
  dos,
  status,
  topStatute,
  statuteCount,
  lastUpdated,
  href = "/workspace/audit",
}: Props) {
  const s = statusStyles[status];
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2, ease: EASE } }}
    >
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-md border border-neutral-200 bg-white p-5 transition-colors duration-150 hover:border-neutral-400"
    >
      <span
        aria-hidden
        className={`absolute left-0 top-5 bottom-5 w-[2px] ${s.rail}`}
      />

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] border border-neutral-200 bg-neutral-50 text-ink">
            <HugeiconsIcon icon={File02Icon} size={12} strokeWidth={1.5} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            {account}
          </span>
        </div>
        <span
          className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ring-1 ring-inset ${s.tag}`}
        >
          {s.label}
        </span>
      </header>

      <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-ink">
        {provider}
      </h3>
      <div className="mt-1 font-mono text-[22px] leading-none tracking-tight text-ink">
        {amount}
      </div>

      <div className="mt-4 truncate font-mono text-[10px] text-neutral-500">
        <span className="text-ink">{topStatute}</span>
        <span className="mx-1.5 text-neutral-300">·</span>
        <span>+{statuteCount - 1} more</span>
      </div>

      <footer className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
          <span>DOS {dos}</span>
          <span className="text-neutral-300">·</span>
          <span>{lastUpdated}</span>
        </div>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={12}
          strokeWidth={1.5}
          className="text-neutral-300 transition-colors duration-150 group-hover:text-ink"
        />
      </footer>
    </Link>
    </motion.div>
  );
}
