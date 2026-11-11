import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_CONFIG, getConfigPath, loadConfig, parseConfig, saveConfig } from "../src/config";

const validCity = {
  id: 3658666,
  name: "Cuenca",
  admin1: "Azuay",
  country: "Ecuador",
  latitude: -2.8953,
  longitude: -78.9963,
};

describe("parseConfig", () => {
  test("devuelve la configuración por defecto con valores no objeto", () => {
    expect(parseConfig(null)).toEqual(DEFAULT_CONFIG);
    expect(parseConfig("texto")).toEqual(DEFAULT_CONFIG);
    expect(parseConfig([])).toEqual(DEFAULT_CONFIG);
  });

  test("conserva una configuración válida", () => {
    const config = parseConfig({
      unit: "fahrenheit",
      defaultCityId: 3658666,
      cities: [validCity],
    });

    expect(config.unit).toBe("fahrenheit");
    expect(config.defaultCityId).toBe(3658666);
    expect(config.cities).toHaveLength(1);
  });

  test("descarta unidades desconocidas", () => {
    expect(parseConfig({ unit: "kelvin" }).unit).toBe("celsius");
  });

  test("descarta ciudades con campos inválidos", () => {
    const config = parseConfig({
      cities: [validCity, { id: "x", name: "Inventada" }, null],
    });

    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]?.name).toBe("Cuenca");
  });

  test("descarta la ciudad default si no está registrada", () => {
    const config = parseConfig({ defaultCityId: 999, cities: [validCity] });

    expect(config.defaultCityId).toBeNull();
  });
});

describe("ruta de configuración", () => {
  const originalXdg = process.env.XDG_CONFIG_HOME;
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "weather-cli-test-"));
    process.env.XDG_CONFIG_HOME = tempDir;
  });

  afterEach(() => {
    if (originalXdg === undefined) {
      delete process.env.XDG_CONFIG_HOME;
    } else {
      process.env.XDG_CONFIG_HOME = originalXdg;
    }
    rmSync(tempDir, { recursive: true, force: true });
  });

  test("usa XDG_CONFIG_HOME cuando está definido", () => {
    expect(getConfigPath()).toBe(join(tempDir, "weather-cli", "config.json"));
  });

  test("cae a ~/.config cuando XDG_CONFIG_HOME está vacío", () => {
    process.env.XDG_CONFIG_HOME = "   ";

    expect(getConfigPath()).toBe(join(homedir(), ".config", "weather-cli", "config.json"));
  });

  test("guarda y lee la configuración desde disco", () => {
    saveConfig({ unit: "fahrenheit", defaultCityId: 3658666, cities: [validCity] });

    const path = join(tempDir, "weather-cli", "config.json");
    expect(getConfigPath()).toBe(path);
    expect(loadConfig()).toEqual({
      unit: "fahrenheit",
      defaultCityId: 3658666,
      cities: [validCity],
    });
  });

  test("crea el directorio de configuración si no existe", () => {
    const nested = join(tempDir, "anidado");
    process.env.XDG_CONFIG_HOME = nested;

    saveConfig({ ...DEFAULT_CONFIG });

    expect(getConfigPath()).toBe(join(nested, "weather-cli", "config.json"));
  });

  test("usa la configuración por defecto si el archivo está dañado", () => {
    const dir = join(tempDir, "weather-cli");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "config.json"), "{ no es json", "utf8");

    expect(loadConfig()).toEqual(DEFAULT_CONFIG);
  });
});
