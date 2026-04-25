import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BillFactsSchema, type BillFacts } from "./schema";
import { EXTRACTION_SYSTEM_PROMPT } from "./prompts";

const MODEL = "claude-haiku-4-5";

export async function extractBillFacts(
  pdf: Uint8Array,
  filename = "bill.pdf"
): Promise<BillFacts> {
  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: BillFactsSchema,
    schemaName: "BillFacts",
    schemaDescription:
      "Structured factual extraction of a US medical bill. Facts only — no legal conclusions.",
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: pdf,
            mediaType: "application/pdf",
            filename,
            providerOptions: {
              anthropic: { cacheControl: { type: "ephemeral" } },
            },
          },
          {
            type: "text",
            text: "Extract BillFacts from the attached bill.",
          },
        ],
      },
    ],
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  return object;
}
