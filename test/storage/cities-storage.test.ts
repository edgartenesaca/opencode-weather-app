import { describe, expect, test } from "bun:test";
import { addedCity, defaultCitySet, findDefaultCity, removedCity } from "../../src/storage/citiesStorage";
import type { City } from "../../src/types/City";
import type { Config } from "../../src/types/Config";

const city: City = {
  id: 6094817,
  name: "Ottawa",
  admin1: "Ontario",
  country: "Canadá",
  latitude: 45.41117,
  longitude: -75.69812,
};

const other: City = {
  id: 3658666,
  name: "Cuenca",
  admin1: "Azuay",
  country: "Ecuador",
  latitude: -2.8953,
  longitude: -78.9963,
};

const config: Config = {
  unit: "celsius",
  defaultCityId: city.id,
  cities: [city, other],
};

describe("addedCity", () => {
  test("agrega la ciudad al final de la lista", () => {
    const patch = addedCity(config, { ...city, id: 1, name: "Nueva" });

    expect(patch.cities).toHaveLength(3);
    expect(patch.cities?.at(-1)?.name).toBe("Nueva");
  });
});

describe("removedCity", () => {
  test("elimina la ciudad de la lista", () => {
    const patch = removedCity(config, city);

    expect(patch.cities).toHaveLength(1);
    expect(patch.cities?.[0]?.name).toBe("Cuenca");
  });

  test("reinicia la ciudad default si era la eliminada", () => {
    expect(removedCity(config, city).defaultCityId).toBeNull();
  });

  test("conserva la ciudad default si era otra", () => {
    expect(removedCity(config, other).defaultCityId).toBe(city.id);
  });
});

describe("defaultCitySet", () => {
  test("establece la ciudad default", () => {
    expect(defaultCitySet(other.id)).toEqual({ defaultCityId: other.id });
  });
});

describe("findDefaultCity", () => {
  test("devuelve la ciudad default configurada", () => {
    expect(findDefaultCity(config)?.name).toBe("Ottawa");
  });

  test("devuelve undefined si no hay ciudad default", () => {
    expect(findDefaultCity({ ...config, defaultCityId: null })).toBeUndefined();
  });
});
