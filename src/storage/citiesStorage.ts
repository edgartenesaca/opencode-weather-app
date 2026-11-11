import type { City } from "../types/City";
import type { Config } from "../types/Config";

/** PATCH con la ciudad agregada al final de la lista. */
export function addedCity(config: Config, city: City): Partial<Config> {
  return { cities: [...config.cities, city] };
}

/** PATCH con la ciudad eliminada; si era la default, la ciudad default se reinicia. */
export function removedCity(config: Config, city: City): Partial<Config> {
  return {
    cities: config.cities.filter((item) => item.id !== city.id),
    defaultCityId: config.defaultCityId === city.id ? null : config.defaultCityId,
  };
}

/** PATCH con la ciudad default elegida. */
export function defaultCitySet(cityId: number): Partial<Config> {
  return { defaultCityId: cityId };
}

export function findDefaultCity(config: Config): City | undefined {
  return config.cities.find((city) => city.id === config.defaultCityId);
}
