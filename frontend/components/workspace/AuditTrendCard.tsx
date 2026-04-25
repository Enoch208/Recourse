"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, Calendar02Icon } from "@hugeicons/core-free-icons";

const points = [
  { x: 24, y: 76, label: "Sun" },
  { x: 88, y: 64, label: "Mon" },
  { x: 152, y: 50, label: "Tue" },
  { x: 216, y: 32, label: "Wed", highlight: true, value: "$521.23" },
  { x: 280, y: 46, label: "Thu" },
  { x: 344, y: 56, label: "Fri" },
  { x: 408, y: 40, label: "Sat" },
];

const path =
  "M 24 76 C 56 76, 60 66, 88 64 S 124 54, 152 50 S 196 36, 216 32 S 264 46, 280 46 S 326 58, 344 56 S 388 38, 408 40";

export function AuditTrendCard() {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6">
      <header className="flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-ink">
            Recent audits
          </div>
          <div className="mt-0.5 text-[12px] text-neutral-500">
            Refunds recovered, last 7 days
          </div>
        </div>
        <Link
          href="/workspace/bills"
          className="text-[12px] font-medium text-amber-600 hover:text-amber-700"
        >
          View all bills
        </Link>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_1.6fr]">
        <article className="relative overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#dff5e7,#cfe9f3_60%,#f8e2c8)] p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/85 text-emerald-700 backdrop-blur">
              <HugeiconsIcon
                icon={Invoice01Icon}
                size={13}
                strokeWidth={1.5}
              />
            </span>
            <span className="rounded-[5px] bg-white/85 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-700 backdrop-blur">
              Active
            </span>
          </div>

          <div className="mt-12 rounded-[10px] border border-white/60 bg-white p-3 shadow-[0_2px_8px_rgb(15_23_42/0.05)]">
            <div className="text-[12.5px] font-semibold tracking-tight text-ink">
              Memorial Health
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              <HugeiconsIcon
                icon={Calendar02Icon}
                size={10}
                strokeWidth={1.5}
              />
              <span>Filed 03 Apr 2026</span>
              <Link
                href="/workspace/audit"
                className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600 hover:text-amber-700"
              >
                Details
              </Link>
            </div>
          </div>
        </article>

        <div className="relative rounded-[14px] border border-neutral-100 bg-white p-5">
          <svg
            viewBox="0 0 432 110"
            className="h-[110px] w-full overflow-visible"
            aria-hidden
          >
            <defs>
              <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${path} L 408 110 L 24 110 Z`}
              fill="url(#trendFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {points.map((p) => (
              <g key={p.label}>
                {p.highlight && (
                  <>
                    <circle cx={p.x} cy={p.y} r={9} fill="white" stroke="rgb(16 185 129)" strokeWidth={2} />
                    <circle cx={p.x} cy={p.y} r={3.5} fill="rgb(16 185 129)" />
                    <g transform={`translate(${p.x - 38}, ${p.y - 38})`}>
                      <rect width={76} height={22} rx={6} fill="white" stroke="rgb(229 231 235)" />
                      <text
                        x={38}
                        y={15}
                        textAnchor="middle"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        fontSize="11"
                        fill="rgb(17 24 39)"
                      >
                        {p.value}
                      </text>
                    </g>
                  </>
                )}
              </g>
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-7 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            {points.map((p) => (
              <span key={p.label} className="text-center">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start justify-between rounded-[12px] border border-neutral-100 bg-white p-4">
          <div>
            <div className="text-[13px] font-semibold tracking-tight text-ink">
              Most flagged
            </div>
            <div className="mt-3 space-y-1.5 text-[11.5px]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-ink">NSA § 2799A-1</span>
                <span className="ml-auto font-mono text-[10px] text-neutral-500">34%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span className="text-ink">FDCPA § 1692g</span>
                <span className="ml-auto font-mono text-[10px] text-neutral-500">28%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[12px] border border-neutral-100 bg-white p-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-700">
            <HugeiconsIcon
              icon={Invoice01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-semibold tracking-tight text-ink">
              Memorial Health
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
              <span>This month</span>
              <span className="font-mono text-ink">$8,450</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
              <span>Last month</span>
              <span className="font-mono">$1,210</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
