"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Notification01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Sidebar } from "@/components/workspace/Sidebar";
import { ComparisonCard } from "@/components/workspace/ComparisonCard";
import { GoalsCard } from "@/components/workspace/GoalsCard";
import { AuditTrendCard } from "@/components/workspace/AuditTrendCard";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeIn = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkspacePage() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      <main className="flex-1 min-w-0 px-8 py-7 lg:px-12 lg:py-9">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
                My Summary
              </h1>
              <div className="mt-1 text-[12.5px] text-neutral-500">
                Welcome back, Jamet — 3 active disputes, $1,420 in flight.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400"
              >
                Monthly
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={12}
                  strokeWidth={1.75}
                />
              </button>
              <button
                type="button"
                aria-label="Inbox"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
              >
                <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
              >
                <HugeiconsIcon icon={Notification01Icon} size={14} strokeWidth={1.5} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>
              <div className="flex items-center gap-2 rounded-[12px] border border-neutral-100 bg-neutral-50 py-1 pl-1 pr-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[11px] font-semibold tracking-tight text-white">
                  JR
                </span>
                <div className="leading-tight">
                  <div className="text-[12px] font-semibold tracking-tight text-ink">
                    Jamet Roy
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                    Patient
                  </div>
                </div>
              </div>
            </div>
          </header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="mt-7 grid gap-5 lg:grid-cols-[1.55fr_1fr]"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-5"
            >
              <ComparisonCard />
              <AuditTrendCard />
            </motion.div>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <GoalsCard />
            </motion.div>
          </motion.div>
      </main>
    </div>
  );
}
