import type { City } from "../types/City";
import type { Unit } from "../types/Unit";
import type { CurrentWeather, DailyForecast } from "../types/Weather";
import { green, red, yellow } from "../utils/colors";
import { SEPARATOR } from "../utils/constants";
import { formatDay, formatTemperature, formatTemperatureRange } from "../utils/format";
import { unitSymbol } from "../utils/units";
import { describeWeatherCode } from "../utils/weatherCodes";

const DAY_WIDTH = 9;
const DESCRIPTION_WIDTH = 22;

export function renderWeather(city: City, weather: CurrentWeather, unit: Unit): string {
  const description =
    weather.weatherCode === undefined ? undefined : describeWeatherCode(weather.weatherCode);

  const lines = [
    SEPARATOR,
    `  ${cityLabel(city)}`,
    `  Temperatura: ${yellow(formatTemperature(weather.temperature, unit))}`,
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

export function renderCityList(cities: City[]): string {
  const lines = cities.map((city, index) => `  ${index + 1}. ${cityLabel(city)}`);

  return lines.join("\n");
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
    const temperatures = formatTemperatureRange(day.max, day.min);

    lines.push(
      `  ${formatDay(day.date, index).padEnd(DAY_WIDTH)} ${icon}  ${label.padEnd(
        DESCRIPTION_WIDTH,
      )} ${temperatures}`,
    );
  });

  lines.push(SEPARATOR);

  return lines.join("\n");
}

export function cityLabel(city: City): string {
  const regions = [city.admin1, city.country].filter((value) => value !== undefined && value !== "");
  return [city.name, ...regions].join(", ");
}

export function showError(message: string): void {
  console.log(red(`\n  ${message}\n`));
}

export function showSuccess(message: string): void {
  console.log(green(`\n  ${message}\n`));
}

export function showErrorDetail(message: string): void {
  console.log(red(`  ${message}`));
}
