"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  ArrowRight01Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { GoogleLogo } from "@/components/primitives/GoogleLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0;

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
            Welcome back
          </h1>
          <p className="mt-2 text-[13px] tracking-tight text-neutral-500">
            Sign in to continue your active disputes.
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

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block h-11 w-full rounded-[10px] border border-neutral-200 bg-white px-3.5 text-[13.5px] tracking-tight text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </label>

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Password
              </span>
              <Link
                href="/login"
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-ink"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-amber-400 text-[13px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-amber-300 disabled:shadow-none"
          >
            Sign in
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.75} />
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
        New to Recourse?{" "}
        <Link
          href="/signup"
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
