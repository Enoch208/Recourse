"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  ArrowRight01Icon,
  Tick02Icon,
  LockIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { GoogleLogo } from "@/components/primitives/GoogleLogo";
import { signupAction, type AuthState } from "../actions";

const EASE = [0.22, 1, 0.36, 1] as const;

const passwordChecks = [
  { label: "8+ chars", test: (p: string) => p.length >= 8 },
  { label: "1 number", test: (p: string) => /\d/.test(p) },
  { label: "1 letter", test: (p: string) => /[A-Za-z]/.test(p) },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signupAction,
    undefined
  );

  const passwordValid = passwordChecks.every((c) => c.test(password));
  const canSubmit =
    name.length > 0 &&
    email.length > 0 &&
    passwordValid &&
    agreed &&
    !pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full max-w-[440px]"
    >
      <div className="rounded-[20px] border border-neutral-200/70 bg-white p-8 shadow-[0_2px_12px_rgb(15_23_42/0.04)]">
        <div className="text-center">
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
            Create your account
          </h1>
          <p className="mt-2 text-[13px] tracking-tight text-neutral-500">
            Start disputing bills in 90 seconds. No card required.
          </p>
        </div>

        <div className="mt-7">
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-neutral-200 bg-white text-[13px] tracking-tight text-ink transition-colors hover:border-neutral-400 hover:bg-neutral-50"
          >
            <GoogleLogo size={16} />
            Continue with Google
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            or with email
          </span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Full name
            </span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jamet Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 block h-11 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 text-[13.5px] tracking-tight text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Email
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 block h-11 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 text-[13.5px] tracking-tight text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Password
            </span>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block h-11 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 pr-11 font-mono text-[13px] tracking-tight text-ink placeholder:text-neutral-400 placeholder:font-sans focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink"
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffIcon : ViewIcon}
                  size={14}
                  strokeWidth={1.5}
                />
              </button>
            </div>
            {password.length > 0 && (
              <ul className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {passwordChecks.map((c) => {
                  const ok = c.test(password);
                  return (
                    <li
                      key={c.label}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                        ok
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      <span
                        className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-colors ${
                          ok
                            ? "bg-emerald-500 text-white"
                            : "border border-neutral-300 bg-white"
                        }`}
                      >
                        {ok && (
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={8}
                            strokeWidth={3}
                          />
                        )}
                      </span>
                      {c.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </label>

          <label className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer mt-0.5 h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-neutral-300 bg-white checked:border-ink checked:bg-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
            <span className="text-[12px] leading-relaxed text-neutral-600">
              I agree to Recourse&apos;s{" "}
              <Link
                href="/"
                className="text-ink underline-offset-2 hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="text-ink underline-offset-2 hover:underline"
              >
                Privacy Notice
              </Link>
              . Recourse does not provide legal advice.
            </span>
          </label>

          {state?.error && (
            <div className="flex items-start gap-2 rounded-[10px] border border-rose-100 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={13}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0"
              />
              <span>{state.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-amber-400 text-[13px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-amber-300 disabled:shadow-none"
          >
            {pending ? "Creating account…" : "Create account"}
            {!pending && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                strokeWidth={1.75}
              />
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            or
          </span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <Link
          href="/workspace"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-neutral-300 bg-neutral-50/50 text-[13px] tracking-tight text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-ink"
        >
          Continue as guest
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            demo
          </span>
        </Link>

        <div className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          <HugeiconsIcon icon={LockIcon} size={11} strokeWidth={1.5} />
          Bills are encrypted in transit and at rest
        </div>
      </div>

      <p className="mt-5 text-center text-[13px] tracking-tight text-neutral-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
