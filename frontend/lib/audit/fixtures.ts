import type { BillFacts } from "./schema";

// Pre-baked demand letter for the Memorial Health fixture. Used as a guaranteed
// fallback if the live Claude draft call fails — keeps the demo bulletproof.
export const MEMORIAL_HEALTH_LETTER = `This letter is submitted on behalf of the patient identified under account BA-2026-1298 at Memorial Health Medical Center, concerning services rendered on March 14, 2026, for which a total balance of $8,450.00 has been assessed. The billing record presents multiple violations of federal surprise billing protections and coding standards, each addressed in turn below.

Pursuant to NSA § 2799A-2, patient liability for out-of-network ancillary providers — including anesthesia, radiology, and pathology services — rendered at an in-network facility is capped at the applicable in-network cost-sharing amount. The bill reflects out-of-network charges for ancillary services at what qualifies as an in-network facility under the statute's protections, placing the full balance of $8,450.00 subject to mandatory repricing. Separately, NSA § 2799A-1 prohibits balance billing for out-of-network facility fees in emergency care settings absent a good-faith estimate and written patient consent. The facility fee of $1,850.00 appearing on this bill was assessed without either prerequisite, and the statute requires that this charge be voided or repriced to the in-network rate.

Additionally, one line item — procedure code 80053, a comprehensive metabolic panel, charged at $320.00 — bears CPT modifier 59 in a context that appears inconsistent with National Correct Coding Initiative edits governing routinely paired services. Under applicable coding standards, this charge is subject to rebundling review, with an estimated $160.00 in excess charges warranting correction by the payer or provider.

Memorial Health Medical Center is requested to provide a written response addressing each of the foregoing items within thirty (30) days of receipt of this letter.`;

export function memorialHealthLetterForUser(userName?: string | null): string {
  const trimmedName = userName?.trim();
  if (!trimmedName) return MEMORIAL_HEALTH_LETTER;

  return MEMORIAL_HEALTH_LETTER.replace(
    "This letter is submitted on behalf of the patient identified under account BA-2026-1298",
    `This letter is submitted by ${trimmedName} concerning account BA-2026-1298`
  );
}

export const MEMORIAL_HEALTH_FIXTURE: BillFacts = {
  documentType: "medical_bill",
  confidence: "high",
  provider: {
    name: "Memorial Health Medical Center",
    facility: "Memorial Health Medical Center",
    address: "742 Evergreen Terrace, Springfield, IL 62704",
  },
  patient: {
    name: "J. Ramirez",
    accountId: "BA-2026-1298",
  },
  dateOfService: "2026-03-14",
  billDate: "2026-04-02",
  totalBalance: 8450.0,
  lineItems: [
    {
      description: "Emergency Room — Level 4 visit",
      cptCode: "99284",
      amount: 2400.0,
    },
    { description: "Facility Fee", amount: 1850.0 },
    { description: "Out-of-network surcharge", amount: 600.0 },
    {
      description: "Imaging — CT Abdomen w/ contrast",
      cptCode: "74177",
      amount: 1900.0,
    },
    {
      description: "Anesthesia — moderate sedation",
      cptCode: "99152",
      amount: 1200.0,
    },
    {
      description: "Lab — comprehensive metabolic panel",
      cptCode: "80053",
      modifier: "59",
      amount: 320.0,
    },
    {
      description: "Lab — CBC with differential",
      cptCode: "85025",
      amount: 180.0,
    },
  ],
  flags: {
    hasFacilityFee: true,
    hasOutOfNetworkLanguage: true,
    hasGoodFaithEstimate: false,
    isCollectionNotice: false,
    isErEmergency: true,
    hasAnesthesiaRadiologyPathology: true,
    requestedItemization: false,
    hasModifier59: true,
  },
  notes:
    "Patient was treated in the ER for acute abdominal pain. Bill issued without prior good-faith estimate.",
};
