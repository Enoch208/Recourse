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
      className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f7fbff)]"
    >
      <Container className="py-24 lg:py-32">
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
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6"
        >
          {integrations.items.map((item) => (
            <motion.div
              key={item.label}
              variants={tileIn}
              className="group flex h-12 items-center justify-between rounded-[7px] border border-white/75 bg-white/78 px-3 shadow-[0_14px_34px_rgb(14_116_144/0.08)] backdrop-blur transition-colors duration-200 hover:border-border-strong hover:bg-white"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <HugeiconsIcon
                  icon={item.icon}
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-[#1593b8]"
                />
                <span className="truncate text-[13px] text-ink">
                  {item.label}
                </span>
              </div>
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={12}
                strokeWidth={1.75}
                className="shrink-0 text-faint transition-colors duration-200 group-hover:text-muted"
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
