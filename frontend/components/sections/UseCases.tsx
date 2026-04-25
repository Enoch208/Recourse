"use client";

import { motion } from "motion/react";
import { Container } from "@/components/primitives/Container";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { useCases } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

type CardTone = "rose" | "amber" | "indigo" | "emerald";
type Chip = { code: string; label: string; status: string };

type CardProps = {
  title: string;
  description: string;
  tone: CardTone;
  chips: Chip[];
  index: number;
};

const auraAnchors = [
  "0% 0%",
  "100% 0%",
  "0% 100%",
  "100% 100%",
] as const;

const toneMap: Record<
  CardTone,
  {
    auraColor: string;
    chipBar: string;
    chipTint: string;
    chipTag: string;
  }
> = {
  rose: {
    auraColor: "rgba(244,114,182,0.28)",
    chipBar: "bg-rose-400",
    chipTint: "bg-rose-50/60",
    chipTag: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  amber: {
    auraColor: "rgba(251,191,36,0.28)",
    chipBar: "bg-amber-400",
    chipTint: "bg-amber-50/60",
    chipTag: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  indigo: {
    auraColor: "rgba(129,140,248,0.28)",
    chipBar: "bg-indigo-400",
    chipTint: "bg-indigo-50/60",
    chipTag: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  emerald: {
    auraColor: "rgba(52,211,153,0.28)",
    chipBar: "bg-emerald-400",
    chipTint: "bg-emerald-50/60",
    chipTag: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
};

function UseCaseCard({ title, description, tone, chips, index }: CardProps) {
  const t = toneMap[tone];
  const anchor = auraAnchors[index % 4];
  return (
    <motion.article
      variants={cardIn}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE } }}
      className="group relative flex flex-col overflow-hidden rounded-[14px] border border-black/[0.05] bg-white p-7 shadow-[0_1px_2px_rgb(15_23_42/0.03)] lg:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(80% 75% at ${anchor}, ${t.auraColor}, transparent 62%)`,
        }}
      />

      <div className="relative flex h-full flex-col">
        <h3 className="font-display text-[26px] leading-[1.05] text-ink">
          {title}
        </h3>
        <p className="mt-2 max-w-[420px] text-[13px] leading-[1.6] text-muted">
          {description}
        </p>
        <a
          href="#solution"
          className="mt-5 inline-flex w-fit text-[12px] text-muted underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
        >
          Learn more
        </a>

        <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {chips.map((c) => (
            <div
              key={c.code}
              className={`relative overflow-hidden rounded-[8px] border border-black/[0.05] ${t.chipTint} px-3 py-2.5 pl-4`}
            >
              <span
                aria-hidden
                className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${t.chipBar}`}
              />
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[11px] text-ink">
                  {c.code}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ring-1 ring-inset ${t.chipTag}`}
                >
                  {c.status}
                </span>
              </div>
              <div className="mt-1 truncate font-mono text-[10px] text-muted">
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function UseCases() {
  return (
    <section
      id="statutes"
      className="border-b border-border bg-surface"
    >
      <Container className="py-24 lg:py-32">
        <SectionHeading
          title={useCases.title}
          description={useCases.description}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
          variants={gridStagger}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16"
        >
          {useCases.items.map((item, index) => (
            <UseCaseCard
              key={item.title}
              title={item.title}
              description={item.description}
              tone={item.tone}
              chips={item.chips}
              index={index}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
