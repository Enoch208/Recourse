"use client";

import type { BillFacts } from "@/lib/audit/schema";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

const shortDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  if (!m || !d) return iso;
  return `${m}/${d}`;
};

type Props = {
  facts?: BillFacts | null;
};

export function EvidenceBill({ facts }: Props) {
  if (!facts) {
    return (
      <div className="mx-auto flex h-full min-h-[420px] max-w-[480px] flex-col items-center justify-center rounded-[2px] border border-dashed border-neutral-300 bg-white p-8 text-center">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Awaiting bill
        </div>
        <div className="mt-2 max-w-[280px] text-[12px] text-neutral-500">
          Upload a bill or run the sample to see Recourse extract the facts.
        </div>
      </div>
    );
  }

  const itemSubtotal = facts.lineItems.reduce((sum, li) => sum + li.amount, 0);
  const adjustment = itemSubtotal - facts.totalBalance;

  return (
    <div className="mx-auto max-w-[480px] rounded-[2px] border border-neutral-200 bg-white p-8 font-mono text-[10px] text-neutral-700 shadow-none">
      <header className="flex items-start justify-between border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[12px] font-semibold tracking-tight text-ink">
            {facts.provider.name}
          </div>
          {facts.provider.address && (
            <div className="mt-1 whitespace-pre-line text-[10px] leading-[1.55] text-neutral-500">
              {facts.provider.address}
            </div>
          )}
        </div>
        <div className="rounded-[2px] border border-neutral-300 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          Patient Bill
        </div>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-4 border-b border-neutral-200 pb-4 text-[10px]">
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">
            Date
          </div>
          <div className="mt-1 text-ink">{formatDate(facts.dateOfService)}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">
            Patient
          </div>
          <div className="mt-1 text-ink">{facts.patient.name ?? "—"}</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">
            Account
          </div>
          <div className="mt-1 text-ink">{facts.patient.accountId ?? "—"}</div>
        </div>
      </section>

      <table className="mt-5 w-full border-collapse text-[10px]">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-[8px] uppercase tracking-[0.16em] text-neutral-400">
            <th className="py-1.5 pr-2 font-normal">Date</th>
            <th className="py-1.5 pr-2 font-normal">Description</th>
            <th className="py-1.5 pr-2 font-normal">CPT</th>
            <th className="py-1.5 pr-2 text-right font-normal">Qty</th>
            <th className="py-1.5 text-right font-normal">Charges</th>
          </tr>
        </thead>
        <tbody>
          {facts.lineItems.map((li, i) => {
            const flagged =
              /facility/i.test(li.description) || li.modifier === "59";
            return (
              <tr
                key={i}
                className={`border-b text-[9.5px] ${
                  flagged
                    ? "border-rose-200 bg-rose-50/50 text-ink"
                    : "border-neutral-100 text-neutral-600"
                }`}
              >
                <td className="py-1.5 pr-2">{shortDate(facts.dateOfService)}</td>
                <td
                  className={`py-1.5 pr-2 ${
                    flagged
                      ? "font-semibold underline decoration-rose-400 decoration-2 underline-offset-[3px]"
                      : ""
                  }`}
                >
                  {li.description}
                  {li.modifier && (
                    <span className="ml-1.5 rounded-sm bg-rose-50 px-1 text-[8.5px] font-semibold tracking-tight text-rose-700">
                      MOD {li.modifier}
                    </span>
                  )}
                </td>
                <td className="py-1.5 pr-2 text-neutral-500">
                  {li.cptCode ?? "NA"}
                </td>
                <td className="py-1.5 pr-2 text-right">{li.units ?? 1}</td>
                <td className="py-1.5 text-right">{usd(li.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="mt-5 space-y-1.5 border-t border-neutral-200 pt-4 text-[10px]">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span className="text-ink">{usd(itemSubtotal)}</span>
        </div>
        {Math.abs(adjustment) > 0.01 && (
          <div className="flex justify-between text-neutral-500">
            <span>{adjustment > 0 ? "Insurance Adjustment" : "Surcharge"}</span>
            <span>
              {adjustment > 0 ? "−" : "+"}
              {usd(Math.abs(adjustment))}
            </span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-[11px] font-semibold text-ink">
          <span>Patient Balance</span>
          <span>{usd(facts.totalBalance)}</span>
        </div>
      </section>

      <footer className="mt-6 border-t border-neutral-200 pt-4 text-[8px] uppercase tracking-[0.18em] text-neutral-400">
        {facts.provider.name} · Billing Dept
      </footer>
    </div>
  );
}
