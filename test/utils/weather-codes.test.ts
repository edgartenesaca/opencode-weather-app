import { describe, expect, test } from "bun:test";
import { describeWeatherCode } from "../../src/utils/weatherCodes";

const KNOWN_CODES = [
  0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77,
  80, 81, 82, 85, 86, 95, 96, 99,
];

describe("describeWeatherCode", () => {
  test("describe códigos WMO conocidos", () => {
    expect(describeWeatherCode(0)).toEqual({ label: "Cielo despejado", icon: "☀️" });
    expect(describeWeatherCode(3)?.label).toBe("Cielo nublado");
    expect(describeWeatherCode(65)?.label).toBe("Lluvia intensa");
    expect(describeWeatherCode(99)?.label).toBe("Tormenta fuerte con granizo");
  });

  test("tiene descripción e ícono para cada código conocido", () => {
    for (const code of KNOWN_CODES) {
      const description = describeWeatherCode(code);
      expect(description?.label.length).toBeGreaterThan(0);
      expect(description?.icon.length).toBeGreaterThan(0);
    }
  });

  test("devuelve undefined para códigos desconocidos", () => {
    expect(describeWeatherCode(42)).toBeUndefined();
    expect(describeWeatherCode(-1)).toBeUndefined();
  });
});
