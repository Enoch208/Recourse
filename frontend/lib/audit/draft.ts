import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import type { BillFacts, Finding } from "./schema";
import {
  DRAFT_SYSTEM_PROMPT,
  buildDraftUserPrompt,
  type DraftContext,
} from "./prompts";

const MODEL = "claude-sonnet-4-6";

export function streamLetterDraft(
  facts: BillFacts,
  findings: Finding[],
  context?: DraftContext
) {
  return streamText({
    model: anthropic(MODEL),
    system: DRAFT_SYSTEM_PROMPT,
    prompt: buildDraftUserPrompt(facts, findings, context),
    temperature: 0.2,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });
}
