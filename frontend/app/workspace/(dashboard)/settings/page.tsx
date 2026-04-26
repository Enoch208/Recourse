"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  SecurityCheckIcon,
  Notification01Icon,
  CreditCardIcon,
  Logout01Icon,
  LockIcon,
  Tick02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { useIdentity } from "@/components/workspace/UserContext";
import { signOutAction } from "@/app/(auth)/actions";
import {
  changePasswordAction,
  updateProfileAction,
  type SettingsState,
} from "./actions";

const EASE = [0.22, 1, 0.36, 1] as const;

type SectionProps = {
  icon: IconSvgElement;
  title: string;
  description: string;
  children: React.ReactNode;
};

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <section className="grid gap-6 border-b border-neutral-200/70 py-8 first:pt-0 last:border-b-0 lg:grid-cols-[300px_1fr] lg:gap-10">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-neutral-100 text-neutral-600">
          <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-[14px] font-semibold tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-1.5 max-w-[260px] text-[12.5px] leading-relaxed text-neutral-500">
            {description}
          </p>
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: "text" | "email" | "password" | "tel";
  mono?: boolean;
  placeholder?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  mono,
  placeholder,
  required,
}: FieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`mt-1.5 block h-10 w-full rounded-[10px] border border-neutral-200 bg-white px-3 text-[13px] tracking-tight text-ink focus:border-neutral-400 focus:outline-none ${
          mono ? "font-mono text-[12px]" : ""
        }`}
      />
    </label>
  );
}

function StatusBanner({ state }: { state: SettingsState }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-emerald-100 bg-emerald-50 px-3 py-2 text-[12.5px] text-emerald-700">
        <HugeiconsIcon
          icon={Tick02Icon}
          size={13}
          strokeWidth={2}
          className="mt-0.5 shrink-0"
        />
        <span>{state.message}</span>
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-rose-100 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
      <HugeiconsIcon
        icon={Alert02Icon}
        size={13}
        strokeWidth={1.75}
        className="mt-0.5 shrink-0"
      />
      <span>{state.error}</span>
    </div>
  );
}

export default function SettingsPage() {
  const identity = useIdentity();
  const [profileState, profileAction, profilePending] = useActionState<
    SettingsState,
    FormData
  >(updateProfileAction, undefined);
  const [passwordState, passwordAction, passwordPending] = useActionState<
    SettingsState,
    FormData
  >(changePasswordAction, undefined);

  const isGuest = identity.isGuest;

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle={
          isGuest
            ? "You're in guest mode. Create an account to save these preferences."
            : "Profile, security, and account preferences."
        }
      />

      {isGuest && (
        <div className="mt-6 rounded-[16px] border border-amber-200 bg-amber-50/60 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-700">
            Guest mode
          </div>
          <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-ink">
            Sign up to save your audits
          </h3>
          <p className="mt-1 max-w-[520px] text-[12.5px] leading-relaxed text-neutral-600">
            Without an account, your audits and preferences are reset when you
            close this tab. Create an account to keep them.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="/signup"
              className="inline-flex h-9 items-center rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500"
            >
              Create an account
            </a>
            <a
              href="/login"
              className="inline-flex h-9 items-center rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400"
            >
              Sign in
            </a>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-7 rounded-[16px] border border-neutral-200/70 bg-white px-7"
      >
        <form action={profileAction}>
          <Section
            icon={Mail01Icon}
            title="Profile"
            description="How your name and contact info appear on demand letters."
          >
            <fieldset disabled={isGuest} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  defaultValue={identity.user?.name ?? ""}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={identity.email}
                  // Email change not supported here — readonly via disabled wrapper
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  defaultValue={identity.user?.phone ?? ""}
                  placeholder="(415) 555-0142"
                  mono
                />
                <Field
                  label="Mailing address"
                  name="mailingAddress"
                  defaultValue={identity.user?.mailingAddress ?? ""}
                  placeholder="1842 Mission St, SF CA 94103"
                />
              </div>
              {!isGuest && (
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={profilePending}
                    className="inline-flex h-9 items-center rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-amber-300 disabled:shadow-none"
                  >
                    {profilePending ? "Saving…" : "Save profile"}
                  </button>
                </div>
              )}
              <StatusBanner state={profileState} />
            </fieldset>
          </Section>
        </form>

        {!isGuest && (
          <form action={passwordAction}>
            <Section
              icon={LockIcon}
              title="Password"
              description="Change the password used to sign into your Recourse account."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  required
                />
                <Field
                  label="New password"
                  name="newPassword"
                  type="password"
                  required
                />
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={passwordPending}
                  className="inline-flex h-9 items-center rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordPending ? "Updating…" : "Update password"}
                </button>
              </div>
              <StatusBanner state={passwordState} />
            </Section>
          </form>
        )}

        <Section
          icon={Notification01Icon}
          title="Notifications"
          description="When Recourse should reach out about your bills."
        >
          <div className="text-[12.5px] leading-relaxed text-neutral-500">
            Notification preferences ship in the next release. For now, every
            account opts in to weekly digests and statute-match alerts.
          </div>
        </Section>

        <Section
          icon={SecurityCheckIcon}
          title="Privacy"
          description="Bills and personal data stay in your account. Recourse never resells PHI."
        >
          <ul className="space-y-2 text-[12.5px] leading-relaxed text-neutral-600">
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={12}
                strokeWidth={2}
                className="mt-1 text-emerald-600"
              />
              Bills encrypted in transit and at rest.
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={12}
                strokeWidth={2}
                className="mt-1 text-emerald-600"
              />
              Audit findings stored only against your account.
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={12}
                strokeWidth={2}
                className="mt-1 text-emerald-600"
              />
              Statute library is verified against federal text — never
              LLM-judged.
            </li>
          </ul>
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
              You&apos;ll only be charged when a provider refunds, voids, or
              reduces a bill. Fees are itemized on every closed dispute.
            </p>
          </div>
        </Section>

        <Section
          icon={Logout01Icon}
          title="Session"
          description={
            isGuest
              ? "Guest sessions don't need to be ended — close the tab to clear state."
              : "Sign out of this device or close your account."
          }
        >
          {isGuest ? (
            <div className="text-[12.5px] text-neutral-500">
              <a
                href="/login"
                className="text-ink underline-offset-4 hover:underline"
              >
                Sign in
              </a>{" "}
              to a saved account, or{" "}
              <a
                href="/signup"
                className="text-ink underline-offset-4 hover:underline"
              >
                create one
              </a>
              .
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-[10px] border border-neutral-200 bg-white px-3 text-[12px] tracking-tight text-ink transition-colors hover:border-neutral-400"
                >
                  Sign out
                </button>
              </form>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-[10px] px-3 text-[12px] tracking-tight text-rose-600 transition-colors hover:bg-rose-50"
              >
                Close account
              </button>
            </div>
          )}
        </Section>
      </motion.div>
    </>
  );
}
