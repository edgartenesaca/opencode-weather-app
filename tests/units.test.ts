import { describe, expect, test } from "bun:test";
import { isUnit, nextUnit, toApiUnit, unitSymbol } from "../src/units";

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
