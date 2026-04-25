"use client";

const lines = [
  { date: "03/14", desc: "Office Visit · Established", cpt: "99213", qty: "1", charge: "$210.00" },
  { date: "03/14", desc: "EKG · Routine", cpt: "93000", qty: "1", charge: "$150.00" },
  { date: "03/14", desc: "Venipuncture", cpt: "36415", qty: "1", charge: "$45.00" },
  { date: "03/14", desc: "CBC w/ Differential", cpt: "85025", qty: "1", charge: "$120.00" },
  { date: "03/14", desc: "Comprehensive Metabolic Panel", cpt: "80053", qty: "1", charge: "$180.00" },
  { date: "03/14", desc: "Lipid Panel", cpt: "80061", qty: "1", charge: "$150.00" },
  { date: "03/14", desc: "TSH · Thyroid Stimulating", cpt: "84443", qty: "1", charge: "$110.00" },
  { date: "03/14", desc: "Urinalysis · Routine", cpt: "81003", qty: "1", charge: "$75.00" },
];

export function EvidenceBill() {
  return (
    <div className="mx-auto max-w-[480px] rounded-[2px] border border-neutral-200 bg-white p-8 font-mono text-[10px] text-neutral-700 shadow-none">
      <header className="flex items-start justify-between border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[12px] font-semibold tracking-tight text-ink">
            Memorial Health Medical Center
          </div>
          <div className="mt-1 text-[10px] leading-[1.55] text-neutral-500">
            742 Evergreen Terrace
            <br />
            Springfield, IL 62704
            <br />
            (555) 123-4567
          </div>
        </div>
        <div className="rounded-[2px] border border-neutral-300 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          Patient Bill
        </div>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-4 border-b border-neutral-200 pb-4 text-[10px]">
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">Date</div>
          <div className="mt-1 text-ink">03/14/2026</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">Patient</div>
          <div className="mt-1 text-ink">J. Ramirez</div>
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">Account</div>
          <div className="mt-1 text-ink">BA-2026-1298</div>
        </div>
      </section>

      <table className="mt-5 w-full border-collapse text-[10px]">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-[8px] uppercase tracking-[0.16em] text-neutral-400">
            <th className="py-1.5 pr-2 font-normal">Date</th>
            <th className="py-1.5 pr-2 font-normal">Description</th>
            <th className="py-1.5 pr-2 font-normal">CPT</th>
            <th className="py-1.5 pr-2 font-normal text-right">Qty</th>
            <th className="py-1.5 font-normal text-right">Charges</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr
              key={i}
              className="border-b border-neutral-100 text-[9.5px] text-neutral-600"
            >
              <td className="py-1.5 pr-2">{l.date}</td>
              <td className="py-1.5 pr-2">{l.desc}</td>
              <td className="py-1.5 pr-2">{l.cpt}</td>
              <td className="py-1.5 pr-2 text-right">{l.qty}</td>
              <td className="py-1.5 text-right">{l.charge}</td>
            </tr>
          ))}
          <tr className="border-b border-rose-200 bg-rose-50/50 text-[10px] font-semibold text-ink">
            <td className="py-2 pr-2">03/14</td>
            <td className="py-2 pr-2 underline decoration-rose-400 decoration-2 underline-offset-[3px]">
              FACILITY FEE
            </td>
            <td className="py-2 pr-2 text-neutral-400">NA</td>
            <td className="py-2 pr-2 text-right">1</td>
            <td className="py-2 text-right">$8,450.00</td>
          </tr>
        </tbody>
      </table>

      <section className="mt-5 space-y-1.5 border-t border-neutral-200 pt-4 text-[10px]">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span className="text-ink">$9,490.00</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Insurance Adjustment</span>
          <span>−$1,200.00</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-[11px] font-semibold text-ink">
          <span>Patient Balance</span>
          <span>$8,290.00</span>
        </div>
      </section>

      <footer className="mt-6 border-t border-neutral-200 pt-4 text-[8px] uppercase tracking-[0.18em] text-neutral-400">
        Memorial Health Medical Center · Billing Dept · 555-123-4567
      </footer>
    </div>
  );
}
