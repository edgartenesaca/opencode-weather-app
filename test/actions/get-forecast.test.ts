import { afterEach, describe, expect, test } from "bun:test";
import { getForecast } from "../../src/actions/getForecast";
import {
  buenosAires,
  buildConfig,
  captureConsole,
  createContext,
  dailyPayload,
  mockFetchJson,
  plain,
  restoreFetch,
} from "./helpers";

afterEach(() => {
  restoreFetch();
});

describe("getForecast", () => {
  test("avisa si no hay ciudades registradas", async () => {
    const ctx = createContext();
    const consoleSpy = captureConsole();

    await getForecast(ctx);
    consoleSpy.restore();

    expect(plain(consoleSpy.lines)).toContain("No hay ciudades registradas");
  });

  test("muestra el pronóstico de la ciudad elegida", async () => {
    mockFetchJson(dailyPayload);
    const ctx = createContext({
      config: buildConfig({ cities: [buenosAires] }),
      answers: ["1"],
    });
    const consoleSpy = captureConsole();

    await getForecast(ctx);
    consoleSpy.restore();

    const output = plain(consoleSpy.lines);
    expect(output).toContain("Pronóstico de 2 días — Buenos Aires");
    expect(output).toContain("24.1° / 14.2°");
  });

  test("cancela si no se elige ciudad", async () => {
    mockFetchJson(dailyPayload);
    const ctx = createContext({
      config: buildConfig({ cities: [buenosAires] }),
      answers: [""],
    });
    const consoleSpy = captureConsole();

    await getForecast(ctx);
    consoleSpy.restore();

    expect(plain(consoleSpy.lines)).toContain("Operación cancelada");
  });
});
