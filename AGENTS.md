# AGENTS.md

## Overview

Console weather app (Spanish UI) built with Bun + TypeScript on OpenMeteo's APIs. The CLI is implemented: `index.ts` boots the app in `src/`.

## Commands

- Install: `bun install`
- Run: `bun run start` (or `bun run index.ts`)
- Build binary: `bun run build` → `./weather`
- Typecheck: `bun run typecheck` → `bun check` (uses `typescript` peerDependency, strictly strict tsconfig with `noUncheckedIndexedAccess`)
- Tests: `bun run test` → `bun test` (Bun test runner, files in `tests/`)

## Architecture / Flow

Two-step OpenMeteo flow (see README example URLs):
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=5&language=es&format=json` → lat/lon
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`

No API key needed. No HTTP client dependency is installed — use Bun's built-in `fetch`.

```
index.ts              entrypoint
src/app.ts            menu loop + dispatch (reads the MENU table)
src/menu.ts           declarative menu table (key, label, action)
src/actions.ts        one handler per menu option
src/context.ts        AppContext + createContext (single write path: updateConfig)
src/config.ts         load/save config (XDG path) + validation
src/types.ts          City, CurrentWeather, Config
src/units.ts          Unit type, symbols, API mapping, isUnit/nextUnit
src/weather-codes.ts  WMO code → description/icon
src/errors.ts         WeatherError
src/api/client.ts     fetch + timeout + error mapping
src/api/geocoding.ts  city search
src/api/forecast.ts   current weather (temperature, humidity, code, wind)
src/ui/terminal.ts    line reader
src/ui/prompts.ts     index/yes-no prompts
src/ui/spinner.ts     loading spinner (con fallback estático fuera de TTY)
src/ui/weather.ts     menu and weather rendering
tests/                bun test suites (config, units, menu, renderers)
```

Settings persist in `$XDG_CONFIG_HOME/weather-cli/config.json` (`~/.config/weather-cli/config.json` by default).

## Conventions

- User-facing strings (UI, menu, prompts) are in Spanish, matching the README's mock menu; code identifiers in English.
- Settings (default city, cities list, units) persist locally in JSON.
- Input is read through `src/ui/terminal.ts` (readline `line` events) instead of `readline/promises`, because Bun discards lines typed between questions.
- Adding a menu option = adding one entry to `MENU` in `src/menu.ts`; the menu rendering and dispatch are driven by that table.
- Config mutations go through `ctx.updateConfig(patch)`; never mutate `ctx.config` directly.
- Network calls are wrapped with `withSpinner(text, task)` from `src/ui/spinner.ts` so the UI always shows progress and never leaves a dangling spinner.


- Puedes usar @bun-instruction para instrucciones de bun