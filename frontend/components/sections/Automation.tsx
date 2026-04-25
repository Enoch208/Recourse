"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Container } from "@/components/primitives/Container";
import { automation } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const headerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const headerRise = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const stepIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export function Automation() {
  return (
    <section
      id="advocates"
      className="border-t border-border bg-[#FAFAFA]"
    >
      <Container className="py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "0px 0px -80px 0px" }}
          variants={headerStagger}
          className="max-w-2xl"
        >
          <motion.div
            variants={headerRise}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400"
          >
            {automation.eyebrow}
          </motion.div>
          <motion.h2
            variants={headerRise}
            className="font-display mt-4 text-[36px] leading-[1.02] tracking-tight text-ink sm:text-[44px]"
          >
            {automation.title}
          </motion.h2>
          <motion.p
            variants={headerRise}
            className="mt-5 max-w-[520px] text-[14px] leading-[1.65] text-muted"
          >
            {automation.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
          variants={gridStagger}
          className="relative mt-14 lg:mt-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-[4.5rem] right-[4.5rem] top-[3.25rem] hidden h-px lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(17,24,39,0.18) 0 4px, transparent 4px 10px)",
            }}
          />

          <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {automation.steps.map((s) => (
              <motion.li
                key={s.step}
                variants={stepIn}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.25, ease: EASE },
                }}
                className="group relative flex min-h-[240px] flex-col rounded-[8px] border border-neutral-200 bg-white p-6 transition-colors duration-200 hover:border-neutral-400"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-neutral-200 bg-neutral-50 text-ink">
                    <HugeiconsIcon
                      icon={s.icon}
                      size={15}
                      strokeWidth={1.5}
                    />
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {s.label}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span>{s.step}</span>
                  </div>
                </div>

                <h3 className="mt-7 text-[16px] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                  {s.description}
                </p>

                <div className="mt-auto pt-6">
                  <div className="truncate rounded-[5px] border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 font-mono text-[10px] text-neutral-600">
                    {s.hint}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </Container>
    </section>
  );
}
