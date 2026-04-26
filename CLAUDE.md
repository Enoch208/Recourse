# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

All code lives in [frontend/](frontend/). There is no backend in this repo yet. Run all `npm` commands from that directory.

## Commands

From [frontend/](frontend/):

- `npm run dev` — start the dev server on http://localhost:3000
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — ESLint (flat config in [frontend/eslint.config.mjs](frontend/eslint.config.mjs), extends `next/core-web-vitals` and `next/typescript`)

There is no test runner configured.

## Stack

- Next.js **16.2.4** (App Router) on React **19.2.4**
- Tailwind CSS **v4** via `@tailwindcss/postcss` (see [frontend/postcss.config.mjs](frontend/postcss.config.mjs)); no `tailwind.config.*` — v4 is CSS-first, configuration lives in [frontend/app/globals.css](frontend/app/globals.css) via `@theme` / `@import "tailwindcss"`.
- TypeScript 5, path alias `@/*` → [frontend/](frontend/) root (see [frontend/tsconfig.json](frontend/tsconfig.json))

## Product: Recourse

**Tagline:** *You have recourse.* Turns confusing medical bills into statute-backed dispute letters in ~30 seconds by running a deterministic match between extracted bill facts and a hardcoded statute library (No Surprises Act, Reg E, etc.), then drafting a demand letter.

### The Audit Engine flow
1. **Fact extraction** — pull Date of Service, Provider, Amount, and line items (e.g. "Facility Fee") from the uploaded bill.
2. **Deterministic match** — compare extracted facts to `statutes.json` (hardcoded library, not LLM-judged).
3. **Audit Trail** — stream findings to the UI one fact at a time (typewriter effect) so the user sees the reasoning before the letter.
4. **Draft** — pass matched facts + statute citation to the letter generator.

Never render a finished letter without first showing the Audit Trail it was built from.

### Workspace layout
The core route is `/workspace`, a split screen: **40% left** is the document preview, **60% right** is the Audit Engine (stepper: Scan → Identify → Match → Draft, plus a persistent Statute Panel showing the verified statute library).

### Design system: "Approachable Institutional" — consumer-friendly, polished, trustworthy

Recourse balances Pidulteun-tier consumer warmth with statute credibility. Reference points: **Wealthfront × Notion × Ramp** — light, calm, data-rich. Approachable enough that a patient feels safe; institutional enough that an advocate trusts the citations.

The **landing page and the audit terminal** stay institutional (paper-white, sharp 1px borders) because they sell credibility and review live legal documents. The **workspace dashboard, navigation surfaces, and product chrome** adopt the warmer pastel-card register.

Palette:
- Outer canvas (dashboard surfaces): `#EEF2FB` (soft periwinkle) or `#F5F7FA` (cool gray)
- Card surface: `#FFFFFF`
- Borders: `#E5E7EB` (1px) — used sparingly; soft shadows are allowed where they aid hierarchy: `shadow-[0_2px_8px_rgb(15_23_42/0.04)]`
- Text primary: `#111827` · Muted: `#6B7280`
- **Mint green** (positive / matches): `#10B981` family — `bg-emerald-50 / text-emerald-700`
- **Rose** (violations): `#F43F5E` family — `bg-rose-50 / text-rose-700`
- **Warm amber/yellow** (primary CTAs in product chrome): `#FBBF24` family — `bg-amber-400 hover:bg-amber-500`
- **Sky** (in-progress / neutral state): `bg-sky-50 / text-sky-700`

Radius:
- Cards: `rounded-2xl` (16px) for product chrome / dashboard
- Inline pills: `rounded-md` (6px)
- Big surface frames (the outer dashboard card): `rounded-3xl` (24px)

Typography:
- **Satoshi** for UI — load via Fontshare CSS `@import`. Wordmarks use Satoshi-Bold with `tracking-tighter`.
- **Editorial serif (Georgia)** sparingly, for emotional accents only — hero headline, eyebrow tagline, letter masthead.
- **Geist Mono / JetBrains Mono** strictly for legal citations and monetary values — never decoratively.

Icons: **Hugeicons** (`@hugeicons/react`), outline variants, 1.5px stroke, primary color `#111827` unless tinted by tone.

### Hard rules
- **No dark mode.** Legibility over theming.
- **No neon, no glow effects, no purple/blue blurs.** Tasteful pastel gradients on illustrations are fine; avoid anything that reads "Web3."
- **Adult, calm copy.** No "Let's go!" or "Boom!" or emojis. "Analyzing Document…" not "Hacking your bill!". Friendly is fine; childish is not.
- **Statute citations + dollar amounts always in mono.** Never sans.
- **Status colors are semantic, not decorative.** Rose = violation. Emerald = match. Amber = pending/warning. Sky = in-progress. Never invert.
- **The audit terminal and the demand letter remain institutional.** Sharp 1px borders, no shadows, mono everywhere. Friendly chrome, formal evidence.

### Demo artifact
A "Memorial Health" mock bill is the canonical demo input — the Kill Shot is the specific dollar amount recovered or platform fee avoided. Closing line: *"We don't provide legal advice; we provide a path to recourse."*

## Critical: Next.js 16 is not the Next.js in your training data

Per [frontend/AGENTS.md](frontend/AGENTS.md): APIs, conventions, and file structure may differ from earlier versions. **Before writing Next.js code, read the relevant guide under [frontend/node_modules/next/dist/docs/](frontend/node_modules/next/dist/docs/)** (organized as `01-app/`, `02-pages/`, `03-architecture/`, `04-community/`). Heed deprecation notices in those docs rather than relying on memorized patterns. The same applies to Tailwind v4 (no JS config) and React 19.
