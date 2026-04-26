import {
  Analytics01Icon,
  ArrowRight04Icon,
  BalanceScaleIcon,
  Database02Icon,
  FileLinkIcon,
  FileVerifiedIcon,
  Hospital02Icon,
  Invoice01Icon,
  Legal01Icon,
  Legal02Icon,
  ReceiptDollarIcon,
  SignatureIcon,
  Stamp02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type Link = { label: string; href: string };
type ChipTone = "emerald" | "rose" | "amber" | "sky" | "violet" | "indigo";
type Chip = {
  code: string;
  label: string;
  status: string;
  tone: ChipTone;
};
type CaseBox = {
  ref: string;
  title: string;
  summary: string;
  primary: { label: string };
  secondary: { label: string };
};

export const brand = {
  name: "Recourse",
  tagline: "You have recourse.",
};

type Sponsor = {
  label: string;
  logo?: string;
  href?: string;
  showLabel?: boolean;
};

export const poweredBy = {
  eyebrow: "Powered by",
  sponsors: [
    {
      label: "Hack-Nation",
      logo: "/hacknation_logo.png",
      href: "https://hack-nation.ai",
      showLabel: true,
    },
    { label: "Anthropic" },
    { label: "Vercel" },
    { label: "Next.js" },
    { label: "OpenAI" },
  ] satisfies Sponsor[],
};

export const nav = {
  links: [
    { label: "Solution", href: "#solution" },
    { label: "Statutes", href: "#statutes" },
    { label: "For Advocates", href: "#advocates" },
  ] satisfies Link[],
  cta: { label: "Start audit", href: "/signup" },
  signIn: { label: "Sign in", href: "/login" },
};

export const hero = {
  eyebrow: "For patients and advocates",
  title: "You have recourse.\nWe draft it in 30 seconds.",
  description:
    "Upload a medical bill. Recourse cites the statute, drafts the demand letter, and hands you a signed PDF.",
  primary: { label: "Start audit", href: "/signup" },
  secondary: { label: "See the audit trail", href: "#solution" },
};

export const integrations = {
  eyebrow: "Document intake",
  title: "Every bill,\ntreated as evidence.",
  description:
    "Recourse ingests bills, EOBs, and collections notices — then extracts facts for the audit engine.",
  items: [
    { label: "Hospital bills", icon: Invoice01Icon, extracts: "Line items, CPT, dates" },
    { label: "Insurance EOBs", icon: FileVerifiedIcon, extracts: "Allowed, paid, balance" },
    { label: "Pharmacy receipts", icon: ReceiptDollarIcon, extracts: "NDC, copay, refills" },
    { label: "Collections", icon: Legal02Icon, extracts: "Notice date, amount" },
    { label: "Portal PDFs", icon: FileLinkIcon, extracts: "Invoice metadata" },
    { label: "Itemized bills", icon: Hospital02Icon, extracts: "Modifiers, NPI" },
  ] satisfies { label: string; icon: IconSvgElement; extracts: string }[],
};

export const useCases = {
  eyebrow: "Coverage",
  title: "Built on statute,\nnot on vibes.",
  description:
    "Every finding cites a specific rule. No hallucinated law. No speculation.",
  items: [
    {
      title: "Surprise billing",
      description:
        "Out-of-network facility fees and balance-billing violations under the No Surprises Act.",
      icon: BalanceScaleIcon,
      tone: "emerald" as const,
      chips: [
        { code: "NSA § 2799A-1", label: "Facility fee  $8,450", status: "Flag", tone: "rose" },
        { code: "NSA § 2799B-2", label: "Emergency visit", status: "Balance", tone: "amber" },
        { code: "ERISA 2719", label: "Appeal window open", status: "Notice", tone: "sky" },
        { code: "HIPAA § 164.524", label: "Itemized request", status: "Pending", tone: "emerald" },
      ] satisfies Chip[],
    },
    {
      title: "Billing errors",
      description:
        "Flags duplicate charges, upcoded CPT codes, and services billed after discharge.",
      icon: Analytics01Icon,
      tone: "sky" as const,
      chips: [
        { code: "CPT 99213", label: "Duplicate  × 2", status: "Flag", tone: "rose" },
        { code: "CPT 45378", label: "Upcode suspect", status: "High", tone: "amber" },
        { code: "MOD 59", label: "Unbundling", status: "Review", tone: "sky" },
        { code: "CMS-1500", label: "Post-discharge", status: "Notice", tone: "violet" },
      ] satisfies Chip[],
    },
    {
      title: "Collections disputes",
      description:
        "Drafts FDCPA validation letters before a medical debt reaches your credit file.",
      icon: Legal01Icon,
      tone: "violet" as const,
      caseBox: {
        ref: "FDCPA · 1692g",
        title: "Validation triage",
        summary:
          "Collector failed to issue § 1692g validation notice within five days of initial contact. Letter draft ready.",
        primary: { label: "Send validation" },
        secondary: { label: "Dismiss" },
      } satisfies CaseBox,
    },
    {
      title: "Insurance denials",
      description:
        "ERISA-grounded appeals with the clinical rationale already attached.",
      icon: FileVerifiedIcon,
      tone: "emerald" as const,
      chips: [
        { code: "ERISA § 503-1", label: "Internal appeal", status: "Drafted", tone: "emerald" },
        { code: "ACA § 2719", label: "External review", status: "Queued", tone: "sky" },
        { code: "HIPAA § 164.510", label: "Records request", status: "Notice", tone: "amber" },
        { code: "ACA § 1557", label: "Non-discrimination", status: "Match", tone: "emerald" },
      ] satisfies Chip[],
    },
  ],
};

export const automation = {
  eyebrow: "Protocol",
  title: "The audit protocol.",
  description:
    "Four deterministic stages. Every extracted fact traced to a statute. Every draft backed by a citation.",
  steps: [
    {
      step: "01",
      label: "SYS_READY",
      title: "Ingest & extract",
      description:
        "OCR maps unstructured bills into a standardized JSON schema — dates, providers, CPT codes, and amounts.",
      icon: Invoice01Icon,
      hint: `{ "dos": "03/14/2026", "cpt": "99213" }`,
    },
    {
      step: "02",
      label: "VERIFIED",
      title: "Statute matching",
      description:
        "Cross-references every line item against the verified federal statute library — deterministic, not inferred.",
      icon: Database02Icon,
      hint: "MATCH · 45 CFR § 149.610",
    },
    {
      step: "03",
      label: "STREAMING",
      title: "Audit trail",
      description:
        "Every rule, fact, and citation streams to the workspace for review before the letter is drafted.",
      icon: Stamp02Icon,
      hint: "→ § 1692g.validation.ready",
    },
    {
      step: "04",
      label: "READY",
      title: "Letter generation",
      description:
        "Compiles a statute-backed demand letter with named remedies and specific dollar amounts — signed, ready to send.",
      icon: SignatureIcon,
      hint: "DEMAND · 2 pages · signed",
    },
  ],
};

export const footer = {
  description:
    "Recourse turns confusing medical bills into statute-backed dispute letters. Not legal advice — a path to recourse.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Audit Engine", href: "#solution" },
        { label: "Statute Library", href: "#statutes" },
        { label: "Letter Studio", href: "#studio" },
        { label: "Changelog", href: "#journal" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "For Patients", href: "#patients" },
        { label: "For Advocates", href: "#advocates" },
        { label: "Trust Center", href: "#trust" },
        { label: "Contact", href: "#demo" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "#terms" },
        { label: "Privacy", href: "#privacy" },
        { label: "Not a law firm", href: "#disclaimer" },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  copyright: "© 2026 Recourse. All rights reserved.",
  arrowIcon: ArrowRight04Icon satisfies IconSvgElement,
};
