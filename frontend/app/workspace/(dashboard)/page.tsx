"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/workspace/PageHeader";
import { ComparisonCard } from "@/components/workspace/ComparisonCard";
import { GoalsCard } from "@/components/workspace/GoalsCard";
import { AuditTrendCard } from "@/components/workspace/AuditTrendCard";
import { useIdentity } from "@/components/workspace/UserContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeIn = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function buildSubtitle(
  isGuest: boolean,
  firstName: string,
  stats: ReturnType<typeof useIdentity>["stats"]
): string {
  if (isGuest) {
    return `Welcome back, ${firstName} — 3 active disputes, $1,420 in flight.`;
  }
  if (!stats || stats.totalAudits === 0) {
    return `Welcome back, ${firstName} — ingest your first bill to start an audit.`;
  }
  const inFlight = stats.activeCount + stats.draftingCount;
  if (inFlight === 0) {
    return `Welcome back, ${firstName} — every dispute resolved.`;
  }
  const usd = stats.totalRecoverable.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return `Welcome back, ${firstName} — ${inFlight} active dispute${
    inFlight === 1 ? "" : "s"
  }, ${usd} in flight.`;
}

export default function WorkspacePage() {
  const identity = useIdentity();
  const firstName = identity.displayName.split(/\s+/)[0];
  return (
    <>
      <PageHeader
        title="My Summary"
        subtitle={buildSubtitle(identity.isGuest, firstName, identity.stats)}
        actions={
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
        }
      />

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

        <motion.div variants={fadeIn} transition={{ duration: 0.5, ease: EASE }}>
          <GoalsCard />
        </motion.div>
      </motion.div>
    </>
  );
}
