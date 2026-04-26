"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/primitives/Container";
import { integrations } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const headerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const tileIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export function Integrations() {
  return (
    <section
      id="solution"
      className="border-t border-border bg-surface"
    >
      <Container className="py-16 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
          variants={headerStagger}
          className="grid gap-10 lg:grid-cols-[1fr_1.08fr] lg:gap-16"
        >
          <div>
            <motion.div
              variants={rise}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
            >
              {integrations.eyebrow}
            </motion.div>
            <motion.h2
              variants={rise}
              className="font-display mt-4 whitespace-pre-line text-[36px] leading-[1.02] text-ink sm:text-[44px]"
            >
              {integrations.title}
            </motion.h2>
          </div>
          <motion.p
            variants={rise}
            className="text-[14px] leading-[1.65] text-muted lg:max-w-[440px] lg:self-end"
          >
            {integrations.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
          variants={gridStagger}
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {integrations.items.map((item) => (
            <motion.div
              key={item.label}
              variants={tileIn}
              className="group flex items-start justify-between gap-3 rounded-md border border-border bg-white px-4 py-3.5 transition-colors duration-200 hover:border-border-strong"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium tracking-tight text-ink">
                    {item.label}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                    {item.extracts}
                  </div>
                </div>
              </div>
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={12}
                strokeWidth={1.5}
                className="mt-1.5 shrink-0 text-faint transition-colors duration-200 group-hover:text-muted"
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
