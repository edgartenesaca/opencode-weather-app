import { WeatherError } from "../errors";
import type { City, CurrentWeather } from "../types";
import { toApiUnit, type Unit } from "../units";
import { fetchJson } from "./client";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const CURRENT_FIELDS = ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"];

interface ForecastResponse {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
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
