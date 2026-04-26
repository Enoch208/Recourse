import { getCurrentUser } from "@/lib/auth/server";
import { statuteHitsForUser } from "@/lib/db/audits";
import {
  StatutesClient,
  type StatuteEntry,
} from "@/components/workspace/StatutesClient";

const STATUTE_LIBRARY: Omit<StatuteEntry, "hits">[] = [
  {
    code: "NSA § 2799A-1",
    title: "Surprise out-of-network facility billing",
    category: "NSA",
    trigger:
      "Out-of-network facility fee charged for emergency or in-network-facility care without consent.",
    remedy: "Bill must be re-priced to in-network rate; balance billing void.",
  },
  {
    code: "NSA § 2799A-2",
    title: "Out-of-network ancillary providers",
    category: "NSA",
    trigger:
      "Anesthesia, radiology, pathology billed out-of-network at an in-network facility.",
    remedy: "Patient liability capped at in-network cost share.",
  },
  {
    code: "FDCPA § 1692g",
    title: "Validation of debts",
    category: "FDCPA",
    trigger:
      "Collection notice without itemized validation within 30 days of first contact.",
    remedy: "Collection activity must cease until validation provided.",
  },
  {
    code: "FDCPA § 1692e",
    title: "False or misleading representations",
    category: "FDCPA",
    trigger:
      "Amount claimed exceeds itemized charges, or threats of credit reporting before validation.",
    remedy: "Statutory damages up to $1,000 per violation.",
  },
  {
    code: "ERISA § 503",
    title: "Adverse benefit determination notice",
    category: "ERISA",
    trigger:
      "Plan denied a claim without specific reasons, plan provisions, or appeal rights.",
    remedy: "Claim must be reprocessed; full appeal rights restored.",
  },
  {
    code: "HIPAA § 164.524",
    title: "Right to access itemized billing record",
    category: "HIPAA",
    trigger:
      "Provider refuses or delays itemized statement of charges beyond 30 days.",
    remedy: "OCR complaint eligible; statutory penalties to provider.",
  },
  {
    code: "Reg E § 1005.11",
    title: "Error resolution for electronic transfers",
    category: "Reg E",
    trigger:
      "Unauthorized HSA/FSA debit or duplicate facility charge through patient portal.",
    remedy: "Provisional credit within 10 business days; full investigation.",
  },
  {
    code: "NSA § 2799B-3",
    title: "Good Faith Estimate variance",
    category: "NSA",
    trigger:
      "Final bill exceeds Good Faith Estimate by more than $400 for self-pay patient.",
    remedy: "Patient may dispute via Patient-Provider Dispute Resolution.",
  },
];

const MOCK_HITS: Record<string, number> = {
  "NSA § 2799A-1": 14,
  "NSA § 2799A-2": 6,
  "FDCPA § 1692g": 9,
  "FDCPA § 1692e": 4,
  "ERISA § 503": 5,
  "HIPAA § 164.524": 3,
  "Reg E § 1005.11": 2,
  "NSA § 2799B-3": 4,
};

export default async function StatutesPage() {
  const user = await getCurrentUser();

  if (!user) {
    const guestStatutes: StatuteEntry[] = STATUTE_LIBRARY.map((s) => ({
      ...s,
      hits: MOCK_HITS[s.code] ?? 0,
    }));
    return <StatutesClient statutes={guestStatutes} showHits />;
  }

  const hits = await statuteHitsForUser(user.id);
  const userStatutes: StatuteEntry[] = STATUTE_LIBRARY.map((s) => ({
    ...s,
    hits: hits[s.code] ?? 0,
  }));
  return <StatutesClient statutes={userStatutes} showHits />;
}
