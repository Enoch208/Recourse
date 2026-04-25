"use client";

import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && (
          <div className="mt-1 text-[12.5px] text-neutral-500">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          type="button"
          aria-label="Inbox"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
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
        <div className="flex items-center gap-2 rounded-[12px] border border-neutral-100 bg-neutral-50 py-1 pl-1 pr-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[11px] font-semibold tracking-tight text-white">
            JR
          </span>
          <div className="leading-tight">
            <div className="text-[12px] font-semibold tracking-tight text-ink">
              Jamet Roy
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
              Patient
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
