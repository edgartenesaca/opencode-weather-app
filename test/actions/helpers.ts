import type { AppContext } from "../../src/types/AppContext";
import type { City } from "../../src/types/City";
import type { Config } from "../../src/types/Config";

export const buenosAires: City = {
  id: 3435910,
  name: "Buenos Aires",
  admin1: "Buenos Aires",
  country: "Argentina",
  latitude: -34.61315,
  longitude: -58.37735,
};

export const montreal: City = {
  id: 6077243,
  name: "Montreal",
  country: "Canadá",
  latitude: 45.50884,
  longitude: -73.58781,
};

export function buildConfig(overrides: Partial<Config> = {}): Config {
  return { unit: "celsius", defaultCityId: null, cities: [], ...overrides };
}

export interface ContextOptions {
  config?: Config;
  /** Respuestas que devuelve terminal.ask en orden. */
  answers?: string[];
}

export type TestContext = AppContext & { updates: Partial<Config>[] };

export function createContext(options: ContextOptions = {}): TestContext {
  const updates: Partial<Config>[] = [];
  let config = options.config ?? buildConfig();
  const pending = [...(options.answers ?? [])];

  const terminal = {
    ask: async () => pending.shift() ?? null,
  } as unknown as AppContext["terminal"];

  return {
    terminal,
    get config() {
      return config;
    },
    updateConfig(patch: Partial<Config>) {
      updates.push(patch);
      config = { ...config, ...patch };
    },
    updates,
  } as TestContext;
}

export function captureConsole(): { lines: string[]; restore(): void } {
  const lines: string[] = [];
  const original = console.log;

  console.log = (...args: unknown[]) => {
    lines.push(args.join(" "));
  };

  return {
    lines,
    restore: () => {
      console.log = original;
    },
  };
}

/** Quita los códigos ANSI para asertar texto plano. */
export function plain(lines: string[]): string {
  return lines.join("\n").replace(/\u001B\[[0-9;]*m/g, "");
}

const originalFetch = globalThis.fetch;

export function mockFetchJson(payload: unknown): void {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(payload), {
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
}

export function mockFetchQueue(responses: Array<() => Promise<Response>>): void {
  const queue = [...responses];

  globalThis.fetch = (async () => {
    const next = queue.shift();

    if (!next) {
      throw new Error("mockFetchQueue: no quedan respuestas");
    }

    return next();
  }) as unknown as typeof fetch;
}

export function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}

export const currentWeatherPayload = {
  current: {
    time: "2026-11-11T10:00",
    temperature_2m: 21.5,
    relative_humidity_2m: 62,
    weather_code: 0,
    wind_speed_10m: 9.1,
  },
};

export const dailyPayload = {
  daily: {
    time: ["2026-11-11", "2026-11-12"],
    weather_code: [0, 3],
    temperature_2m_max: [24.1, 22.3],
    temperature_2m_min: [14.2, 13.5],
  },
};
