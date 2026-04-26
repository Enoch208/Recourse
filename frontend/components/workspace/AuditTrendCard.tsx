"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Invoice01Icon,
  Calendar02Icon,
  UploadIcon,
} from "@hugeicons/core-free-icons";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  recentAudit?: {
    provider: string;
    filedISO: string;
    auditId: string;
    status: "active" | "drafting" | "resolved";
  } | null;
  weeklyValues?: number[]; // 7 daily totals
  mostFlagged?: { code: string; percent: number }[];
  topFacility?: { name: string; thisMonth: number; lastMonth: number } | null;
  empty?: boolean;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function formatFiled(iso: string) {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

const statusToLabel = {
  active: "Active",
  drafting: "Drafting",
  resolved: "Resolved",
} as const;

function buildPath(values: number[]): { path: string; points: { x: number; y: number; v: number }[] } {
  if (values.length === 0) return { path: "", points: [] };
  const max = Math.max(...values, 1);
  const min = 0;
  const range = max - min || 1;
  const W = 384;
  const H = 76;
  const PAD_X = 24;
  const PAD_Y = 16;
  const innerW = W;
  const step = innerW / (values.length - 1 || 1);
  const points = values.map((v, i) => ({
    x: PAD_X + i * step,
    y: PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2) + PAD_Y,
    v,
  }));
  // Smooth cubic-ish path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const c = (p0.x + p1.x) / 2;
    path += ` C ${c} ${p0.y}, ${c} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return { path, points };
}

const MOCK_VALUES = [120, 220, 340, 521, 410, 380, 510];
const TONES = ["bg-emerald-500", "bg-sky-500", "bg-amber-500", "bg-violet-500"];

export function AuditTrendCard({
  recentAudit,
  weeklyValues,
  mostFlagged,
  topFacility,
  empty,
}: Props = {}) {
  const isMock = recentAudit === undefined && !empty;
  const values =
    weeklyValues && weeklyValues.length === 7 ? weeklyValues : MOCK_VALUES;
  const { path, points } = buildPath(values);
  const peakIdx = points.reduce(
    (best, p, i) => (p.v > points[best].v ? i : best),
    0
  );
  const peak = points[peakIdx];

  const showRecent = recentAudit ?? (isMock
    ? {
        provider: "Memorial Health",
        filedISO: "2026-04-03T00:00:00.000Z",
        auditId: "RCS-48211",
        status: "active" as const,
      }
    : null);

  const showFlagged = (mostFlagged && mostFlagged.length > 0
    ? mostFlagged
    : isMock
      ? [
          { code: "NSA § 2799A-1", percent: 34 },
          { code: "FDCPA § 1692g", percent: 28 },
        ]
      : []
  ).slice(0, 2);

  const showTop = topFacility ?? (isMock
    ? { name: "Memorial Health", thisMonth: 8450, lastMonth: 1210 }
    : null);

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
        {showRecent ? (
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
                {statusToLabel[showRecent.status]}
              </span>
            </div>

            <div className="mt-12 rounded-[10px] border border-white/60 bg-white p-3 shadow-[0_2px_8px_rgb(15_23_42/0.05)]">
              <div className="text-[12.5px] font-semibold tracking-tight text-ink">
                {showRecent.provider}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                <HugeiconsIcon
                  icon={Calendar02Icon}
                  size={10}
                  strokeWidth={1.5}
                />
                <span>Filed {formatFiled(showRecent.filedISO)}</span>
                <Link
                  href="/workspace/audit"
                  className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600 hover:text-amber-700"
                >
                  Details
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <article className="flex flex-col items-start justify-center rounded-[14px] border border-dashed border-neutral-200 bg-neutral-50/40 p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              No recent audits
            </span>
            <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
              Your most recent audit will land here.
            </p>
            <Link
              href="/workspace/audit"
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-amber-400 px-2.5 text-[11.5px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.3)] transition-colors hover:bg-amber-500"
            >
              <HugeiconsIcon icon={UploadIcon} size={11} strokeWidth={1.75} />
              Ingest a bill
            </Link>
          </article>
        )}

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
            {path && (
              <>
                <motion.path
                  d={`${path} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`}
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
                {peak && peak.v > 0 && (
                  <>
                    <circle
                      cx={peak.x}
                      cy={peak.y}
                      r={9}
                      fill="white"
                      stroke="rgb(16 185 129)"
                      strokeWidth={2}
                    />
                    <circle
                      cx={peak.x}
                      cy={peak.y}
                      r={3.5}
                      fill="rgb(16 185 129)"
                    />
                    <g transform={`translate(${peak.x - 38}, ${peak.y - 38})`}>
                      <rect
                        width={76}
                        height={22}
                        rx={6}
                        fill="white"
                        stroke="rgb(229 231 235)"
                      />
                      <text
                        x={38}
                        y={15}
                        textAnchor="middle"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        fontSize="11"
                        fill="rgb(17 24 39)"
                      >
                        {usd(peak.v)}
                      </text>
                    </g>
                  </>
                )}
              </>
            )}
          </svg>
          <div className="mt-2 grid grid-cols-7 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
            {DAYS.map((d) => (
              <span key={d} className="text-center">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start justify-between rounded-[12px] border border-neutral-100 bg-white p-4">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold tracking-tight text-ink">
              Most flagged
            </div>
            {showFlagged.length > 0 ? (
              <div className="mt-3 space-y-1.5 text-[11.5px]">
                {showFlagged.map((f, i) => (
                  <div key={f.code} className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${TONES[i % TONES.length]}`}
                    />
                    <span className="truncate text-ink">{f.code}</span>
                    <span className="ml-auto font-mono text-[10px] text-neutral-500">
                      {f.percent}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                No flags yet
              </div>
            )}
          </div>
        </div>
        {showTop ? (
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
                {showTop.name}
              </div>
              <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
                <span>This month</span>
                <span className="font-mono text-ink">
                  {usd(showTop.thisMonth)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
                <span>Last month</span>
                <span className="font-mono">{usd(showTop.lastMonth)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-[12px] border border-dashed border-neutral-200 bg-neutral-50/40 p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Top facility appears after 1 audit
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
