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

**Tagline:** *You have recourse.* Turns confusing medical bills into statute-backed dispute letters in ~90 seconds by running a deterministic match between extracted bill facts and a hardcoded statute library (No Surprises Act, Reg E, etc.), then drafting a demand letter.

### The Audit Engine flow
1. **Fact extraction** — pull Date of Service, Provider, Amount, and line items (e.g. "Facility Fee") from the uploaded bill.
2. **Deterministic match** — compare extracted facts to `statutes.json` (hardcoded library, not LLM-judged).
3. **Audit Trail** — stream findings to the UI one fact at a time (typewriter effect) so the user sees the reasoning before the letter.
4. **Draft** — pass matched facts + statute citation to the letter generator.

Never render a finished letter without first showing the Audit Trail it was built from.

### Workspace layout
The core route is `/workspace`, a split screen: **40% left** is the document preview, **60% right** is the Audit Engine (stepper: Scan → Identify → Match → Draft, plus a persistent Statute Panel showing the verified statute library).

### Design system: "Runway Aesthetic" — institutional, paper-like, hyper-credible

Palette (hex, use with Tailwind arbitrary values or `@theme` tokens):
- Background `#FAFAFA` · Container `#FFFFFF` · Borders `#E5E7EB` (1px, no heavy shadows)
- Text primary `#111827` · secondary `#6B7280`
- Violation accent: `bg-red-50` / `text-red-700` · Match accent: `bg-emerald-50` / `text-emerald-700`

Typography:
- **Satoshi** (variable) for UI — wordmarks use Satoshi-Bold with `tracking-tighter`. Load via Fontshare CSS `@import`.
- **Geist Mono** / JetBrains Mono for citations and monetary values.

Icons: **Hugeicons** (`hugeicons-react`), outline variants, 1.5–2px stroke.

### Hard rules
- **No dark mode.** Legibility over theming.
- **No neon, gradients, glow effects, or purple/blue blurs** — avoid Web3 aesthetics.
- **No playful copy or emojis.** Use "Analyzing Document…", "Verifying Statute Match", not "Hacking your bill!".
- **No pill buttons.** Use `rounded-md` — feels like an official tool.
- **Redline accents for violations, verified-green for matches** — never invert.

### Demo artifact
A "Memorial Health" mock bill is the canonical demo input — the Kill Shot is the specific dollar amount recovered or platform fee avoided. Closing line: *"We don't provide legal advice; we provide a path to recourse."*

## Critical: Next.js 16 is not the Next.js in your training data

Per [frontend/AGENTS.md](frontend/AGENTS.md): APIs, conventions, and file structure may differ from earlier versions. **Before writing Next.js code, read the relevant guide under [frontend/node_modules/next/dist/docs/](frontend/node_modules/next/dist/docs/)** (organized as `01-app/`, `02-pages/`, `03-architecture/`, `04-community/`). Heed deprecation notices in those docs rather than relying on memorized patterns. The same applies to Tailwind v4 (no JS config) and React 19.
