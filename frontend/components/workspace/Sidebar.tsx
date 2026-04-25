"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  Invoice01Icon,
  BalanceScaleIcon,
  TickDouble02Icon,
  Settings02Icon,
  HelpCircleIcon,
  UploadIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type NavItem = {
  label: string;
  href: string;
  icon: IconSvgElement;
  active?: boolean;
  count?: number;
};

const primaryNav: NavItem[] = [
  { label: "Summary", href: "/workspace", icon: DashboardCircleIcon, active: true },
  { label: "Bills", href: "/workspace/bills", icon: Invoice01Icon, count: 8 },
  { label: "Statutes", href: "/workspace/statutes", icon: BalanceScaleIcon, count: 47 },
  { label: "Resolved", href: "/workspace/resolved", icon: TickDouble02Icon, count: 12 },
  { label: "Settings", href: "/workspace/settings", icon: Settings02Icon },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPANDED_WIDTH = 232;
const COLLAPSED_WIDTH = 72;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: 0.28, ease: EASE }}
      className="sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-neutral-200/70 bg-white"
    >
      <div
        className={`flex h-[60px] shrink-0 items-center ${
          collapsed ? "justify-center px-3" : "px-6"
        }`}
      >
        <Link href="/" aria-label="Recourse home" className="inline-flex items-center">
          {collapsed ? (
            <Image
              src="/logo.png"
              alt="Recourse"
              width={56}
              height={62}
              priority
              style={{ height: 24, width: "auto" }}
            />
          ) : (
            <Image
              src="/logo_with_text.png"
              alt="Recourse"
              width={1180}
              height={190}
              priority
              style={{ height: 20, width: "auto" }}
            />
          )}
        </Link>
      </div>

      <nav className="mt-5 flex flex-col gap-1 px-3">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            className={`group flex h-10 items-center rounded-[10px] text-[13px] tracking-tight transition-colors duration-150 ${
              collapsed ? "justify-center" : "justify-between px-3"
            } ${
              item.active
                ? "bg-emerald-50 text-emerald-700"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-ink"
            }`}
          >
            <span className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
              <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </span>
            {!collapsed && typeof item.count === "number" && (
              <span
                className={`font-mono text-[10px] tracking-[0.1em] ${
                  item.active ? "text-emerald-600" : "text-neutral-400"
                }`}
              >
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-4 px-3">
        <Link
          href="/workspace/audit"
          title={collapsed ? "Ingest a bill" : undefined}
          aria-label={collapsed ? "Ingest a bill" : undefined}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-amber-400 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors duration-150 hover:bg-amber-500"
        >
          <HugeiconsIcon icon={UploadIcon} size={13} strokeWidth={1.75} />
          {!collapsed && <span>Ingest a bill</span>}
        </Link>
      </div>

      <div className="mt-auto flex flex-col gap-1 px-3 pb-3">
        <Link
          href="#help"
          title={collapsed ? "Help center" : undefined}
          aria-label={collapsed ? "Help center" : undefined}
          className={`flex h-10 items-center rounded-[10px] text-[12.5px] text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 hover:text-ink ${
            collapsed ? "justify-center" : "gap-3 px-3"
          }`}
        >
          <HugeiconsIcon icon={HelpCircleIcon} size={15} strokeWidth={1.5} />
          {!collapsed && <span>Help center</span>}
        </Link>

        {!collapsed && (
          <div className="rounded-[12px] border border-neutral-100 bg-neutral-50/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.16)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">
                Statute Library
              </span>
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-ink">
              v1.4 <span className="text-emerald-600">· Verified</span>
            </div>
          </div>
        )}

        <div className="mt-1 border-t border-neutral-100 pt-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex h-9 w-full items-center rounded-[10px] text-[12px] text-neutral-400 transition-colors duration-150 hover:bg-neutral-50 hover:text-ink ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
          >
            <span
              className={`inline-flex transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.75} />
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
