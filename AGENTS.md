# AGENTS.md

## Overview

Console weather app (Spanish UI) built with Bun + TypeScript on OpenMeteo's APIs. The CLI is implemented: `src/index.ts` is the entrypoint.

## Commands

- Install: `bun install`
- Run: `bun run start` (or `bun run src/index.ts`)
- Build binary: `bun run build` → `./weather`
- Typecheck: `bun run typecheck` → `bun check` (uses `typescript` peerDependency, strictly strict tsconfig with `noUncheckedIndexedAccess`)
- Tests: `bun run test` → `bun test` (Bun test runner, files in `test/`). El build (`bun run build`) corre typecheck + tests antes de compilar: si alguno falla, no se genera el binario.

## Architecture / Flow

Two-step OpenMeteo flow (see README example URLs):
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=5&language=es&format=json` → lat/lon
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
3. Daily forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`

No API key needed. No HTTP client dependency is installed — use Bun's built-in `fetch`.

```
src/
├── index.ts              entrypoint: menu loop + dispatch + createContext
├── actions/              one handler per user action
│   ├── getWeather.ts      clima de la ciudad default
│   ├── listCities.ts      clima de todas las ciudades
│   ├── addCity.ts         buscar y agregar ciudad
│   ├── removeCity.ts      eliminar ciudad
│   ├── setDefaultCity.ts  establecer ciudad default
│   ├── getForecast.ts     pronóstico de 7 días
│   └── changeUnit.ts      alternar °C/°F
├── presentation/         everything that touches the console
│   ├── menu.ts            MENU table + rendering + option lookup
│   ├── output.ts          renderers and user-facing messages
│   ├── input.ts           Terminal (line reader) + askIndex/confirm
│   └── spinner.ts         loading spinner (static fallback outside TTY)
├── storage/              local persistence
│   ├── settingsStorage.ts config.json: XDG path, load/save, validation
│   └── citiesStorage.ts   pure city helpers (add/remove/default) as config patches
├── types/                global contracts (one per file, PascalCase)
│   ├── AppContext.ts      terminal + config + updateConfig
│   ├── City.ts
│   ├── Config.ts
│   ├── MenuOption.ts
│   ├── Unit.ts
│   └── Weather.ts         CurrentWeather, DailyForecast
├── api/                  external integrations
│   ├── client.ts          fetch + timeout + error mapping
│   ├── geocoding.ts       city search
│   └── weather.ts         current weather + 7-day forecast
├── utils/                reusable helpers
│   ├── colors.ts          ANSI colors (disabled when stdout is not a TTY)
│   ├── constants.ts       line width, separators
│   ├── errors.ts          WeatherError
│   ├── format.ts          date/temperature formatters
│   ├── units.ts           unit symbols, API mapping, isUnit/nextUnit
│   └── weatherCodes.ts    WMO code → description/icon
test/                      espeja la estructura de src/ (un test por módulo)
├── actions/               un test por acción del menú + helpers.ts (ctx, mocks de fetch/terminal)
├── api/                   client, geocoding, weather
├── presentation/          menu, output, spinner
├── storage/               settings-storage, cities-storage
└── utils/                 units, errors, weather-codes
```

Settings persist in `$XDG_CONFIG_HOME/weather-cli/config.json` (`~/.config/weather-cli/config.json` by default).

## Conventions

- User-facing strings (UI, menu, prompts) are in Spanish, matching the README's mock menu; code identifiers in English.
- Settings (default city, cities list, units) persist locally in JSON.
- Input is read through `Terminal` in `src/presentation/input.ts` (readline `line` events) instead of `readline/promises`, because Bun discards lines typed between questions.
- Adding a menu option = new file in `src/actions/` + one entry in `MENU` in `src/presentation/menu.ts`; rendering and dispatch are driven by that table.
- Config mutations go through `ctx.updateConfig(patch)`; never mutate `ctx.config` directly. City changes come from the helpers in `src/storage/citiesStorage.ts`.
- Network calls are wrapped with `withSpinner(text, task)` from `src/presentation/spinner.ts` so the UI always shows progress and never leaves a dangling spinner.


- Puedes usar @bun-instruction para instrucciones de bun
