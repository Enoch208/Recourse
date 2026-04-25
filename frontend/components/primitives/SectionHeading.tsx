"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -80px 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className={`${
        isCenter ? "mx-auto max-w-xl text-center" : "max-w-xl"
      } ${className}`}
    >
      {eyebrow && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: EASE },
            },
          }}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 22 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, ease: EASE },
          },
        }}
        className={`${
          eyebrow ? "mt-4" : ""
        } font-display whitespace-pre-line text-[36px] leading-[1.02] text-ink sm:text-[44px]`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: EASE },
            },
          }}
          className={`mt-5 text-[14px] leading-[1.65] text-muted ${
            isCenter ? "mx-auto max-w-[480px]" : "max-w-[480px]"
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
