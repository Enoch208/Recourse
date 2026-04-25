import type { BillFacts, Finding } from "./schema";

export type AuditPhase = "scan" | "extract" | "match" | "violation" | "draft";

export type AuditEvent =
  | {
      type: "log";
      phase: AuditPhase;
      text: string;
      citation?: string;
      amount?: string;
      ts: string;
    }
  | { type: "facts"; facts: BillFacts }
  | { type: "findings"; findings: Finding[] }
  | { type: "draft-start" }
  | { type: "draft-token"; token: string }
  | { type: "draft-end"; body: string }
  | { type: "error"; message: string }
  | { type: "done" };

export function nowTs(): string {
  return new Date().toISOString().substring(11, 19);
}

export function encodeEvent(event: AuditEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}
