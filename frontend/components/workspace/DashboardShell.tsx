"use client";

import { useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { Sidebar } from "@/components/workspace/Sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-ink shadow-sm transition-colors hover:border-neutral-400 lg:hidden"
      >
        <HugeiconsIcon icon={Menu01Icon} size={16} strokeWidth={1.75} />
      </button>

      <main className="min-w-0 flex-1 px-4 pb-8 pt-16 sm:px-6 sm:pt-7 lg:px-12 lg:py-9">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
