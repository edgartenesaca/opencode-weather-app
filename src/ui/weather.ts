import type { City, Unit } from "../types";
import { cyan, yellow } from "./colors";

const LINE_WIDTH = 40;
const SEPARATOR = "═".repeat(LINE_WIDTH);

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function renderMenu(citiesCount: number, unit: Unit): string {
  const lines = [
    SEPARATOR,
    center("WEATHER CLI"),
    SEPARATOR,
    "  1. Clima de ciudad default",
    `  2. Clima de todas las ciudades (${citiesCount})`,
    "  3. Buscar y agregar ciudad",
    "  4. Eliminar ciudad",
    "  5. Establecer ciudad default",
    `  8. Ajustes (${unitSymbol(unit)})`,
    "  9. Salir",
    SEPARATOR,
  ];

  return cyan(lines.join("\n"));
}

export function renderCityList(cities: City[]): string {
  const lines = cities.map((city, index) => `  ${index + 1}. ${cityLabel(city)}`);
  return lines.join("\n");
}

export function renderWeather(city: City, temperature: number, unit: Unit): string {
  return [
    SEPARATOR,
    `  ${cityLabel(city)}`,
    `  Temperatura: ${yellow(`${temperature.toFixed(1)} ${unitSymbol(unit)}`)}`,
    SEPARATOR,
  ].join("\n");
}

export function cityLabel(city: City): string {
  const regions = [city.admin1, city.country].filter((value) => value !== undefined && value !== "");
  return [city.name, ...regions].join(", ");
}

function center(text: string): string {
  const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(padding) + text;
}
