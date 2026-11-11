import { describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City";
import type { CurrentWeather, DailyForecast } from "../../src/types/Weather";
import { cityLabel, renderCityList, renderDailyForecast, renderWeather } from "../../src/presentation/output";
import { describeWeatherCode } from "../../src/utils/weatherCodes";

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

const days: DailyForecast[] = [
  { date: "2026-11-11", max: 6.9, min: 0.5, weatherCode: 3 },
  { date: "2026-11-12", max: 3.4, min: -0.2, weatherCode: 61 },
  { date: "2026-11-13", max: 5.8, min: -0.4, weatherCode: 0 },
];

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

describe("renderCityList", () => {
  test("enumera las ciudades", () => {
    expect(renderCityList([city])).toBe("  1. Cuenca, Azuay, Ecuador");
  });
});

describe("renderDailyForecast", () => {
  test("muestra encabezado, días y temperaturas", () => {
    const output = renderDailyForecast(city, days, "celsius");

    expect(output).toContain("Pronóstico de 3 días");
    expect(output).toContain("Cuenca, Azuay, Ecuador");
    expect(output).toContain("(°C)");
    expect(output).toContain("6.9° / 0.5°");
    expect(output).toContain("3.4° / -0.2°");
  });

  test("incluye la descripción del clima por código WMO", () => {
    const output = renderDailyForecast(city, days, "celsius");

    expect(output).toContain("Cielo nublado");
    expect(output).toContain("Lluvia ligera");
    expect(output).toContain("Cielo despejado");
  });

  test("omite la descripción cuando no hay código", () => {
    const output = renderDailyForecast(city, [{ date: "2026-11-11", max: 1, min: 0 }], "celsius");

    expect(output).toContain("Sin datos");
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
