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
  Mail01Icon,
  ReceiptDollarIcon,
  SignatureIcon,
  SparklesIcon,
  Stamp02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type Link = { label: string; href: string };
type Chip = {
  code: string;
  label: string;
  status: string;
};

export const brand = {
  name: "Recourse",
  tagline: "You have recourse.",
};

export const nav = {
  links: [
    { label: "Solution", href: "#solution" },
    { label: "Statutes", href: "#statutes" },
    { label: "For Advocates", href: "#advocates" },
    { label: "Journal", href: "#journal" },
  ] satisfies Link[],
  cta: { label: "Request demo", href: "#demo" },
};

export const hero = {
  eyebrow: "For patients and advocates",
  title: "You have recourse.\nWe draft it in 90 seconds.",
  description:
    "Upload a medical bill. Recourse cites the statute, drafts the demand letter, and hands you a signed PDF.",
  primary: { label: "Request demo", href: "#demo" },
  secondary: { label: "See the audit trail", href: "#solution" },
};

export const integrations = {
  eyebrow: "Document intake",
  title: "Every bill,\ntreated as evidence.",
  description:
    "Recourse ingests bills, EOBs, and collections notices — then extracts facts for the audit engine.",
  items: [
    { label: "Hospital bills", icon: Invoice01Icon },
    { label: "Insurance EOBs", icon: FileVerifiedIcon },
    { label: "Pharmacy receipts", icon: ReceiptDollarIcon },
    { label: "Collections", icon: Legal02Icon },
    { label: "Portal PDFs", icon: FileLinkIcon },
    { label: "Itemized bills", icon: Hospital02Icon },
  ] satisfies { label: string; icon: IconSvgElement }[],
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
      tone: "rose" as const,
      chips: [
        { code: "NSA § 2799A-1", label: "Facility fee  $8,450", status: "Flag" },
        { code: "NSA § 2799B-2", label: "Emergency visit", status: "Balance" },
        { code: "ERISA 2719", label: "Appeal window open", status: "Notice" },
        { code: "HIPAA § 164.524", label: "Itemized request", status: "Pending" },
      ] satisfies Chip[],
    },
    {
      title: "Billing errors",
      description:
        "Flags duplicate charges, upcoded CPT codes, and services billed after discharge.",
      icon: Analytics01Icon,
      tone: "amber" as const,
      chips: [
        { code: "CPT 99213", label: "Duplicate  × 2", status: "Flag" },
        { code: "CPT 45378", label: "Upcode suspect", status: "Flag" },
        { code: "MOD 59", label: "Unbundling", status: "Review" },
        { code: "CMS-1500", label: "Post-discharge", status: "Flag" },
      ] satisfies Chip[],
    },
    {
      title: "Collections disputes",
      description:
        "Drafts FDCPA validation letters before a medical debt reaches your credit file.",
      icon: Legal01Icon,
      tone: "indigo" as const,
      chips: [
        { code: "FDCPA § 1692g", label: "Validation ready", status: "Ready" },
        { code: "FCRA § 1681s-2", label: "Credit hold", status: "Notice" },
        { code: "TCPA § 227", label: "Call log audit", status: "Armed" },
        { code: "CFPB § 1006", label: "Cease-communication", status: "Draft" },
      ] satisfies Chip[],
    },
    {
      title: "Insurance denials",
      description:
        "ERISA-grounded appeals with the clinical rationale already attached.",
      icon: FileVerifiedIcon,
      tone: "emerald" as const,
      chips: [
        { code: "ERISA § 503-1", label: "Internal appeal", status: "Drafted" },
        { code: "ACA § 2719", label: "External review", status: "Queued" },
        { code: "HIPAA § 164.510", label: "Records request", status: "Match" },
        { code: "ACA § 1557", label: "Non-discrimination", status: "Match" },
      ] satisfies Chip[],
    },
  ],
};

export const automation = {
  eyebrow: "The engine",
  title: "Four steps.\nFully auditable.",
  description:
    "Recourse shows its work before it drafts. Every letter ships with a reviewable audit trail.",
  steps: [
    {
      step: "01",
      title: "Scan the document",
      description:
        "Upload a bill. Recourse extracts dates, providers, CPT codes, and line items.",
      icon: Invoice01Icon,
    },
    {
      step: "02",
      title: "Match against statute",
      description:
        "Each fact compared against a hardcoded statute library. Deterministic, not guessed.",
      icon: Database02Icon,
    },
    {
      step: "03",
      title: "Verify the trail",
      description:
        "The audit streams to your screen. Review every rule, fact, and citation before the letter ships.",
      icon: Stamp02Icon,
    },
    {
      step: "04",
      title: "Draft the letter",
      description:
        "A signed, ready-to-send demand letter. Every claim backed by the exact statute.",
      icon: SignatureIcon,
    },
  ],
};

export const explore = {
  eyebrow: "Start here",
  title: "Explore Recourse.",
  description:
    "For everyone who has ever opened a medical bill and assumed there was nothing they could do.",
  cta: { label: "Request demo", href: "#demo" },
  floatingIcons: [
    SparklesIcon,
    SignatureIcon,
    BalanceScaleIcon,
    Mail01Icon,
    FileVerifiedIcon,
    Stamp02Icon,
  ] satisfies IconSvgElement[],
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
