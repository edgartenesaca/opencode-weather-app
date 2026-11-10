# AGENTS.md

## Overview

Console weather app (Spanish UI) built with Bun + TypeScript on OpenMeteo's APIs. Currently a scaffold (`index.ts` is the default `bun init` hello-world); the README describes the target app, not the current state.

## Commands

- Install: `bun install`
- Run: `bun run index.ts`
- Typecheck (the only existing check): `bun run typecheck` → `bun check` (uses `typescript` peerDependency, strictly strict tsconfig with `noUncheckedIndexedAccess`)

## Architecture / Flow

Two-step OpenMeteo flow (see README example URLs):
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json` → lat/lon
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m`

No API key needed. No HTTP client dependency is installed — use Bun's built-in `fetch`.

## Conventions

- User-facing strings (UI, menu, prompts) are in Spanish, matching the README's mock menu; code identifiers in English.
- Settings (default city, cities list, units) persist locally — no persistence library exists yet.


- Puedes usar @bun-instruction para instrucciones de bun