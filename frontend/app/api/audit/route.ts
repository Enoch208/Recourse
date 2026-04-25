import { NextRequest } from "next/server";
import { extractBillFacts } from "@/lib/audit/extract";
import { matchStatutes } from "@/lib/audit/statutes";
import { streamLetterDraft } from "@/lib/audit/draft";
import {
  MEMORIAL_HEALTH_FIXTURE,
  MEMORIAL_HEALTH_LETTER,
} from "@/lib/audit/fixtures";
import { encodeEvent, nowTs, type AuditEvent } from "@/lib/audit/events";
import type { BillFacts, Finding } from "@/lib/audit/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PDF_BYTES = 8 * 1024 * 1024; // 8 MB

async function parseRequest(
  req: NextRequest
): Promise<{ pdf?: Uint8Array; filename?: string; useFixture: boolean }> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { useFixture?: boolean };
    return { useFixture: !!body.useFixture };
  }

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("pdf");
    if (!(file instanceof File)) {
      throw new Error("Missing 'pdf' file in form data");
    }
    if (file.size > MAX_PDF_BYTES) {
      throw new Error(
        `PDF too large (${file.size} bytes); max is ${MAX_PDF_BYTES} bytes`
      );
    }
    const buf = new Uint8Array(await file.arrayBuffer());
    return { pdf: buf, filename: file.name, useFixture: false };
  }

  throw new Error(`Unsupported content-type: ${contentType}`);
}

function pause(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  let parsed: Awaited<ReturnType<typeof parseRequest>>;
  try {
    parsed = await parseRequest(req);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Bad request" },
      { status: 400 }
    );
  }

  // Real PDFs need Claude for extraction. The fixture path can fall back
  // to a cached letter, so it stays demo-safe even without a key.
  if (!process.env.ANTHROPIC_API_KEY && !parsed.useFixture) {
    return Response.json(
      {
        error:
          "ANTHROPIC_API_KEY is not configured. Add it to frontend/.env.local and restart the dev server.",
      },
      { status: 503 }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: AuditEvent) =>
        controller.enqueue(enc.encode(encodeEvent(event)));

      try {
        send({
          type: "log",
          phase: "scan",
          text: parsed.pdf
            ? `Detected document — ${parsed.filename ?? "uploaded bill"}`
            : "Loaded sample bill — Memorial Health Medical Center",
          ts: nowTs(),
        });
        await pause(300);

        let facts: BillFacts;
        if (parsed.pdf) {
          send({
            type: "log",
            phase: "extract",
            text: "Sending bill to extraction model (Claude Haiku 4.5)…",
            ts: nowTs(),
          });
          facts = await extractBillFacts(parsed.pdf, parsed.filename);
        } else {
          await pause(250);
          facts = MEMORIAL_HEALTH_FIXTURE;
        }

        send({ type: "facts", facts });

        if (facts.documentType === "other") {
          send({
            type: "log",
            phase: "extract",
            text: "Document does not appear to be a US medical billing artifact",
            ts: nowTs(),
          });
          send({
            type: "rejected",
            reason: "not_a_bill",
            message:
              "This document doesn't appear to be a medical bill, insurance EOB, or collections notice. Recourse currently audits these document types — try uploading a bill or denial letter.",
          });
          send({ type: "done" });
          return;
        }

        send({
          type: "log",
          phase: "extract",
          text: `Document recognized: ${facts.documentType.replace("_", " ")} · confidence ${facts.confidence}`,
          ts: nowTs(),
        });
        await pause(120);

        send({
          type: "log",
          phase: "extract",
          text: `Patient identified${
            facts.patient.name ? `: ${facts.patient.name}` : ""
          }${facts.patient.accountId ? ` · Account ${facts.patient.accountId}` : ""}`,
          ts: nowTs(),
        });
        await pause(180);

        send({
          type: "log",
          phase: "extract",
          text: `Date of service: ${facts.dateOfService} · Provider: ${facts.provider.name}`,
          ts: nowTs(),
        });
        await pause(180);

        send({
          type: "log",
          phase: "extract",
          text: `Total balance: $${facts.totalBalance.toFixed(2)} · ${facts.lineItems.length} line items`,
          ts: nowTs(),
        });
        await pause(220);

        send({
          type: "log",
          phase: "match",
          text: "Cross-referencing facts against the verified statute library (v1.4)",
          ts: nowTs(),
        });
        await pause(280);

        const findings: Finding[] = matchStatutes(facts);

        if (findings.length === 0) {
          send({
            type: "log",
            phase: "match",
            text: "No statute violations matched — bill appears compliant",
            ts: nowTs(),
          });
          send({ type: "verified-clean" });
        } else {
          for (const finding of findings) {
            send({
              type: "log",
              phase: "violation",
              text: finding.statuteTitle,
              citation: finding.statuteCode,
              amount:
                finding.recoverableAmount > 0
                  ? `$${finding.recoverableAmount.toFixed(2)}`
                  : undefined,
              ts: nowTs(),
            });
            await pause(220);
          }
        }

        send({ type: "findings", findings });

        if (findings.length > 0) {
          send({
            type: "log",
            phase: "draft",
            text: `Drafting demand letter — ${findings.length} citation${findings.length === 1 ? "" : "s"}`,
            ts: nowTs(),
          });

          send({ type: "draft-start" });

          let body = "";
          let draftFailed = false;
          try {
            const result = streamLetterDraft(facts, findings);
            for await (const delta of result.textStream) {
              body += delta;
              send({ type: "draft-token", token: delta });
            }
          } catch (draftErr) {
            draftFailed = true;
            console.error("Live draft failed, using cached letter:", draftErr);
          }

          // If the live draft failed AND we're on the bulletproof fixture path,
          // stream the cached Memorial Health letter so the demo never errors.
          if (draftFailed && parsed.useFixture) {
            body = "";
            const chunkSize = 32;
            for (let i = 0; i < MEMORIAL_HEALTH_LETTER.length; i += chunkSize) {
              const token = MEMORIAL_HEALTH_LETTER.slice(i, i + chunkSize);
              body += token;
              send({ type: "draft-token", token });
              await pause(40);
            }
          } else if (draftFailed) {
            send({
              type: "error",
              message:
                "The drafting model failed. Findings are still valid — try Run another audit.",
            });
            return;
          }

          send({ type: "draft-end", body });
        }

        send({ type: "done" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Audit pipeline failed";
        try {
          send({ type: "error", message });
        } catch {
          // controller may already be closed if the client disconnected
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed — safe to ignore
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}
