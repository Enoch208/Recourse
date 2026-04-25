"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/primitives/Container";
import { poweredBy } from "@/lib/content";

type Sponsor = { label: string; logo?: string; href?: string };

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const inner = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.label}
      width={140}
      height={28}
      className="h-7 w-auto opacity-60 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0"
    />
  ) : (
    <span className="font-display whitespace-nowrap text-[22px] tracking-tight text-muted transition-colors duration-200 hover:text-ink">
      {sponsor.label}
    </span>
  );

  if (sponsor.href) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0"
      >
        {inner}
      </a>
    );
  }
  return <div className="shrink-0">{inner}</div>;
}

export function PoweredBy() {
  // Duplicate the list so the -50% animation produces a seamless loop
  const items = [...poweredBy.sponsors, ...poweredBy.sponsors];

  return (
    <section className="border-t border-border bg-surface">
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col items-center gap-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {poweredBy.eyebrow}
          </div>

          <div className="relative w-full overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--color-surface),transparent)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--color-surface),transparent)]"
            />

            <motion.div
              className="flex shrink-0 items-center gap-12 lg:gap-16"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 32,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {items.map((s, i) => (
                <SponsorTile key={`${s.label}-${i}`} sponsor={s} />
              ))}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
