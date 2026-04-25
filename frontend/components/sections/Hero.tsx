"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { hero } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(255,255,255,0.72),rgba(255,255,255,0.25)_55%,transparent_80%)]"
      />
      <Container className="relative grid min-w-0 items-center gap-12 py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <motion.div
          className="flex min-w-0 flex-col"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={riseIn}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            variants={riseIn}
            className="font-display mt-8 whitespace-pre-line text-[44px] leading-[1.02] text-ink sm:text-[54px] lg:text-[60px]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={riseIn}
            className="font-[Georgia] mt-4 text-[13px] italic text-muted"
          >
            Not legal advice — a path to recourse.
          </motion.p>

          <motion.p
            variants={riseIn}
            className="mt-6 max-w-[460px] text-[14px] leading-[1.65] text-muted"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={riseIn}
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted"
          >
            <span className="inline-flex items-baseline gap-1.5">
              <span className="font-mono text-[17px] font-semibold tracking-tight text-ink">
                $2,847
              </span>
              <span>median refund secured</span>
            </span>
            <span className="hidden text-faint sm:inline">·</span>
            <span className="inline-flex items-baseline gap-1.5">
              <span className="font-mono text-[17px] font-semibold tracking-tight text-ink">
                73%
              </span>
              <span>hospital response rate</span>
            </span>
          </motion.div>

          <motion.div
            variants={riseIn}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href={hero.primary.href}>
              {hero.primary.label}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={1.75}
              />
            </Button>
            <Button href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex min-w-0 items-center justify-center"
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <div className="relative w-full max-w-[690px] overflow-hidden rounded-2xl border border-border-strong bg-white shadow-[0_18px_48px_rgb(15_23_42/0.08),0_2px_6px_rgb(15_23_42/0.04)]">
            <Image
              src="/better_hero.png"
              alt="Recourse workspace — My Summary dashboard with active disputes and recovery progress"
              width={1570}
              height={1001}
              priority
              className="h-auto w-full"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
