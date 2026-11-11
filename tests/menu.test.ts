import { describe, expect, test } from "bun:test";
import { MENU } from "../src/menu";
import type { AppContext } from "../src/context";
import { DEFAULT_CONFIG } from "../src/config";

const ctx: AppContext = {
  terminal: {} as AppContext["terminal"],
  config: { ...DEFAULT_CONFIG },
  updateConfig: () => {},
};

describe("menú", () => {
  test("las claves son únicas", () => {
    const keys = MENU.map((option) => option.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  test("incluye la opción de salida", () => {
    const exit = MENU.find((option) => option.key === "9");

    expect(exit).toBeDefined();
    expect(exit && "exit" in exit).toBe(true);
  });

  test("las etiquetas reflejan el estado actual", () => {
    const citiesLabel = MENU.find((option) => option.key === "2");
    const unitLabel = MENU.find((option) => option.key === "8");

    expect(citiesLabel?.label(ctx)).toBe("Clima de todas las ciudades (0)");
    expect(unitLabel?.label(ctx)).toBe("Ajustes (°C)");
    expect(unitLabel?.label({ ...ctx, config: { ...ctx.config, unit: "fahrenheit" } })).toBe(
      "Ajustes (°F)",
    );
  });
});
