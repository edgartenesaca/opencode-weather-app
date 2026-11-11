import { describe, expect, test } from "bun:test";
import { findOption, menuEntries, renderMenu } from "../src/presentation/menu";
import { DEFAULT_CONFIG } from "../src/storage/settingsStorage";
import type { AppContext } from "../src/types/AppContext";

const ctx: AppContext = {
  terminal: {} as AppContext["terminal"],
  config: { ...DEFAULT_CONFIG },
  updateConfig: () => {},
};

describe("menú", () => {
  test("las claves son únicas", () => {
    const keys = menuEntries(ctx).map((entry) => entry.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  test("incluye la opción de salida", () => {
    const exit = findOption("9");

    expect(exit).toBeDefined();
    expect(exit && "exit" in exit).toBe(true);
  });

  test("las etiquetas reflejan el estado actual", () => {
    const citiesLabel = findOption("2");
    const unitLabel = findOption("8");

    expect(citiesLabel?.label(ctx)).toBe("Clima de todas las ciudades (0)");
    expect(unitLabel?.label(ctx)).toBe("Ajustes (°C)");
    expect(unitLabel?.label({ ...ctx, config: { ...ctx.config, unit: "fahrenheit" } })).toBe(
      "Ajustes (°F)",
    );
  });

  test("renderMenu lista las opciones con su número y etiqueta", () => {
    const output = renderMenu([
      { key: "1", label: "Clima de ciudad default" },
      { key: "9", label: "Salir" },
    ]);

    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("9. Salir");
    expect(output).toContain("WEATHER CLI");
  });
});
