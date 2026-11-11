import { afterEach, describe, expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities";
import {
  buenosAires,
  buildConfig,
  captureConsole,
  createContext,
  currentWeatherPayload,
  mockFetchJson,
  mockFetchQueue,
  montreal,
  plain,
  restoreFetch,
} from "./helpers";

afterEach(() => {
  restoreFetch();
});

describe("listCities", () => {
  test("avisa si no hay ciudades registradas", async () => {
    const ctx = createContext();
    const consoleSpy = captureConsole();

    await listCities(ctx);
    consoleSpy.restore();

    expect(plain(consoleSpy.lines)).toContain("No hay ciudades registradas");
  });

  test("muestra el clima de todas las ciudades", async () => {
    mockFetchJson(currentWeatherPayload);
    const ctx = createContext({ config: buildConfig({ cities: [buenosAires, montreal] }) });
    const consoleSpy = captureConsole();

    await listCities(ctx);
    consoleSpy.restore();

    const output = plain(consoleSpy.lines);
    expect(output).toContain("Buenos Aires");
    expect(output).toContain("Montreal");
    expect(output).toContain("Temperatura: 21.5 °C");
  });

  test("muestra el detalle del error de una ciudad que falla", async () => {
    mockFetchQueue([
      async () => new Response(JSON.stringify(currentWeatherPayload)),
      async () => {
        throw new Error("network down");
      },
    ]);
    const ctx = createContext({ config: buildConfig({ cities: [buenosAires, montreal] }) });
    const consoleSpy = captureConsole();

    await listCities(ctx);
    consoleSpy.restore();

    const output = plain(consoleSpy.lines);
    expect(output).toContain("Temperatura: 21.5 °C");
    expect(output).toContain("Montreal, Canadá: No se pudo conectar");
  });
});
