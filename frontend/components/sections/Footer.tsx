"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InstagramIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { Container } from "@/components/primitives/Container";
import { Wordmark } from "@/components/primitives/Wordmark";
import { footer } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const socials = [
  { label: "Instagram", href: "#instagram", icon: InstagramIcon },
  { label: "X", href: "#x", icon: NewTwitterIcon },
];

export function Footer() {
  return (
    <footer className="bg-[linear-gradient(180deg,#ffffff,#f7f9f6)]">
      <Container as="div" className="py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-[14px] bg-white px-8 pb-8 pt-10 shadow-[0_1px_2px_rgb(15_23_42/0.03)] lg:px-12 lg:pb-10 lg:pt-12"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
            <Wordmark />
            <p className="max-w-md text-[13px] leading-relaxed text-muted sm:text-right">
              {footer.description}
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
              {footer.columns.map((col) => (
                <div key={col.title}>
                  <div className="text-[13px] font-semibold text-ink">
                    {col.title}
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-[13px] text-muted transition-colors hover:text-ink"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <p className="text-[12px] text-muted">{footer.copyright}</p>
              <div className="flex items-center gap-1">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] bg-ink text-white shadow-[0_8px_18px_rgb(0_0_0/0.14)] transition-colors hover:bg-black"
                  >
                    <HugeiconsIcon
                      icon={s.icon}
                      size={12}
                      strokeWidth={2}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
