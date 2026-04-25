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
      <Container className="relative grid min-h-[620px] min-w-0 gap-12 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.12fr] lg:gap-14 lg:py-32">
        <motion.div
          className="flex min-w-0 flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={riseIn}
            className="inline-flex w-fit items-center gap-2 rounded-[5px] border border-emerald-200/70 bg-white/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted shadow-[0_10px_28px_rgb(16_185_129/0.1)] backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            variants={riseIn}
            className="font-display mt-8 whitespace-pre-line text-[44px] leading-[0.96] text-ink sm:text-[58px] lg:text-[64px]"
            style={{ maxWidth: "min(520px, calc(100vw - 40px))" }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={riseIn}
            className="mt-5 text-[14px] leading-[1.65] text-muted"
            style={{ maxWidth: "min(460px, calc(100vw - 40px))" }}
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={riseIn}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              href={hero.primary.href}
              className="shadow-[0_18px_38px_rgb(13_13_13/0.18)]"
            >
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

          <motion.div
            variants={riseIn}
            className="mt-10 grid max-w-[460px] grid-cols-3 gap-2"
          >
            {[
              ["14", "rules found"],
              ["90s", "draft time"],
              ["2", "pages ready"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[7px] border border-white/70 bg-white/62 px-3 py-2.5 shadow-[0_14px_30px_rgb(30_64_175/0.07)] backdrop-blur"
              >
                <div className="font-mono text-[14px] text-ink">{value}</div>
                <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex min-w-0 items-center justify-center"
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <div className="relative w-full max-w-[640px]">
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
              sizes="(max-width: 1024px) 100vw, 640px"
              className="relative h-auto w-full rounded-[14px] shadow-[0_30px_80px_rgb(15_23_42/0.16),0_8px_20px_rgb(15_23_42/0.06)] ring-1 ring-black/[0.06]"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
