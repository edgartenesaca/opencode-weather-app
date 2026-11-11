import { WeatherError } from "../errors";
import type { City, CurrentWeather, DailyForecast } from "../types";
import { toApiUnit, type Unit } from "../units";
import { fetchJson } from "./client";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const CURRENT_FIELDS = ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"];
const DAILY_FIELDS = ["weather_code", "temperature_2m_max", "temperature_2m_min"];
const DEFAULT_FORECAST_DAYS = 7;

interface ForecastResponse {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
  };
}

export async function getCurrentWeather(city: City, unit: Unit): Promise<CurrentWeather> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("current", CURRENT_FIELDS.join(","));
  url.searchParams.set("temperature_unit", toApiUnit(unit));
  url.searchParams.set("wind_speed_unit", "kmh");

  const data = await fetchJson<ForecastResponse>(url.toString());
  const current = data.current;

  if (!current || current.temperature_2m === undefined) {
    throw new WeatherError(`El servicio no devolvió la temperatura actual de ${city.name}.`);
  }

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    observedAt: current.time,
  };
}

export async function getDailyForecast(
  city: City,
  unit: Unit,
  days: number = DEFAULT_FORECAST_DAYS,
): Promise<DailyForecast[]> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("daily", DAILY_FIELDS.join(","));
  url.searchParams.set("forecast_days", String(days));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", toApiUnit(unit));

  const data = await fetchJson<ForecastResponse>(url.toString());
  const daily = data.daily;

  if (!daily?.time || daily.time.length === 0) {
    throw new WeatherError(`El servicio no devolvió el pronóstico de ${city.name}.`);
  }

  const forecast = daily.time
    .map((date, index): DailyForecast | undefined => {
      const max = daily.temperature_2m_max?.[index];
      const min = daily.temperature_2m_min?.[index];

      if (max === null || max === undefined || min === null || min === undefined) {
        return undefined;
      }

      return {
        date,
        max,
        min,
        weatherCode: daily.weather_code?.[index] ?? undefined,
      };
    })
    .filter((day): day is DailyForecast => day !== undefined);

  if (forecast.length === 0) {
    throw new WeatherError(`El servicio no devolvió el pronóstico de ${city.name}.`);
  }

  return forecast;
}
