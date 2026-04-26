import jsPDF from "jspdf";
import type { BillFacts, Finding } from "./schema";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

const todayUS = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

type LetterInput = {
  facts: BillFacts;
  findings: Finding[];
  body: string;
  auditId: string;
  userName?: string | null;
};

// US Letter, points: 612 x 792
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 64; // ~0.89"
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 56;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const COLOR_INK = [17, 24, 39] as const;
const COLOR_MUTED = [115, 115, 115] as const;
const COLOR_FAINT = [163, 163, 163] as const;
const COLOR_LINE = [229, 231, 235] as const;

function setColor(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}

function setDraw(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

export function buildLetterPdf({
  facts,
  findings,
  body,
  auditId,
  userName,
}: LetterInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let y = MARGIN_TOP;
  const signatureName = userName?.trim() || facts.patient.name || "User";

  // ── Masthead ────────────────────────────────────────────────────
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  setColor(doc, COLOR_INK);
  doc.text("Recourse", MARGIN_X, y + 16);

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  setColor(doc, COLOR_MUTED);
  doc.text("You have recourse.", MARGIN_X, y + 30);

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  setColor(doc, COLOR_FAINT);
  const refText = `REF · ${auditId}`;
  const dateText = todayUS();
  doc.text(refText, PAGE_W - MARGIN_X, y + 16, { align: "right" });
  doc.text(dateText, PAGE_W - MARGIN_X, y + 28, { align: "right" });

  y += 50;
  setDraw(doc, COLOR_LINE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 24;

  // ── To: ─────────────────────────────────────────────────────────
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  setColor(doc, COLOR_MUTED);
  doc.text(`To: ${facts.provider.name}`, MARGIN_X, y);
  y += 12;
  if (facts.provider.address) {
    const addrLines = facts.provider.address.split(/,\s*|\n/);
    for (const line of addrLines) {
      doc.text(line.trim(), MARGIN_X, y);
      y += 12;
    }
  }
  y += 14;

  // ── Re: ─────────────────────────────────────────────────────────
  setDraw(doc, COLOR_LINE);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 18;

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  setColor(doc, COLOR_MUTED);
  doc.text("RE:", MARGIN_X, y);

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  setColor(doc, COLOR_INK);
  const reBits: string[] = [];
  if (facts.patient.accountId) reBits.push(`Account #${facts.patient.accountId}`);
  reBits.push(`DOS ${formatDate(facts.dateOfService)}`);
  reBits.push(`Amount in dispute ${usd(facts.totalBalance)}`);
  doc.text(reBits.join(" · "), MARGIN_X + 22, y);

  y += 16;
  setDraw(doc, COLOR_LINE);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 22;

  // ── Body ────────────────────────────────────────────────────────
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  setColor(doc, COLOR_INK);

  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const lineHeight = 16;
  const paraGap = 10;

  for (const para of paragraphs) {
    const wrapped = doc.splitTextToSize(para, CONTENT_W) as string[];
    for (const line of wrapped) {
      if (y > PAGE_H - MARGIN_BOTTOM - 80) {
        doc.addPage();
        y = MARGIN_TOP;
      }
      doc.text(line, MARGIN_X, y);
      y += lineHeight;
    }
    y += paraGap;
  }

  // ── Signature ──────────────────────────────────────────────────
  if (y > PAGE_H - MARGIN_BOTTOM - 80) {
    doc.addPage();
    y = MARGIN_TOP;
  }
  y += 12;
  setDraw(doc, COLOR_LINE);
  doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 22;

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  setColor(doc, COLOR_INK);
  doc.text(signatureName, MARGIN_X, y);

  y += 14;
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  setColor(doc, COLOR_FAINT);
  doc.text("USER · DRAFTED VIA RECOURSE", MARGIN_X, y);

  // ── Footer (every page) ────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  const citations = findings.map((f) => f.statuteCode);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    setColor(doc, COLOR_FAINT);

    const footerY = PAGE_H - 32;
    setDraw(doc, COLOR_LINE);
    doc.line(MARGIN_X, footerY - 12, PAGE_W - MARGIN_X, footerY - 12);

    const citeText = `${citations.length} CITATION${citations.length === 1 ? "" : "S"} · ${citations.join(" · ")}`;
    const truncated =
      doc.getTextWidth(citeText) > CONTENT_W - 60
        ? `${citations.length} CITATION${citations.length === 1 ? "" : "S"}`
        : citeText;

    doc.text(truncated, MARGIN_X, footerY);
    doc.text(`PAGE ${i} OF ${totalPages}`, PAGE_W - MARGIN_X, footerY, {
      align: "right",
    });
  }

  return doc;
}

export function downloadLetterPdf(input: LetterInput): void {
  const doc = buildLetterPdf(input);
  doc.save(`recourse-letter-${input.auditId || "draft"}.pdf`);
}
