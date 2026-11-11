import type { City } from "../types/City";
import { fetchJson } from "./client";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const RESULTS_COUNT = 5;

interface GeocodingResult {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function searchCities(name: string): Promise<City[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", name);
  url.searchParams.set("count", String(RESULTS_COUNT));
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const data = await fetchJson<GeocodingResponse>(url.toString());
  const results = data.results ?? [];

  return results.map((result) => ({
    id: result.id,
    name: result.name,
    admin1: result.admin1,
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
