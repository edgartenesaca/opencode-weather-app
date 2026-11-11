export type Unit = "celsius" | "fahrenheit";

export interface City {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Config {
  unit: Unit;
  defaultCityId: number | null;
  cities: City[];
}
