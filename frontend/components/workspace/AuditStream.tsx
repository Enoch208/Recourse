"use client";

import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  TickDouble02Icon,
  Alert02Icon,
  ArrowRight01Icon,
  RefreshIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import type { AuditPhase } from "@/lib/audit/events";
import type { BillFacts, Finding } from "@/lib/audit/schema";

const EASE = [0.22, 1, 0.36, 1] as const;

export type LogEntry = {
  ts: string;
  phase: AuditPhase;
  text: string;
  citation?: string;
  amount?: string;
};

export type StreamState =
  | "idle"
  | "streaming"
  | "drafting"
  | "done"
  | "verified-clean"
  | "rejected"
  | "error";

type Props = {
  facts: BillFacts | null;
  events: LogEntry[];
  findings: Finding[];
  draftBody: string;
  state: StreamState;
  error?: string | null;
  rejectionMessage?: string | null;
  onReplay?: () => void;
  auditId?: string;
};

const phaseStyles: Record<
  AuditPhase,
  { tag: string; tagText: string; rail: string }
> = {
  scan: {
    tag: "border-neutral-100 bg-neutral-50 text-neutral-500",
    tagText: "Scan",
    rail: "bg-neutral-300",
  },
  extract: {
    tag: "border-neutral-100 bg-neutral-50 text-neutral-500",
    tagText: "Extract",
    rail: "bg-neutral-300",
  },
  match: {
    tag: "border-emerald-200 bg-emerald-50 text-emerald-700",
    tagText: "Match",
    rail: "bg-emerald-400",
  },
  violation: {
    tag: "border-rose-200 bg-rose-50 text-rose-700",
    tagText: "Violation",
    rail: "bg-rose-400",
  },
  draft: {
    tag: "border-neutral-300 bg-ink text-white",
    tagText: "Draft",
    rail: "bg-ink",
  },
};

