import type { City } from "./City";
import type { Unit } from "./Unit";

export interface Config {
  unit: Unit;
  defaultCityId: number | null;
  cities: City[];
}
