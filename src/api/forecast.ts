import { WeatherError } from "../errors";
import type { City, Unit } from "../types";
import { fetchJson } from "./client";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
  };
}

export async function getTemperature(city: City, unit: Unit): Promise<number> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("temperature_unit", unit);

  const data = await fetchJson<ForecastResponse>(url.toString());
  const temperature = data.current?.temperature_2m;

  if (temperature === undefined) {
    throw new WeatherError(`El servicio no devolvió la temperatura actual de ${city.name}.`);
  }

  return temperature;
}
