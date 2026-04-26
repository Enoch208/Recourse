import { getCurrentUser } from "@/lib/auth/server";
import { listAuditsForUser, type PublicAudit } from "@/lib/db/audits";
import {
  ResolvedClient,
  type ResolutionRow,
} from "@/components/workspace/ResolvedClient";

const MOCK_RESOLUTIONS: ResolutionRow[] = [
  {
    id: "mock-47812",
    auditId: "RCS-47812",
    facility: "Riverside Anesthesia Partners",
    closedOn: "04/02/2026",
    recovered: "$3,120.00",
    cited: "NSA § 2799A-2",
    outcome: "refunded",
    daysToClose: 11,
  },
  {
    id: "mock-47644",
    auditId: "RCS-47644",
    facility: "Chestnut Hills Surgical",
    closedOn: "03/19/2026",
    recovered: "$5,980.00",
    cited: "NSA § 2799A-1",
    outcome: "voided",
    daysToClose: 14,
  },
  {
    id: "mock-47521",
    auditId: "RCS-47521",
    facility: "Northland Cardiology",
    closedOn: "03/04/2026",
    recovered: "$1,240.00",
    cited: "FDCPA § 1692g",
    outcome: "voided",
    daysToClose: 6,
  },
  {
    id: "mock-47388",
    auditId: "RCS-47388",
    facility: "Beacon Imaging Group",
    closedOn: "02/24/2026",
    recovered: "$840.50",
    cited: "HIPAA § 164.524",
    outcome: "refunded",
    daysToClose: 9,
  },
  {
    id: "mock-47210",
    auditId: "RCS-47210",
    facility: "Crestview ER",
    closedOn: "02/11/2026",
    recovered: "$2,140.00",
    cited: "NSA § 2799A-1",
    outcome: "reduced",
    daysToClose: 17,
  },
  {
    id: "mock-47094",
    auditId: "RCS-47094",
    facility: "Lakeside Pathology",
    closedOn: "01/28/2026",
    recovered: "$1,500.00",
    cited: "ERISA § 503",
    outcome: "refunded",
    daysToClose: 8,
  },
];

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

function auditToResolution(a: PublicAudit): ResolutionRow {
  return {
    id: a.id,
    auditId: a.auditId,
    facility: a.facility ?? a.provider,
    closedOn: formatDate(a.createdAt.substring(0, 10)),
    recovered: usd(a.recoverableAmount),
    cited: a.citations[0] ?? "—",
    outcome: "refunded",
    daysToClose: 0,
  };
}

export default async function ResolvedPage() {
  const user = await getCurrentUser();
  if (!user) {
    const total = MOCK_RESOLUTIONS.reduce(
      (sum, r) => sum + parseFloat(r.recovered.replace(/[$,]/g, "")),
      0
    );
    return (
      <ResolvedClient
        resolutions={MOCK_RESOLUTIONS}
        totalRecovered={total}
      />
    );
  }
  const audits = await listAuditsForUser(user.id, { status: "resolved" });
  if (audits.length === 0) {
    return <ResolvedClient resolutions={[]} totalRecovered={0} empty />;
  }
  const rows = audits.map(auditToResolution);
  const total = audits.reduce((sum, a) => sum + a.recoverableAmount, 0);
  return <ResolvedClient resolutions={rows} totalRecovered={total} />;
}
