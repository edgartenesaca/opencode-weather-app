import { describe, expect, test } from "bun:test";
import { isUnit, nextUnit, toApiUnit, unitSymbol } from "../../src/utils/units";
import { formatDay, formatTemperature, formatTemperatureRange } from "../../src/utils/format";

describe("units", () => {
  test("reconoce unidades válidas", () => {
    expect(isUnit("celsius")).toBe(true);
    expect(isUnit("fahrenheit")).toBe(true);
    expect(isUnit("kelvin")).toBe(false);
    expect(isUnit(null)).toBe(false);
  });

  test("mapea unidades a su símbolo y valor de API", () => {
    expect(unitSymbol("celsius")).toBe("°C");
    expect(unitSymbol("fahrenheit")).toBe("°F");
    expect(toApiUnit("celsius")).toBe("celsius");
    expect(toApiUnit("fahrenheit")).toBe("fahrenheit");
  });

  test("alterna entre unidades", () => {
    expect(nextUnit("celsius")).toBe("fahrenheit");
    expect(nextUnit("fahrenheit")).toBe("celsius");
  });
});

describe("format", () => {
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

  test("formatea temperaturas con su unidad", () => {
    expect(formatTemperature(14.37, "celsius")).toBe("14.4 °C");
    expect(formatTemperature(14.37, "fahrenheit")).toBe("14.4 °F");
  });

  test("formatea el rango de temperaturas del pronóstico", () => {
    expect(formatTemperatureRange(6.9, 0.5)).toBe("6.9° / 0.5°");
  });
});
