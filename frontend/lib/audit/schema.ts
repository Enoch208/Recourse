import { z } from "zod";

export const LineItemSchema = z.object({
  description: z.string().describe("As printed on the bill, verbatim"),
  cptCode: z.string().optional().describe("5-digit CPT/HCPCS code if printed"),
  modifier: z.string().optional().describe("CPT modifier such as 59, 25, XU"),
  amount: z.number().describe("Charge for this line item in US dollars"),
  units: z.number().optional(),
});

export const DocumentTypeSchema = z.enum([
  "medical_bill",
  "eob",
  "collections_notice",
  "denial_letter",
  "other",
]);

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);

export const BillFactsSchema = z.object({
  documentType: DocumentTypeSchema.describe(
    "What kind of document this is. Use 'other' if it is not a US medical billing artifact (e.g. a recipe, resume, tax form, screenshot, foreign hospital bill)."
  ),
  confidence: ConfidenceSchema.describe(
    "Your confidence that the extracted facts are accurate. 'high' = all fields clearly readable; 'medium' = some inference required; 'low' = poor scan or ambiguous."
  ),
  provider: z.object({
    name: z.string().describe("Billing entity name as printed"),
    facility: z.string().optional().describe("Facility / hospital name if different"),
    address: z.string().optional(),
  }),
  patient: z.object({
    name: z.string().optional(),
    accountId: z.string().optional().describe("Patient account / reference number"),
  }),
  dateOfService: z
    .string()
    .describe("ISO date YYYY-MM-DD; if a range, use the start date"),
  billDate: z.string().optional().describe("ISO date the bill was issued"),
  totalBalance: z.number().describe("Total amount due in US dollars"),
  lineItems: z.array(LineItemSchema),
  flags: z
    .object({
      hasFacilityFee: z
        .boolean()
        .describe("A line item includes the words 'facility fee' or equivalent"),
      hasOutOfNetworkLanguage: z
        .boolean()
        .describe(
          "Bill or notice references out-of-network, non-participating, or balance-billing"
        ),
      hasGoodFaithEstimate: z
        .boolean()
        .describe(
          "Bill references a Good Faith Estimate or shows the GFE was provided"
        ),
      isCollectionNotice: z
        .boolean()
        .describe(
          "Document is a collection or pre-collection notice, not a bill"
        ),
      isErEmergency: z
        .boolean()
        .describe("Service was emergency / ER, regardless of in-network status"),
      hasAnesthesiaRadiologyPathology: z
        .boolean()
        .describe(
          "Bill is from anesthesia, radiology, pathology, or other ancillary providers"
        ),
      requestedItemization: z
        .boolean()
        .describe(
          "Patient previously requested itemized statement and provider has not produced one"
        ),
      hasModifier59: z
        .boolean()
        .describe(
          "Any line item carries CPT modifier 59 (distinct procedural service)"
        ),
    })
    .describe("Structural flags inferred from the bill — facts only, never legal conclusions"),
  notes: z
    .string()
    .optional()
    .describe(
      "Any short text from the bill that is relevant context but not captured above"
    ),
});

export type LineItem = z.infer<typeof LineItemSchema>;
export type BillFacts = z.infer<typeof BillFactsSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;

export type Category = "NSA" | "FDCPA" | "ERISA" | "HIPAA" | "Reg E";

export type StatuteEvidence = {
  label: string;
  value: string;
};

export type Finding = {
  statuteCode: string;
  statuteTitle: string;
  category: Category;
  trigger: string;
  remedy: string;
  evidence: StatuteEvidence[];
  recoverableAmount: number;
};

export type LetterDraft = {
  citations: string[];
  refundClaimed: number;
  body: string;
};
