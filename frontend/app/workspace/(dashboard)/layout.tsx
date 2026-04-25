import type { ReactNode } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 min-w-0 px-8 py-7 lg:px-12 lg:py-9">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
