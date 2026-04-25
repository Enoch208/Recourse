"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { automation } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const stepIn = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const iconTones = [
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-violet-50 text-violet-700",
  "bg-rose-50 text-rose-700",
];

export function Automation() {
  return (
    <section
      id="advocates"
      className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f5fcf8)]"
    >
      <Container className="py-24 lg:py-32">
        <SectionHeading
          eyebrow={automation.eyebrow}
          title={automation.title}
          description={automation.description}
        />

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
          variants={gridStagger}
          className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {automation.steps.map((s, i) => (
            <motion.li
              key={s.step}
              variants={stepIn}
              whileHover={{ y: -2, transition: { duration: 0.25, ease: EASE } }}
              className="flex min-h-[210px] flex-col rounded-[8px] border border-white/75 bg-white/82 p-5 shadow-[0_18px_46px_rgb(15_23_42/0.06)] backdrop-blur transition-colors hover:bg-white lg:p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/80 ${iconTones[i]}`}
                >
                  <HugeiconsIcon
                    icon={s.icon}
                    size={15}
                    strokeWidth={1.75}
                  />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  {s.step}
                </span>
              </div>

              <h3 className="mt-6 text-[14px] font-semibold tracking-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                {s.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
