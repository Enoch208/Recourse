import { getCurrentUser } from "@/lib/auth/server";
import { listAuditsForUser, type PublicAudit } from "@/lib/db/audits";
import { BillsClient, type BillRow } from "@/components/workspace/BillsClient";

const MOCK_BILLS: BillRow[] = [
  {
    id: "mock-48211",
    auditId: "RCS-48211",
    provider: "Memorial Health",
    facility: "Memorial Health Medical Center",
    dos: "03/14/2026",
    amount: "$8,450.00",
    flags: ["NSA § 2799A-1", "FDCPA § 1692g"],
    status: "active",
    href: "/workspace/audit",
  },
  {
    id: "mock-48184",
    auditId: "RCS-48184",
    provider: "Northwell Imaging",
    facility: "Northwell Diagnostic Imaging",
    dos: "02/27/2026",
    amount: "$2,140.00",
    flags: ["NSA § 2799A-1"],
    status: "drafting",
    href: "/workspace/audit",
  },
  {
    id: "mock-48102",
    auditId: "RCS-48102",
    provider: "Sunrise ER",
    facility: "Sunrise Emergency Group",
    dos: "02/19/2026",
    amount: "$1,210.00",
    flags: ["FDCPA § 1692g"],
    status: "active",
    href: "/workspace/audit",
  },
  {
    id: "mock-47988",
    auditId: "RCS-47988",
    provider: "Cedar Lab Co.",
    facility: "Cedar Reference Labs",
    dos: "02/04/2026",
    amount: "$640.50",
    flags: ["HIPAA § 164.524"],
    status: "drafting",
    href: "/workspace/audit",
  },
  {
    id: "mock-47812",
    auditId: "RCS-47812",
    provider: "Riverside Anesthesia",
    facility: "Riverside Anesthesia Partners",
    dos: "01/22/2026",
    amount: "$3,120.00",
    flags: ["NSA § 2799A-2", "ERISA § 503"],
    status: "resolved",
    href: "/workspace/audit",
  },
  {
    id: "mock-47644",
    auditId: "RCS-47644",
    provider: "Chestnut Hills",
    facility: "Chestnut Hills Surgical",
    dos: "01/08/2026",
    amount: "$5,980.00",
    flags: ["NSA § 2799A-1"],
    status: "resolved",
    href: "/workspace/audit",
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

function auditToRow(a: PublicAudit): BillRow {
  return {
    id: a.id,
    auditId: a.auditId,
    provider: a.provider,
    facility: a.facility ?? a.provider,
    dos: formatDate(a.dateOfService),
    amount: usd(a.totalBalance),
    flags: a.citations,
    status: a.status,
    href: "/workspace/audit",
  };
}

export default async function BillsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return <BillsClient bills={MOCK_BILLS} />;
  }
  const audits = await listAuditsForUser(user.id);
  if (audits.length === 0) {
    return <BillsClient bills={[]} empty />;
  }
  return <BillsClient bills={audits.map(auditToRow)} />;
}
