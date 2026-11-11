import { describe, expect, test } from "bun:test";
import type { City, DailyForecast } from "../src/types";
import { formatDay, renderDailyForecast } from "../src/ui/weather";

const city: City = {
  id: 6094817,
  name: "Ottawa",
  admin1: "Ontario",
  country: "Canadá",
  latitude: 45.41117,
  longitude: -75.69812,
};

const days: DailyForecast[] = [
  { date: "2026-11-11", max: 6.9, min: 0.5, weatherCode: 3 },
  { date: "2026-11-12", max: 3.4, min: -0.2, weatherCode: 61 },
  { date: "2026-11-13", max: 5.8, min: -0.4, weatherCode: 0 },
];

describe("renderDailyForecast", () => {
  test("muestra encabezado, días y temperaturas", () => {
    const output = renderDailyForecast(city, days, "celsius");

    expect(output).toContain("Pronóstico de 3 días");
    expect(output).toContain("Ottawa, Ontario, Canadá");
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

describe("formatDay", () => {
  test("usa hoy y mañana para los dos primeros días", () => {
    expect(formatDay("2026-11-11", 0)).toBe("hoy");
    expect(formatDay("2026-11-12", 1)).toBe("mañana");
  });

  test("usa el día de la semana para el resto", () => {
    expect(formatDay("2026-11-13", 2)).toContain("13");
    expect(formatDay("2026-11-13", 2).length).toBeGreaterThan(2);
  });

  test("devuelve la fecha cruda si no es válida", () => {
    expect(formatDay("no-es-fecha", 3)).toBe("no-es-fecha");
  });
});
