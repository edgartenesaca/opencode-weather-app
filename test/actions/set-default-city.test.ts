import { afterEach, describe, expect, test } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity";
import {
  buenosAires,
  buildConfig,
  captureConsole,
  createContext,
  montreal,
  plain,
  restoreFetch,
} from "./helpers";

afterEach(() => {
  restoreFetch();
});

describe("setDefaultCity", () => {
  test("avisa si no hay ciudades registradas", async () => {
    const ctx = createContext();
    const consoleSpy = captureConsole();

    await setDefaultCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("No hay ciudades registradas");
  });

  test("establece la ciudad default elegida", async () => {
    const ctx = createContext({
      config: buildConfig({ cities: [buenosAires, montreal] }),
      answers: ["2"],
    });
    const consoleSpy = captureConsole();

    await setDefaultCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ defaultCityId: montreal.id }]);
    expect(plain(consoleSpy.lines)).toContain("Ciudad default: Montreal");
  });

  test("cancela si no se elige ciudad", async () => {
    const ctx = createContext({
      config: buildConfig({ cities: [buenosAires] }),
      answers: [""],
    });
    const consoleSpy = captureConsole();

    await setDefaultCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("Operación cancelada");
  });
});
