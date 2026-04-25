import type { BillFacts, Finding, StatuteEvidence } from "./schema";

type Rule = {
  code: string;
  title: string;
  category: Finding["category"];
  trigger: string;
  remedy: string;
  match: (facts: BillFacts) => { evidence: StatuteEvidence[]; recoverable: number } | null;
};

const usd = (n: number) => `$${n.toFixed(2)}`;

const NSA_FACILITY_FEE: Rule = {
  code: "NSA § 2799A-1",
  title: "Out-of-network facility billing without consent",
  category: "NSA",
  trigger:
    "Facility fee charged for out-of-network care without good-faith estimate or written consent",
  remedy:
    "Charge must be voided or re-priced to in-network rate; balance billing prohibited",
  match: (facts) => {
    if (!facts.flags.hasFacilityFee) return null;
    if (facts.flags.hasGoodFaithEstimate) return null;
    if (!facts.flags.hasOutOfNetworkLanguage && !facts.flags.isErEmergency) return null;

    const facilityItems = facts.lineItems.filter((li) =>
      /facility/i.test(li.description)
    );
    if (facilityItems.length === 0) return null;
    const recoverable = facilityItems.reduce((sum, li) => sum + li.amount, 0);

    return {
      evidence: [
        {
          label: "Facility line item",
          value: facilityItems[0].description,
        },
        { label: "Charge", value: usd(facilityItems[0].amount) },
        { label: "Good-faith estimate", value: "Absent" },
        {
          label: "Network status",
          value: facts.flags.isErEmergency
            ? "Emergency care — protections apply regardless"
            : "Out-of-network",
        },
      ],
      recoverable,
    };
  },
};

const NSA_ANCILLARY: Rule = {
  code: "NSA § 2799A-2",
  title: "Out-of-network ancillary providers at in-network facility",
  category: "NSA",
  trigger:
    "Anesthesia, radiology, pathology, or similar ancillary provider billed out-of-network at an in-network facility",
  remedy: "Patient liability capped at in-network cost share",
  match: (facts) => {
    if (!facts.flags.hasAnesthesiaRadiologyPathology) return null;
    if (!facts.flags.hasOutOfNetworkLanguage) return null;
    return {
      evidence: [
        { label: "Provider type", value: "Ancillary (anesthesia / radiology / pathology)" },
        { label: "Network status", value: "Out-of-network" },
        { label: "Facility status", value: "In-network (per § 2799A-2 protections)" },
      ],
      recoverable: facts.totalBalance,
    };
  },
};

const NSA_GFE_VARIANCE: Rule = {
  code: "NSA § 2799B-3",
  title: "Good Faith Estimate variance",
  category: "NSA",
  trigger:
    "Final bill exceeds Good Faith Estimate by more than $400 for a self-pay patient",
  remedy:
    "Patient may dispute via Patient-Provider Dispute Resolution; charges above the GFE +$400 threshold may be voided",
  match: (facts) => {
    if (!facts.flags.hasGoodFaithEstimate) return null;
    return null;
  },
};

const FDCPA_VALIDATION: Rule = {
  code: "FDCPA § 1692g",
  title: "Validation of debts",
  category: "FDCPA",
  trigger:
    "Collection notice issued without itemized validation of the debt within 30 days",
  remedy: "Collection activity must cease until written validation is provided",
  match: (facts) => {
    if (!facts.flags.isCollectionNotice) return null;
    if (facts.lineItems.length >= 3) return null;
    return {
      evidence: [
        { label: "Notice type", value: "Collection / pre-collection" },
        { label: "Itemization", value: "Insufficient (no itemized validation present)" },
        { label: "Amount in dispute", value: usd(facts.totalBalance) },
      ],
      recoverable: facts.totalBalance,
    };
  },
};

const HIPAA_ITEMIZATION: Rule = {
  code: "HIPAA § 164.524",
  title: "Right to access itemized billing record",
  category: "HIPAA",
  trigger:
    "Provider has not produced an itemized statement after a patient request",
  remedy:
    "Itemization must be furnished within 30 days; OCR complaint eligible if denied",
  match: (facts) => {
    if (!facts.flags.requestedItemization) return null;
    if (facts.lineItems.length >= 5) return null;
    return {
      evidence: [
        { label: "Patient request", value: "On record" },
        { label: "Itemized statement", value: "Not provided" },
        { label: "Window", value: "30 days from request" },
      ],
      recoverable: 0,
    };
  },
};

const FDCPA_FALSE_AMOUNT: Rule = {
  code: "FDCPA § 1692e",
  title: "False or misleading representations",
  category: "FDCPA",
  trigger:
    "Amount claimed exceeds the itemized charges on the underlying bill",
  remedy: "Statutory damages up to $1,000 per violation; collection halted",
  match: (facts) => {
    if (!facts.flags.isCollectionNotice) return null;
    const itemTotal = facts.lineItems.reduce((sum, li) => sum + li.amount, 0);
    if (itemTotal === 0) return null;
    const overstatement = facts.totalBalance - itemTotal;
    if (overstatement <= 1) return null;
    return {
      evidence: [
        { label: "Sum of line items", value: usd(itemTotal) },
        { label: "Amount demanded", value: usd(facts.totalBalance) },
        { label: "Overstatement", value: usd(overstatement) },
      ],
      recoverable: overstatement,
    };
  },
};

const CPT_MODIFIER_59: Rule = {
  code: "CPT MOD 59",
  title: "Distinct procedural service modifier",
  category: "NSA",
  trigger:
    "CPT modifier 59 used to unbundle services that are routinely paired (NCCI edits)",
  remedy:
    "Charges may be re-bundled per NCCI edits; review by payer recommended",
  match: (facts) => {
    if (!facts.flags.hasModifier59) return null;
    const flagged = facts.lineItems.filter((li) => li.modifier === "59");
    if (flagged.length === 0) return null;
    return {
      evidence: [
        { label: "Line items with MOD 59", value: String(flagged.length) },
        {
          label: "First flagged item",
          value: `${flagged[0].cptCode ?? "—"} · ${flagged[0].description}`,
        },
        { label: "Charge subject to review", value: usd(flagged[0].amount) },
      ],
      recoverable: flagged.reduce((sum, li) => sum + li.amount, 0) * 0.5,
    };
  },
};

export const STATUTES: Rule[] = [
  NSA_FACILITY_FEE,
  NSA_ANCILLARY,
  NSA_GFE_VARIANCE,
  FDCPA_VALIDATION,
  FDCPA_FALSE_AMOUNT,
  HIPAA_ITEMIZATION,
  CPT_MODIFIER_59,
];

export function matchStatutes(facts: BillFacts): Finding[] {
  const findings: Finding[] = [];
  for (const rule of STATUTES) {
    const result = rule.match(facts);
    if (!result) continue;
    findings.push({
      statuteCode: rule.code,
      statuteTitle: rule.title,
      category: rule.category,
      trigger: rule.trigger,
      remedy: rule.remedy,
      evidence: result.evidence,
      recoverableAmount: result.recoverable,
    });
  }
  return findings;
}
