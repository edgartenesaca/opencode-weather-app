# AGENTS.md

## Overview

Console weather app (Spanish UI) built with Bun + TypeScript on OpenMeteo's APIs. The CLI is implemented: `index.ts` boots the app in `src/`.

## Commands

- Install: `bun install`
- Run: `bun run start` (or `bun run index.ts`)
- Build binary: `bun run build` → `./weather`
- Typecheck: `bun run typecheck` → `bun check` (uses `typescript` peerDependency, strictly strict tsconfig with `noUncheckedIndexedAccess`)

## Architecture / Flow

Two-step OpenMeteo flow (see README example URLs):
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=5&language=es&format=json` → lat/lon
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m`

No API key needed. No HTTP client dependency is installed — use Bun's built-in `fetch`.

```
index.ts              entrypoint
src/app.ts            menu loop + dispatch
src/actions.ts        one handler per menu option
src/config.ts         load/save config (XDG path) + validation
src/types.ts          City, Config, Unit
src/errors.ts         WeatherError
src/api/client.ts     fetch + timeout + error mapping
src/api/geocoding.ts  city search
src/api/forecast.ts   current temperature
src/ui/terminal.ts    line reader
src/ui/prompts.ts     index/yes-no prompts
src/ui/weather.ts     menu and weather rendering
```

Settings persist in `$XDG_CONFIG_HOME/weather-cli/config.json` (`~/.config/weather-cli/config.json` by default).

## Conventions

- User-facing strings (UI, menu, prompts) are in Spanish, matching the README's mock menu; code identifiers in English.
- Settings (default city, cities list, units) persist locally in JSON.
- Input is read through `src/ui/terminal.ts` (readline `line` events) instead of `readline/promises`, because Bun discards lines typed between questions.


- Puedes usar @bun-instruction para instrucciones de bun