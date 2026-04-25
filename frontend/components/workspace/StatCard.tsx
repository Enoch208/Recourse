import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

type Props = {
  label: string;
  value: string;
  sublabel: string;
  icon: IconSvgElement;
  trend?: { delta: string; positive: boolean };
  verified?: boolean;
};

export function StatCard({
  label,
  value,
  sublabel,
  icon,
  trend,
  verified,
}: Props) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-ink">
          <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} />
        </span>
        <div className="flex items-center gap-1.5">
          {trend && (
            <span
              className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ring-1 ring-inset ${
                trend.positive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-rose-50 text-rose-700 ring-rose-100"
              }`}
            >
              {trend.delta}
            </span>
          )}
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="mt-7 font-mono text-[28px] leading-none tracking-tight text-ink">
        {value}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px]">
        <span className="font-mono uppercase tracking-[0.16em] text-neutral-500">
          {label}
        </span>
        <span className="text-neutral-300">·</span>
        <span className="text-neutral-500">{sublabel}</span>
      </div>
    </div>
  );
}
