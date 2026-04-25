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

type ChipTone = "emerald" | "rose" | "amber" | "sky" | "violet" | "indigo";
type Chip = { code: string; label: string; status: string; tone: ChipTone };
type CaseBox = {
  ref: string;
  title: string;
  summary: string;
  primary: { label: string };
  secondary: { label: string };
};

type CardProps = {
  title: string;
  description: string;
  chips?: Chip[];
  caseBox?: CaseBox;
  index: number;
};

const cardMinH = "lg:min-h-[340px]";
const cardSpan = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

const chipToneMap: Record<
  ChipTone,
  { bar: string; tint: string; tag: string }
> = {
  emerald: {
    bar: "bg-emerald-400",
    tint: "bg-emerald-50/55",
    tag: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  rose: {
    bar: "bg-rose-400",
    tint: "bg-rose-50/55",
    tag: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  amber: {
    bar: "bg-amber-400",
    tint: "bg-amber-50/55",
    tag: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  sky: {
    bar: "bg-sky-400",
    tint: "bg-sky-50/55",
    tag: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  violet: {
    bar: "bg-violet-400",
    tint: "bg-violet-50/55",
    tag: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  indigo: {
    bar: "bg-indigo-400",
    tint: "bg-indigo-50/55",
    tag: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
};

// Per-card aura — only TR (1) and BL (2) get glows; TL (0) and BR (3) stay clean.
const cardAura: Array<string | null> = [
  null,
  // TR — soft sky-blue glow on top-right edge with subtle layering
  "radial-gradient(70% 60% at 100% 0%, rgba(96,165,250,0.22), transparent 70%)",
  // BL — mint → lavender on bottom-left edges
  "radial-gradient(55% 55% at 0% 100%, rgba(52,211,153,0.20), transparent 70%), radial-gradient(65% 65% at 25% 95%, rgba(167,139,250,0.20), transparent 75%)",
  null,
];

// TR also gets a "layered drop" — a slightly stronger shadow than the others.
const cardShadow = [
  "shadow-[0_1px_2px_rgb(15_23_42/0.03)]",
  "shadow-[0_18px_42px_rgb(96_165_250/0.10),0_2px_4px_rgb(15_23_42/0.04)]",
  "shadow-[0_18px_42px_rgb(167_139_250/0.10),0_2px_4px_rgb(15_23_42/0.04)]",
  "shadow-[0_1px_2px_rgb(15_23_42/0.03)]",
];

function ChipPanel({ chips }: { chips: Chip[] }) {
  return (
    <div className="mt-auto grid grid-cols-1 gap-2.5 pt-8 sm:grid-cols-2">
      {chips.map((c) => {
        const tt = chipToneMap[c.tone];
        return (
          <div
            key={c.code}
            className={`relative overflow-hidden rounded-[8px] border border-black/[0.05] ${tt.tint} px-3 py-2.5 pl-4`}
          >
            <span
              aria-hidden
              className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${tt.bar}`}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[11px] text-ink">
                {c.code}
              </span>
              <span
                className={`inline-flex shrink-0 items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ring-1 ring-inset ${tt.tag}`}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-1 truncate font-mono text-[10px] text-muted">
              {c.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CasePanel({ box }: { box: CaseBox }) {
  return (
    <div className="mt-auto rounded-[10px] border border-black/[0.05] bg-white p-4 shadow-[0_4px_12px_rgb(15_23_42/0.04)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Case · {box.ref}
      </div>
      <div className="mt-2 text-[15px] font-semibold tracking-tight text-ink">
        {box.title}
      </div>
      <p className="mt-2 text-[12px] leading-[1.6] text-muted">{box.summary}</p>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-[5px] bg-ink px-3 text-[11px] font-semibold tracking-tight text-white shadow-[0_8px_18px_rgb(0_0_0/0.12)] transition-colors duration-200 hover:bg-[#272727]"
        >
          {box.primary.label}
        </button>
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-[5px] border border-border bg-white px-3 text-[11px] font-semibold tracking-tight text-ink transition-colors duration-200 hover:border-border-strong"
        >
          {box.secondary.label}
        </button>
      </div>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  chips,
  caseBox,
  index,
}: CardProps) {
  const aura = cardAura[index % 4];
  return (
    <motion.article
      variants={cardIn}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE } }}
      className={`group relative flex flex-col overflow-hidden rounded-[14px] border border-black/[0.05] bg-white p-7 lg:p-8 ${cardSpan[index % 4]} ${cardMinH} ${cardShadow[index % 4]}`}
    >
      {aura && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: aura }}
        />
      )}

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

        {caseBox ? (
          <CasePanel box={caseBox} />
        ) : chips ? (
          <ChipPanel chips={chips} />
        ) : null}
      </div>
    </motion.article>
  );
}

export function UseCases() {
  return (
    <section id="statutes" className="border-b border-border bg-surface">
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
          className="mt-14 grid grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-12"
        >
          {useCases.items.map((item, index) => (
            <UseCaseCard
              key={item.title}
              title={item.title}
              description={item.description}
              chips={"chips" in item ? item.chips : undefined}
              caseBox={"caseBox" in item ? item.caseBox : undefined}
              index={index}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
