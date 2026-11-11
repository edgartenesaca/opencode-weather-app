import { describe, expect, test } from "bun:test";
import type { City, CurrentWeather } from "../src/types";
import { cityLabel, renderCityList, renderMenu, renderWeather } from "../src/ui/weather";
import { describeWeatherCode } from "../src/weather-codes";

const city: City = {
  id: 3658666,
  name: "Cuenca",
  admin1: "Azuay",
  country: "Ecuador",
  latitude: -2.8953,
  longitude: -78.9963,
};

const weather: CurrentWeather = {
  temperature: 14.37,
  humidity: 72,
  windSpeed: 9.4,
  weatherCode: 3,
};

describe("renderWeather", () => {
  test("muestra temperatura con la unidad indicada", () => {
    const output = renderWeather(city, weather, "celsius");

    expect(output).toContain("14.4 °C");
    expect(output).toContain("Cuenca, Azuay, Ecuador");
  });

  test("muestra descripción, humedad y viento cuando están disponibles", () => {
    const output = renderWeather(city, weather, "fahrenheit");

    expect(output).toContain("14.4 °F");
    expect(output).toContain("Cielo nublado");
    expect(output).toContain("Humedad: 72%");
    expect(output).toContain("Viento: 9.4 km/h");
  });

  test("omite los datos opcionales ausentes", () => {
    const output = renderWeather(city, { temperature: 3 }, "celsius");

    expect(output).toContain("3.0 °C");
    expect(output).not.toContain("Humedad");
    expect(output).not.toContain("Viento");
  });
});

describe("renderMenu", () => {
  test("lista las opciones con su número y etiqueta", () => {
    const output = renderMenu([
      { key: "1", label: "Clima de ciudad default" },
      { key: "9", label: "Salir" },
    ]);

    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("9. Salir");
    expect(output).toContain("WEATHER CLI");
  });
});

describe("renderCityList", () => {
  test("enumera las ciudades", () => {
    expect(renderCityList([city])).toBe("  1. Cuenca, Azuay, Ecuador");
  });
});

describe("cityLabel", () => {
  test("omite regiones vacías", () => {
    expect(cityLabel({ ...city, admin1: "", country: "" })).toBe("Cuenca");
  });
});

describe("describeWeatherCode", () => {
  test("traduce los códigos WMO conocidos", () => {
    expect(describeWeatherCode(0)?.label).toBe("Cielo despejado");
    expect(describeWeatherCode(95)?.label).toBe("Tormenta eléctrica");
  });

  test("devuelve undefined para códigos desconocidos", () => {
    expect(describeWeatherCode(123)).toBeUndefined();
  });
});