function LogRow({ entry }: { entry: LogEntry }) {
  const s = phaseStyles[entry.phase];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="relative flex items-start gap-4 border-b border-neutral-100 px-6 py-3.5"
    >
      <span
        aria-hidden
        className={`absolute left-0 top-3.5 bottom-3.5 w-[2px] ${s.rail}`}
      />
      <span className="whitespace-nowrap pt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
        {entry.ts}
      </span>
      <span
        className={`inline-flex shrink-0 items-center gap-1 rounded-[3px] border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${s.tag}`}
      >
        {entry.phase === "match" && (
          <HugeiconsIcon icon={Tick02Icon} size={9} strokeWidth={2.5} />
        )}
        {entry.phase === "violation" && (
          <HugeiconsIcon icon={Alert02Icon} size={9} strokeWidth={2} />
        )}
        {s.tagText}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] leading-[1.55] text-ink">{entry.text}</div>
        {(entry.citation || entry.amount) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {entry.citation && (
              <span
                className={`inline-flex items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] ${
                  entry.phase === "violation"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {entry.citation}
              </span>
            )}
            {entry.amount && (
              <span className="font-mono text-[11px] tracking-tight text-ink">
                {entry.amount}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function DraftLetter({
  facts,
  findings,
  draftBody,
  isStreaming,
  onReplay,
  auditId,
}: {
  facts: BillFacts | null;
  findings: Finding[];
  draftBody: string;
  isStreaming: boolean;
  onReplay?: () => void;
  auditId?: string;
}) {
  if (!facts) return null;
  const today = new Date()
    .toISOString()
    .substring(0, 10)
    .split("-")
    .reverse()
    .join("/")
    .replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$2/$1/$3");
  const paragraphs = draftBody.split(/\n{2,}/).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex h-full flex-col items-center justify-start overflow-y-auto px-8 py-8"
    >
      <div className="w-full max-w-[560px] border border-neutral-100 bg-white p-9">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <div className="font-display text-[22px] tracking-tight text-ink">
              Recourse
            </div>
            <div className="font-display text-[10px] italic text-neutral-500">
              You have recourse.
            </div>
          </div>
          <div className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            {auditId && (
              <>
                REF · {auditId}
                <br />
              </>
            )}
            {today}
          </div>
        </div>

        <div className="mt-6 space-y-1 font-mono text-[10px] text-neutral-500">
          <div>To: {facts.provider.name}</div>
          {facts.provider.address && (
            <div className="whitespace-pre-line">{facts.provider.address}</div>
          )}
        </div>

        <div className="mt-5 border-y border-neutral-100 py-4 font-display text-[14px] leading-[1.5] text-ink">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Re:
          </span>{" "}
          {facts.patient.accountId && (
            <>Account #{facts.patient.accountId} · </>
          )}
          DOS {formatDate(facts.dateOfService)} · Amount in dispute{" "}
          <span className="font-mono">{usd(facts.totalBalance)}</span>
        </div>

        <div className="mt-5 space-y-4 font-display text-[12.5px] leading-[1.7] text-ink">
          {paragraphs.length === 0 && isStreaming && (
            <p className="italic text-neutral-400">Drafting…</p>
          )}
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p}
              {isStreaming && i === paragraphs.length - 1 && (
                <span className="ml-0.5 inline-block h-[12px] w-[6px] translate-y-[1px] animate-pulse bg-ink" />
              )}
            </p>
          ))}
        </div>

        {facts.patient.name && (
          <div className="mt-7 border-t border-neutral-100 pt-5">
            <div className="font-display text-[12.5px] italic text-ink">
              {facts.patient.name}
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              Patient · drafted via Recourse
            </div>
          </div>
        )}

        <footer className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
          <span>
            {findings.length} citation{findings.length === 1 ? "" : "s"} ·{" "}
            {findings
              .map((f) => f.statuteCode)
              .slice(0, 3)
              .join(" · ")}
          </span>
          <span>Page 1 of 2</span>
        </footer>
      </div>

      {!isStreaming && onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-6 inline-flex items-center gap-1.5 rounded-[3px] border border-neutral-100 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
        >
          <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.75} />
          Run another audit
        </button>
      )}
    </motion.div>
  );
}

function VerifiedCleanState({
  facts,
  onReplay,
}: {
  facts: BillFacts | null;
  onReplay?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex h-full flex-col items-center justify-center px-8 py-12 text-center"
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <HugeiconsIcon icon={TickDouble02Icon} size={22} strokeWidth={2} />
      </span>
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700">
        Verified Clean
      </div>
      <h3 className="mt-2 font-display text-[20px] tracking-tight text-ink">
        No statute violations detected
      </h3>
      <p className="mt-3 max-w-[420px] text-[13px] leading-relaxed text-neutral-500">
        {facts ? (
          <>
            This bill from <span className="text-ink">{facts.provider.name}</span>{" "}
            appears compliant with the federal protections Recourse audits — NSA,
            FDCPA, ERISA, and HIPAA.
          </>
        ) : (
          "This bill appears compliant with the federal protections Recourse audits — NSA, FDCPA, ERISA, and HIPAA."
        )}
      </p>
      <div className="mt-6 grid w-full max-w-[420px] grid-cols-2 gap-3 text-left">
        <div className="rounded-[12px] border border-neutral-200 bg-white p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Recoverable
          </div>
          <div className="mt-1 font-mono text-[18px] tracking-tight text-ink">
            $0.00
          </div>
        </div>
        <div className="rounded-[12px] border border-neutral-200 bg-white p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Library checked
          </div>
          <div className="mt-1 font-mono text-[12px] tracking-tight text-ink">
            v1.4 · 7 statutes
          </div>
        </div>
      </div>
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-6 inline-flex items-center gap-1.5 rounded-[3px] border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
        >
          <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.75} />
          Run another audit
        </button>
      )}
    </motion.div>
  );
}

function RejectedState({
  message,
  onReplay,
}: {
  message?: string | null;
  onReplay?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex h-full flex-col items-center justify-center px-8 py-12 text-center"
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.75} />
      </span>
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        Not Recognized
      </div>
      <h3 className="mt-2 font-display text-[20px] tracking-tight text-ink">
        We couldn&apos;t classify this document
      </h3>
      <p className="mt-3 max-w-[440px] text-[13px] leading-relaxed text-neutral-500">
        {message ??
          "Recourse currently audits US medical bills, EOBs, collections notices, and denial letters. Try uploading one of those."}
      </p>
      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-6 inline-flex items-center gap-1.5 rounded-[10px] bg-amber-400 px-4 py-2 text-[12px] font-semibold tracking-tight text-ink shadow-[0_2px_8px_rgb(251_191_36/0.35)] transition-colors hover:bg-amber-500"
        >
          <HugeiconsIcon icon={RefreshIcon} size={12} strokeWidth={1.75} />
          Try a different document
        </button>
      )}
    </motion.div>
  );
}

export function AuditStream({
  facts,
  events,
  findings,
  draftBody,
  state,
  error,
  rejectionMessage,
  onReplay,
  auditId,
}: Props) {
  const showDraft = state === "drafting" || state === "done";
  const showVerifiedClean = state === "verified-clean";
  const showRejected = state === "rejected";
  const isStreaming = state === "drafting";
  const totalRecoverable = findings.reduce(
    (sum, f) => sum + f.recoverableAmount,
    0
  );

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[20px] tracking-tight text-ink">
            Recourse Audit
          </h2>
          {showVerifiedClean ? (
            <>
              <span className="h-4 w-px bg-neutral-300" />
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                <HugeiconsIcon icon={TickDouble02Icon} size={11} strokeWidth={2} />
                Verified Clean
              </span>
            </>
          ) : showRejected ? (
            <>
              <span className="h-4 w-px bg-neutral-300" />
              <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                <HugeiconsIcon icon={Cancel01Icon} size={11} strokeWidth={1.75} />
                Not Recognized
              </span>
            </>
          ) : state !== "done" ? (
            <>
              <span className="h-4 w-px bg-neutral-300" />
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
                  state === "error" ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                <motion.span
                  className={`h-1.5 w-1.5 rounded-full ${
                    state === "error" ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  animate={
                    state === "streaming" || state === "drafting"
                      ? { opacity: [1, 0.35, 1] }
                      : { opacity: 1 }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {state === "error"
                  ? "Failed"
                  : state === "drafting"
                    ? "Drafting Letter"
                    : state === "streaming"
                      ? "Live Streaming"
                      : "Idle"}
              </span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          {totalRecoverable > 0 && (
            <span className="text-emerald-700">
              {usd(totalRecoverable)} recoverable
            </span>
          )}
          {totalRecoverable > 0 && (
            <span className="hidden h-4 w-px bg-neutral-300 sm:block" />
          )}
          {!showRejected && (
            <span>
              {findings.length} citation{findings.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto">
        {showVerifiedClean ? (
          <VerifiedCleanState facts={facts} onReplay={onReplay} />
        ) : showRejected ? (
          <RejectedState message={rejectionMessage} onReplay={onReplay} />
        ) : state === "error" ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-rose-600">
              Audit failed
            </div>
            <div className="mt-3 max-w-[360px] text-[13px] text-neutral-600">
              {error ?? "Something went wrong while running the pipeline."}
            </div>
            {onReplay && (
              <button
                type="button"
                onClick={onReplay}
                className="mt-5 inline-flex items-center gap-1.5 rounded-[3px] border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-ink"
              >
                <HugeiconsIcon icon={RefreshIcon} size={11} strokeWidth={1.75} />
                Try again
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {showDraft ? (
              <motion.div
                key="draft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="h-full"
              >
                <DraftLetter
                  facts={facts}
                  findings={findings}
                  draftBody={draftBody}
                  isStreaming={isStreaming}
                  onReplay={onReplay}
                  auditId={auditId}
                />
              </motion.div>
            ) : (
              <motion.div
                key="stream"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="border-t border-neutral-100"
              >
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 rounded-full border-2 border-neutral-200 border-t-emerald-500"
                    />
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      Connecting to audit engine
                    </div>
                    <div className="mt-1.5 max-w-[320px] text-[12px] text-neutral-400">
                      Streaming live findings — first events arrive in a few seconds.
                    </div>
                  </div>
                ) : (
                  events.map((entry, i) => (
                    <LogRow key={`${entry.ts}-${i}`} entry={entry} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-neutral-100 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
        <span>Statute Library v1.4 · Verified</span>
        <span className="inline-flex items-center gap-1.5">
          {state === "done"
            ? "Letter ready"
            : state === "drafting"
              ? "Drafting…"
              : state === "streaming"
                ? "Streaming…"
                : state === "error"
                  ? "Stopped"
                  : "Idle"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={1.5} />
        </span>
      </footer>
    </div>
  );
}
