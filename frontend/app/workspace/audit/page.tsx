"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Download01Icon,
  PrinterIcon,
  UploadIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { EvidenceBill } from "@/components/workspace/EvidenceBill";
import {
  AuditStream,
  type LogEntry,
  type StreamState,
} from "@/components/workspace/AuditStream";
import type { AuditEvent } from "@/lib/audit/events";
import type { BillFacts, Finding } from "@/lib/audit/schema";

type Phase = "upload" | "running" | "done" | "error";

function generateAuditId() {
  return `RCS-${Math.floor(Math.random() * 90000) + 10000}`;
}

export default function AuditWorkstation() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [auditId, setAuditId] = useState<string>("");
  const [events, setEvents] = useState<LogEntry[]>([]);
  const [facts, setFacts] = useState<BillFacts | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [draftBody, setDraftBody] = useState("");
  const [streamState, setStreamState] = useState<StreamState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setPhase("upload");
    setFile(null);
    setAuditId("");
    setEvents([]);
    setFacts(null);
    setFindings([]);
    setDraftBody("");
    setStreamState("idle");
    setError(null);
  }, []);

  const handleEvent = useCallback((event: AuditEvent) => {
    switch (event.type) {
      case "log":
        setEvents((prev) => [
          ...prev,
          {
            ts: event.ts,
            phase: event.phase,
            text: event.text,
            citation: event.citation,
            amount: event.amount,
          },
        ]);
        break;
      case "facts":
        setFacts(event.facts);
        break;
      case "findings":
        setFindings(event.findings);
        break;
      case "draft-start":
        setStreamState("drafting");
        setDraftBody("");
        break;
      case "draft-token":
        setDraftBody((prev) => prev + event.token);
        break;
      case "draft-end":
        setDraftBody(event.body);
        break;
      case "error":
        setError(event.message);
        setStreamState("error");
        setPhase("error");
        break;
      case "done":
        setStreamState((prev) => (prev === "error" ? prev : "done"));
        setPhase((prev) => (prev === "error" ? prev : "done"));
        break;
    }
  }, []);

  const startAudit = useCallback(
    async (input: { pdf?: File; useFixture?: boolean }) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase("running");
      setStreamState("streaming");
      setEvents([]);
      setFacts(null);
      setFindings([]);
      setDraftBody("");
      setError(null);
      setAuditId(generateAuditId());

      try {
        let body: BodyInit;
        let headers: HeadersInit;
        if (input.pdf) {
          const form = new FormData();
          form.append("pdf", input.pdf);
          body = form;
          headers = {};
        } else {
          body = JSON.stringify({ useFixture: true });
          headers = { "content-type": "application/json" };
        }

        console.log("[audit] POST /api/audit starting", { useFixture: !input.pdf });
        const res = await fetch("/api/audit", {
          method: "POST",
          body,
          headers,
          signal: controller.signal,
        });

        console.log("[audit] response", res.status, res.headers.get("content-type"));

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("[audit] stream done", { chunksReceived: chunkCount });
            break;
          }
          chunkCount++;
          const text = decoder.decode(value, { stream: true });
          console.log("[audit] chunk", chunkCount, "bytes:", value?.byteLength);
          buf += text;
          const chunks = buf.split("\n\n");
          buf = chunks.pop() ?? "";
          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json) continue;
            try {
              const event = JSON.parse(json) as AuditEvent;
              console.log("[audit] event", event.type);
              handleEvent(event);
            } catch (e) {
              console.warn("[audit] parse error", e, "json:", json.substring(0, 200));
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Audit failed";
        setError(message);
        setStreamState("error");
        setPhase("error");
      }
    },
    [handleEvent]
  );

  const onPickFile = useCallback((f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onPickFile(f);
    },
    [onPickFile]
  );

  const downloadLetter = useCallback(() => {
    if (!facts || !draftBody) return;
    const today = new Date().toISOString().substring(0, 10);
    const citations = findings.map((f) => f.statuteCode).join(", ");
    const text = `RECOURSE — DEMAND LETTER
Reference: ${auditId || "—"}
Date: ${today}

To: ${facts.provider.name}
${facts.provider.address ?? ""}

Re: Account #${facts.patient.accountId ?? "—"} · DOS ${facts.dateOfService} · Amount in dispute $${facts.totalBalance.toFixed(2)}

${draftBody}

— ${facts.patient.name ?? "Patient"}
Drafted via Recourse · Citations: ${citations}
`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recourse-letter-${auditId || "draft"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [facts, draftBody, findings, auditId]);

  const printLetter = useCallback(() => {
    window.print();
  }, []);

  const showSplit = phase !== "upload";
  const isLetterReady = phase === "done" && draftBody.length > 0;

  return (
    <div className="min-h-screen bg-[#EEF2FB] p-4 lg:p-6">
      <div className="mx-auto flex h-[calc(100vh-32px)] max-w-[1440px] flex-col overflow-hidden rounded-[20px] border border-white/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.06)] lg:h-[calc(100vh-48px)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] tracking-tight text-neutral-600 transition-colors hover:border-neutral-400 hover:text-ink"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={12} strokeWidth={1.5} />
              Back
            </Link>
            <span className="h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-emerald-50 text-emerald-700">
                <span className="font-mono text-[10px] font-semibold">RCS</span>
              </span>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold tracking-tight text-ink">
                  {facts?.provider.name ?? "New audit"}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  {auditId
                    ? `Audit · ${auditId}${facts ? ` · DOS ${facts.dateOfService}` : ""}`
                    : "Awaiting bill"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showSplit && (
              <>
                <button
                  type="button"
                  onClick={printLetter}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink disabled:cursor-not-allowed disabled:border-neutral-100 disabled:bg-neutral-50 disabled:text-neutral-300"
                  aria-label="Print letter"
                  disabled={!isLetterReady}
                >
                  <HugeiconsIcon icon={PrinterIcon} size={14} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={downloadLetter}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-amber-400 px-3 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none"
                  disabled={!isLetterReady}
                >
                  <HugeiconsIcon
                    icon={Download01Icon}
                    size={13}
                    strokeWidth={1.75}
                  />
                  Download letter
                </button>
                <span className="h-4 w-px bg-neutral-200" />
              </>
            )}
            <div className="flex items-center gap-2 rounded-[10px] border border-neutral-100 bg-neutral-50/60 py-1 pl-1 pr-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fcd34d,#fb923c)] text-[10px] font-semibold tracking-tight text-white">
                JR
              </span>
              <div className="leading-tight">
                <div className="text-[11.5px] font-semibold tracking-tight text-ink">
                  J. Ramirez
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                  Patient
                </div>
              </div>
            </div>
          </div>
        </header>

        {showSplit ? (
          <div className="flex flex-1 min-h-0">
            <section
              aria-label="Evidence"
              className="w-2/5 shrink-0 overflow-y-auto border-r border-neutral-100 bg-[#F5F7FA] px-6 py-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                  Evidence
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                  {file?.name ?? "memorial_health_sample.pdf"}
                </span>
              </div>
              <EvidenceBill facts={facts} />
            </section>
            <section
              aria-label="Audit Engine"
              className="flex flex-1 min-w-0 flex-col bg-white"
            >
              <AuditStream
                facts={facts}
                events={events}
                findings={findings}
                draftBody={draftBody}
                state={streamState}
                error={error}
                onReplay={reset}
                auditId={auditId}
              />
            </section>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#F5F7FA] px-6 py-10">
            <UploadCard
              file={file}
              isDragging={isDragging}
              error={error}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onPick={() => fileInputRef.current?.click()}
              onFileChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickFile(f);
              }}
              onClear={() => setFile(null)}
              onRunUpload={() => file && startAudit({ pdf: file })}
              onRunSample={() => startAudit({ useFixture: true })}
              fileInputRef={fileInputRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type UploadCardProps = {
  file: File | null;
  isDragging: boolean;
  error: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onPick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onRunUpload: () => void;
  onRunSample: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

function UploadCard(props: UploadCardProps) {
  const {
    file,
    isDragging,
    error,
    onDragOver,
    onDragLeave,
    onDrop,
    onPick,
    onFileChange,
    onClear,
    onRunUpload,
    onRunSample,
    fileInputRef,
  } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[680px]"
    >
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700">
          New audit
        </div>
        <h1 className="font-display mt-2 text-[28px] font-semibold tracking-tight text-ink">
          Upload a medical bill
        </h1>
        <p className="mx-auto mt-2 max-w-[480px] text-[13px] leading-relaxed text-neutral-500">
          Recourse extracts the facts, runs them against the verified statute
          library, and drafts a demand letter — usually in under 90 seconds.
        </p>
      </div>

      <div className="mt-7 rounded-[16px] border border-neutral-200/70 bg-white p-6">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={file ? undefined : onPick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!file && (e.key === "Enter" || e.key === " ")) onPick();
          }}
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-6 py-8 text-center transition-colors ${
            isDragging
              ? "border-emerald-400 bg-emerald-50/40"
              : file
                ? "cursor-default border-emerald-200 bg-emerald-50/30"
                : "border-neutral-300 bg-neutral-50/40 hover:border-neutral-400 hover:bg-neutral-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="hidden"
          />
          {file ? (
            <>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  strokeWidth={2}
                />
              </span>
              <div className="mt-3 text-[14px] font-medium tracking-tight text-ink">
                {file.name}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                {(file.size / 1024).toFixed(1)} KB · ready to audit
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="mt-3 text-[11.5px] tracking-tight text-neutral-500 underline-offset-4 hover:text-ink hover:underline"
              >
                Choose a different file
              </button>
            </>
          ) : (
            <>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <HugeiconsIcon
                  icon={UploadIcon}
                  size={16}
                  strokeWidth={1.75}
                />
              </span>
              <div className="mt-3 text-[14px] font-medium tracking-tight text-ink">
                Drag a PDF here, or click to browse
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                Up to 8 MB · processed on Recourse servers, never stored long-term
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-rose-100 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onRunUpload}
          disabled={!file}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-amber-400 text-[13px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-amber-300 disabled:shadow-none"
        >
          Run audit
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-[12px] text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          or skip the upload
        </span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        onClick={onRunSample}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-neutral-200 bg-white text-[13px] tracking-tight text-ink transition-colors hover:border-neutral-400 hover:bg-neutral-50"
      >
        Try with the Memorial Health sample bill
      </button>

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
        Statute Library v1.4 · Verified
      </p>
    </motion.div>
  );
}
