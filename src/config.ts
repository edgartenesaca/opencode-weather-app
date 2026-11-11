import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { City, Config, Unit } from "./types";

const APP_FOLDER = "weather-cli";
const CONFIG_FILE = "config.json";

export const DEFAULT_CONFIG: Config = {
  unit: "celsius",
  defaultCityId: null,
  cities: [],
};

export function getConfigPath(): string {
  const xdgBase = process.env.XDG_CONFIG_HOME?.trim();
  const baseDirectory = xdgBase ? xdgBase : join(homedir(), ".config");
  return join(baseDirectory, APP_FOLDER, CONFIG_FILE);
}

export function loadConfig(): Config {
  const path = getConfigPath();

  if (!existsSync(path)) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const raw = readFileSync(path, "utf8");
    return parseConfig(JSON.parse(raw) as unknown);
  } catch {
    console.warn(`  La configuración en ${path} está dañada. Se usará una configuración vacía.`);
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Config): void {
  const path = getConfigPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function parseConfig(raw: unknown): Config {
  if (!isRecord(raw)) {
    return { ...DEFAULT_CONFIG };
  }

  const cities = Array.isArray(raw.cities) ? raw.cities.filter(isCity) : [];
  const rawDefaultCityId = raw.defaultCityId;
  const defaultCityId =
    typeof rawDefaultCityId === "number" && cities.some((city) => city.id === rawDefaultCityId)
      ? rawDefaultCityId
      : null;

  return {
    unit: isUnit(raw.unit) ? raw.unit : DEFAULT_CONFIG.unit,
    defaultCityId,
    cities,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUnit(value: unknown): value is Unit {
  return value === "celsius" || value === "fahrenheit";
}

function isCity(value: unknown): value is City {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.country === "string" &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  );
}
