"use client";

import Image from "next/image";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionDivider() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scaleX: 0.85 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.6, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative flex items-center justify-center bg-surface py-10 sm:py-14"
    >
      <div className="relative mx-auto h-12 w-full max-w-[960px] overflow-hidden">
        <Image
          src="/line.png"
          alt=""
          width={1536}
          height={1024}
          className="pointer-events-none h-full w-full select-none object-cover object-[center_33%]"
        />
      </div>
    </motion.div>
  );
}
