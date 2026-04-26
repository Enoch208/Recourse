"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function SampleLetter() {
  return (
    <section id="demo" className="border-t border-border bg-background">
      <Container className="py-24 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
          variants={stagger}
          className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20"
        >
          <div className="max-w-xl">
            <motion.div
              variants={rise}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
            >
              Sample output
            </motion.div>
            <motion.h2
              variants={rise}
              className="font-display mt-4 text-[40px] leading-[1.02] tracking-tight text-ink sm:text-[52px]"
            >
              A real letter.
              <br />
              Every claim cited.
            </motion.h2>
            <motion.p
              variants={rise}
              className="mt-5 max-w-[440px] text-[14px] leading-[1.65] text-muted"
            >
              Each demand letter Recourse drafts is backed by specific federal
              statute — not paraphrased, not hallucinated. Open the sample to
              see the two-page output hospitals actually receive.
            </motion.p>

            <motion.div variants={rise} className="mt-8 flex items-center gap-3">
              <Button href="/signup">
                Start audit
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </Button>
              <Button href="/workspace/audit" variant="secondary">
                See full letter
              </Button>
            </motion.div>

            <motion.dl
              variants={rise}
              className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6"
            >
              {[
                ["2", "pages"],
                ["4", "citations"],
                ["90s", "drafted in"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 font-mono text-[18px] text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            variants={rise}
            className="relative"
          >
            <article className="relative overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
              <div className="relative px-10 py-10 font-[Georgia] text-[13px] leading-[1.7] text-ink lg:px-14 lg:py-14">
                <header className="flex items-start justify-between border-b border-border pb-6">
                  <div>
                    <div className="font-sans text-[20px] font-bold tracking-tight text-ink">
                      Recourse
                    </div>
                    <div className="font-[Georgia] italic text-[12px] text-neutral-500">
                      You have recourse.
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    Demand for Recourse
                    <br />
                    <span className="text-faint">Ref · RCS-48211</span>
                  </div>
                </header>

                <div className="mt-8 space-y-1 font-mono text-[11px] text-muted">
                  <div>
                    <span className="text-faint">To: </span>
                    Memorial Health System, Patient Accounts
                  </div>
                  <div>
                    <span className="text-faint">Re: </span>
                    Account #48211 &mdash; J. Ramirez &mdash; DOS 03/14/2026
                  </div>
                  <div>
                    <span className="text-faint">Amount in dispute: </span>
                    <span className="text-ink">$8,450.00</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <p>
                    <span className="font-semibold">Dear Patient Accounts:</span>
                  </p>
                  <p>
                    This letter serves as formal notice of dispute pursuant to
                    the No Surprises Act,{" "}
                    <span className="font-semibold">
                      42 U.S.C. § 300gg-131
                    </span>
                    . On the above date of service, patient was charged{" "}
                    <span className="font-mono font-semibold">$8,450.00</span>{" "}
                    in facility fees for an out-of-network emergency encounter
                    at an in-network facility.
                  </p>
                  <p>
                    Under{" "}
                    <span className="font-semibold">NSA § 2799A-1(a)(3)</span>,
                    the patient&rsquo;s cost-sharing obligation is limited to
                    the in-network rate. The charged amount exceeds this cap
                    by a material margin and is therefore subject to
                    immediate <span className="font-semibold">adjustment</span>{" "}
                    under 45 CFR § 149.110.
                  </p>
                  <p>
                    Pursuant to{" "}
                    <span className="font-semibold">HIPAA § 164.524</span>, the
                    patient has requested and is entitled to a complete
                    itemized statement, including CPT codes, modifiers, and
                    provider NPI identifiers. A response is required within
                    thirty (30) days of receipt.
                  </p>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,var(--color-background)_85%)]"
              />
            </article>

            <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Verified · NSA · FDCPA · HIPAA
              </span>
              <span>Page 1 of 2</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
