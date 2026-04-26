import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA] lg:flex-row">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-neutral-200/70 bg-[#F5F7FA] p-10 lg:flex lg:w-[42%] xl:w-[44%] xl:p-14">
        <Link
          href="/"
          aria-label="Recourse home"
          className="relative z-10 inline-flex items-center"
        >
          <Image
            src="/logo_with_text.png"
            alt="Recourse"
            width={1180}
            height={190}
            priority
            style={{ height: 24, width: "auto" }}
          />
        </Link>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/side_img_auth.png"
            alt=""
            width={1254}
            height={1254}
            priority
            className="h-auto w-[64%] max-w-[440px]"
          />
        </div>

        <div className="relative z-10 max-w-[440px]">
          <p className="font-display text-[26px] leading-[1.2] tracking-tight text-ink">
            You have recourse.
          </p>
          <p className="mt-3 max-w-[400px] text-[13.5px] leading-relaxed text-neutral-600">
            Upload a medical bill. Recourse cites the statute, drafts the demand
            letter, and hands you a signed PDF — usually in under 90 seconds.
          </p>
          <div className="mt-6 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            <span>
              <span className="text-ink">$2,847</span> median refund
            </span>
            <span className="h-3 w-px bg-neutral-300" />
            <span>
              <span className="text-ink">73%</span> response rate
            </span>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            aria-label="Recourse home"
            className="inline-flex items-center lg:hidden"
          >
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
            className="ml-auto text-[12.5px] tracking-tight text-neutral-500 transition-colors hover:text-ink"
          >
            Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 sm:pt-8 lg:pb-16">
          {children}
        </div>
      </div>
    </div>
  );
}
