"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { EvidenceBill } from "@/components/workspace/EvidenceBill";
import { AuditStream } from "@/components/workspace/AuditStream";

export default function AuditWorkstation() {
  return (
    <div className="min-h-screen bg-[#EEF2FB] p-4 lg:p-6">
      <div className="mx-auto flex h-[calc(100vh-32px)] max-w-[1440px] flex-col overflow-hidden rounded-[20px] border border-white/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.06)] lg:h-[calc(100vh-48px)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] tracking-tight text-neutral-600 transition-colors hover:border-neutral-400 hover:text-ink"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={12}
                strokeWidth={1.5}
              />
              Back
            </Link>
            <span className="h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-emerald-50 text-emerald-700">
                <span className="font-mono text-[10px] font-semibold">RCS</span>
              </span>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold tracking-tight text-ink">
                  Memorial Health Medical Center
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  Audit · RCS-48211 · DOS 03/14/2026
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
              aria-label="Print"
            >
              <HugeiconsIcon icon={PrinterIcon} size={14} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500"
            >
              <HugeiconsIcon
                icon={Download01Icon}
                size={13}
                strokeWidth={1.75}
              />
              Send letter
            </button>
            <span className="h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2 rounded-[10px] border border-neutral-100 bg-neutral-50/60 py-1 pl-1 pr-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[10px] font-semibold tracking-tight text-white">
                JR
              </span>
              <div className="leading-tight">
                <div className="text-[11.5px] font-semibold tracking-tight text-ink">
                  J. Ramirez
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                  Patient
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <section
            aria-label="Evidence"
            className="w-2/5 shrink-0 overflow-y-auto border-r border-neutral-100 bg-[#F5F7FA] px-6 py-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                Evidence
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                memorial_health_48211.pdf
              </span>
            </div>
            <EvidenceBill />
          </section>

          <section
            aria-label="Audit Engine"
            className="flex flex-1 min-w-0 flex-col bg-white"
          >
            <AuditStream />
          </section>
        </div>
      </div>
    </div>
  );
}
