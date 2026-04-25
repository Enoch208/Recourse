import type { BillFacts } from "./schema";

export const MEMORIAL_HEALTH_FIXTURE: BillFacts = {
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
