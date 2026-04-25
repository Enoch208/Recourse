"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { explore } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const float = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

type FloatProps = {
  icon: IconSvgElement;
  className: string;
};

function FloatingIcon({ icon, className }: FloatProps) {
  return (
    <motion.span
      variants={float}
      className={`absolute hidden h-10 w-10 items-center justify-center rounded-[7px] border border-white/80 bg-white/82 text-[#1593b8] shadow-[0_18px_40px_rgb(14_116_144/0.1)] backdrop-blur md:inline-flex ${className}`}
      aria-hidden
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
    </motion.span>
  );
}

const positions = [
  "top-2 left-[8%]",
  "top-8 right-[10%]",
  "bottom-6 left-[14%]",
  "bottom-2 right-[16%]",
  "top-1/2 -translate-y-1/2 left-[2%]",
  "top-1/2 -translate-y-1/2 right-[3%]",
];

export function ExploreCTA() {
  return (
    <section
      id="demo"
      className="border-b border-border bg-[linear-gradient(135deg,#f5fff9,#f2f9ff_48%,#fff6fb)]"
    >
      <Container className="py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
          variants={stagger}
          className="relative mx-auto max-w-3xl text-center"
        >
          {explore.floatingIcons.map((icon, i) => (
            <FloatingIcon key={i} icon={icon} className={positions[i]} />
          ))}

          <motion.div
            variants={rise}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            {explore.eyebrow}
          </motion.div>
          <motion.h2
            variants={rise}
            className="font-display mt-4 text-[44px] leading-[1.02] text-ink sm:text-[56px]"
          >
            {explore.title}
          </motion.h2>
          <motion.p
            variants={rise}
            className="mx-auto mt-5 max-w-[480px] text-[14px] leading-[1.65] text-muted"
          >
            {explore.description}
          </motion.p>

          <motion.div variants={rise} className="mt-10 flex justify-center">
            <Button href={explore.cta.href}>
              {explore.cta.label}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={1.75}
              />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
