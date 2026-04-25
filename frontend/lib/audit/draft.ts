import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import type { BillFacts, Finding } from "./schema";
import { DRAFT_SYSTEM_PROMPT, buildDraftUserPrompt } from "./prompts";

const MODEL = "claude-sonnet-4-6";

export function streamLetterDraft(facts: BillFacts, findings: Finding[]) {
  return streamText({
    model: anthropic(MODEL),
    system: DRAFT_SYSTEM_PROMPT,
    prompt: buildDraftUserPrompt(facts, findings),
    temperature: 0.2,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });
}
