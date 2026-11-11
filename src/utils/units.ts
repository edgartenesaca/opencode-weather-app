import { UNITS, type Unit } from "../types/Unit";

const SYMBOLS: Record<Unit, string> = {
  celsius: "°C",
  fahrenheit: "°F",
};

const API_VALUES: Record<Unit, string> = {
  celsius: "celsius",
  fahrenheit: "fahrenheit",
};

export function isUnit(value: unknown): value is Unit {
  return typeof value === "string" && (UNITS as readonly string[]).includes(value);
}

export function unitSymbol(unit: Unit): string {
  return SYMBOLS[unit];
}

export function toApiUnit(unit: Unit): string {
  return API_VALUES[unit];
}

export function nextUnit(unit: Unit): Unit {
  return unit === "celsius" ? "fahrenheit" : "celsius";
}
