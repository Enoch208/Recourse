import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" aria-label="Recourse home" className="inline-flex items-center">
          <Image
            src="/logo_with_text.png"
            alt="Recourse"
            width={1180}
            height={190}
            priority
            style={{ height: 22, width: "auto" }}
          />
        </Link>
        <Link
          href="/"
          className="text-[12.5px] tracking-tight text-neutral-500 transition-colors hover:text-ink"
        >
          Back to home
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        {children}
      </div>

      <footer className="border-t border-neutral-200/70 bg-white px-6 py-4 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          <span>256-bit encrypted · We never sell your data</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/" className="transition-colors hover:text-ink">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
