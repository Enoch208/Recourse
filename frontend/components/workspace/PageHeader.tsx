"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { useIdentity } from "./UserContext";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const identity = useIdentity();
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink sm:text-[28px]">
          {title}
        </h1>
        {subtitle && (
          <div className="mt-1 text-[12.5px] leading-snug text-neutral-500">
            {subtitle}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {actions}
        <button
          type="button"
          aria-label="Inbox"
          className="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink sm:inline-flex"
        >
          <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
        >
          <HugeiconsIcon
            icon={Notification01Icon}
            size={14}
            strokeWidth={1.5}
          />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        {identity.isGuest ? (
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-[12px] border border-amber-200 bg-amber-50/60 py-1 pl-1 transition-colors hover:bg-amber-50 sm:pr-3"
            title="Create an account to save your audits"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[11px] font-semibold tracking-tight text-white">
              {identity.initials}
            </span>
            <div className="hidden leading-tight sm:block">
              <div className="text-[12px] font-semibold tracking-tight text-ink">
                Sign up
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-700">
                Guest mode
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 rounded-[12px] border border-neutral-100 bg-neutral-50 py-1 pl-1 sm:pr-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[11px] font-semibold tracking-tight text-white">
              {identity.initials}
            </span>
            <div className="hidden leading-tight sm:block">
              <div className="text-[12px] font-semibold tracking-tight text-ink">
                {identity.displayName}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                User
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
