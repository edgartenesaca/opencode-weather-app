import type { City, CurrentWeather, DailyForecast, Unit } from "../types";
import { unitSymbol } from "../units";
import { describeWeatherCode } from "../weather-codes";
import { cyan, yellow } from "./colors";

const LINE_WIDTH = 40;
const SEPARATOR = "═".repeat(LINE_WIDTH);
const DAY_WIDTH = 9;
const DESCRIPTION_WIDTH = 22;

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

export function renderDailyForecast(city: City, days: DailyForecast[], unit: Unit): string {
  const lines = [
    SEPARATOR,
    `  Pronóstico de ${days.length} días — ${cityLabel(city)} (${unitSymbol(unit)})`,
    SEPARATOR,
  ];

  days.forEach((day, index) => {
    const description =
      day.weatherCode === undefined ? undefined : describeWeatherCode(day.weatherCode);

    const icon = description?.icon ?? "·";
    const label = description?.label ?? "Sin datos";
    const temperatures = `${day.max.toFixed(1)}° / ${day.min.toFixed(1)}°`;

    lines.push(
      `  ${formatDay(day.date, index).padEnd(DAY_WIDTH)} ${icon}  ${label.padEnd(
        DESCRIPTION_WIDTH,
      )} ${temperatures}`,
    );
  });

  lines.push(SEPARATOR);

  return lines.join("\n");
}

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

function center(text: string): string {
  const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(padding) + text;
}
