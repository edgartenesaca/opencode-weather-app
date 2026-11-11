import type { City, CurrentWeather, Unit } from "../types";
import { unitSymbol } from "../units";
import { describeWeatherCode } from "../weather-codes";
import { cyan, yellow } from "./colors";

const LINE_WIDTH = 40;
const SEPARATOR = "═".repeat(LINE_WIDTH);

export interface MenuEntry {
  key: string;
  label: string;
}

export function renderMenu(entries: MenuEntry[]): string {
  const options = entries.map((entry) => `  ${entry.key}. ${entry.label}`);
  const lines = [SEPARATOR, center("WEATHER CLI"), SEPARATOR, ...options, SEPARATOR];

  return cyan(lines.join("\n"));
}

export function renderCityList(cities: City[]): string {
  const lines = cities.map((city, index) => `  ${index + 1}. ${cityLabel(city)}`);

  return lines.join("\n");
}

export function renderWeather(city: City, weather: CurrentWeather, unit: Unit): string {
  const description =
    weather.weatherCode === undefined ? undefined : describeWeatherCode(weather.weatherCode);

  const lines = [
    SEPARATOR,
    `  ${cityLabel(city)}`,
    `  Temperatura: ${yellow(`${weather.temperature.toFixed(1)} ${unitSymbol(unit)}`)}`,
  ];

  if (description) {
    lines.push(`  Clima: ${description.icon} ${description.label}`);
  }

  if (weather.humidity !== undefined) {
    lines.push(`  Humedad: ${weather.humidity}%`);
  }

  if (weather.windSpeed !== undefined) {
    lines.push(`  Viento: ${weather.windSpeed} km/h`);
  }

  lines.push(SEPARATOR);

  return lines.join("\n");
}

export function cityLabel(city: City): string {
  const regions = [city.admin1, city.country].filter((value) => value !== undefined && value !== "");
  return [city.name, ...regions].join(", ");
}

function center(text: string): string {
  const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(padding) + text;
}
