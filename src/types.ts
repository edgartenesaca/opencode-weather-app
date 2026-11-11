import type { Unit } from "./units";

export type { Unit };

export interface City {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  humidity?: number;
  windSpeed?: number;
  weatherCode?: number;
  observedAt?: string;
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
  weatherCode?: number;
}

export interface Config {
  unit: Unit;
  defaultCityId: number | null;
  cities: City[];
}
