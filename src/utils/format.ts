import type { Unit } from "../types/Unit";
import { unitSymbol } from "./units";

/** Etiqueta del día: "hoy", "mañana" o el nombre corto del día de la semana. */
export function formatDay(date: string, index = 0): string {
  if (index === 0) {
    return "hoy";
  }

  if (index === 1) {
    return "mañana";
  }

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es", { weekday: "short", day: "numeric" }).format(parsed);
}

export function formatTemperature(value: number, unit: Unit): string {
  return `${value.toFixed(1)} ${unitSymbol(unit)}`;
}

export function formatTemperatureRange(max: number, min: number): string {
  return `${max.toFixed(1)}° / ${min.toFixed(1)}°`;
}
