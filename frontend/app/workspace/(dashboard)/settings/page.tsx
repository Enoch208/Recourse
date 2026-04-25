"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  SecurityCheckIcon,
  Notification01Icon,
  CreditCardIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { PageHeader } from "@/components/workspace/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

type SectionProps = {
  icon: IconSvgElement;
  title: string;
  description: string;
  children: React.ReactNode;
};

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <section className="grid gap-6 border-b border-neutral-200/70 py-7 first:pt-0 last:border-b-0 lg:grid-cols-[260px_1fr]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-neutral-100 text-neutral-600">
          <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="text-[14px] font-semibold tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
            {description}
          </p>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  type?: "text" | "email";
  mono?: boolean;
};

function Field({ label, value, type = "text", mono }: FieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </span>
      <input
        type={type}
        defaultValue={value}
        className={`mt-1.5 block h-10 w-full rounded-[10px] border border-neutral-200 bg-white px-3 text-[13px] tracking-tight text-ink focus:border-neutral-400 focus:outline-none ${
          mono ? "font-mono text-[12px]" : ""
        }`}
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <div>
        <div className="text-[13px] font-medium tracking-tight text-ink">
          {label}
        </div>
        <div className="mt-0.5 text-[12px] text-neutral-500">{description}</div>
      </div>
      <span className="relative mt-1 inline-flex h-5 w-9 shrink-0 items-center">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-neutral-200 transition-colors peer-checked:bg-emerald-500" />
        <span className="relative ml-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Profile, notifications, and account preferences."
        actions={
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500"
          >
            Save changes
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-7 rounded-[16px] border border-neutral-200/70 bg-white px-7"
      >
        <Section
          icon={Mail01Icon}
          title="Profile"
          description="How your name and contact info appear on demand letters."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value="Jamet Roy" />
            <Field label="Email" value="jamet@recourse.io" type="email" />
            <Field label="Phone" value="(415) 555-0142" mono />
            <Field label="Mailing address" value="1842 Mission St, SF CA 94103" />
          </div>
        </Section>

        <Section
          icon={Notification01Icon}
          title="Notifications"
          description="When Recourse should reach out about your bills."
        >
          <div className="divide-y divide-neutral-100">
            <Toggle
              label="New statute matches"
              description="Email me when a new bill triggers a verified violation."
              defaultChecked
            />
            <Toggle
              label="Provider responses"
              description="Notify me when a provider replies to a demand letter."
              defaultChecked
            />
            <Toggle
              label="Library updates"
              description="Tell me when the statute library version changes."
            />
            <Toggle
              label="Weekly digest"
              description="A Sunday recap of recovered amounts and active disputes."
              defaultChecked
            />
          </div>
        </Section>

        <Section
          icon={SecurityCheckIcon}
          title="Privacy"
          description="Bills and personal data stay in your account. Recourse never resells PHI."
        >
          <div className="divide-y divide-neutral-100">
            <Toggle
              label="Allow anonymized statute analytics"
              description="Help us tighten the statute library — only category counts, never bill content."
              defaultChecked
            />
            <Toggle
              label="Auto-redact bills before storage"
              description="Strip identifiers from uploaded bills after the audit completes."
            />
          </div>
        </Section>

        <Section
          icon={CreditCardIcon}
          title="Billing"
          description="Recourse takes 15% of recovered amounts — never an upfront fee."
        >
          <div className="rounded-[12px] border border-neutral-200 bg-neutral-50/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium tracking-tight text-ink">
                  Pay-on-recovery plan
                </div>
                <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Active · Default
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-600">
                No card on file
              </span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-neutral-600">
              You&apos;ll only be charged when a provider refunds, voids, or reduces a
              bill. Fees are itemized on every closed dispute.
            </p>
          </div>
        </Section>

        <Section
          icon={Logout01Icon}
          title="Session"
          description="Sign out of this device or close your account."
        >
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex h-9 items-center rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400"
            >
              Sign out
            </a>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-[10px] px-3 text-[12px] tracking-tight text-rose-600 transition-colors hover:bg-rose-50"
            >
              Close account
            </button>
          </div>
        </Section>
      </motion.div>
    </>
  );
}
