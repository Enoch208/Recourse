"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Wordmark } from "@/components/primitives/Wordmark";
import { nav } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 bg-white/45 shadow-[0_1px_0_rgb(13_13_13/0.04)] backdrop-blur-xl backdrop-saturate-150"
      >
        <Container
          as="div"
          className="flex h-[68px] items-center justify-between border-b border-white/30"
        >
          <div className="flex items-center gap-10">
            <Link
              href="/"
              aria-label="Recourse home"
              className="transition-opacity duration-200 hover:opacity-70"
            >
              <Wordmark size="sm" />
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[13px] text-muted transition-colors duration-200 hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:block">
            <Button href={nav.cta.href} size="sm">
              {nav.cta.label}
            </Button>
          </div>
        </Container>
      </motion.header>
      <div aria-hidden="true" className="h-[68px]" />
    </>
  );
}
