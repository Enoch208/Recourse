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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.88))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,13,13,0.14),transparent)]"
      />
      <Container className="relative grid min-w-0 items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <motion.div
          className="flex min-w-0 flex-col"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={riseIn}
            className="inline-flex w-fit items-center gap-2 rounded-[5px] border border-emerald-200/70 bg-white/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted shadow-[0_10px_28px_rgb(16_185_129/0.08)] backdrop-blur"
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
            className="mt-6 max-w-[460px] text-[14px] leading-[1.65] text-muted"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={riseIn}
            className="mt-10 flex flex-wrap items-center gap-3"
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
          <div className="relative w-full max-w-[620px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[22px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(15,23,42,0.12),transparent_70%)] blur-2xl"
            />
            <Image
              src="/hero_img.png"
              alt="Recourse audit workspace"
              width={1586}
              height={992}
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="relative h-auto w-full rounded-[14px] shadow-[0_30px_80px_rgb(15_23_42/0.14),0_8px_20px_rgb(15_23_42/0.05)] ring-1 ring-black/[0.06]"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
