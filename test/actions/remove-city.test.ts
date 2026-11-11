import { afterEach, describe, expect, test } from "bun:test";
import { removeCity } from "../../src/actions/removeCity";
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

function contextWithCities(answers: string[]) {
  return createContext({
    config: buildConfig({ cities: [buenosAires, montreal] }),
    answers,
  });
}

describe("removeCity", () => {
  test("avisa si no hay ciudades registradas", async () => {
    const ctx = createContext();
    const consoleSpy = captureConsole();

    await removeCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("No hay ciudades registradas");
  });

  test("elimina la ciudad elegida tras confirmar", async () => {
    const ctx = contextWithCities(["2", "s"]);
    const consoleSpy = captureConsole();

    await removeCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ cities: [buenosAires], defaultCityId: null }]);
    expect(plain(consoleSpy.lines)).toContain("Ciudad eliminada: Montreal");
  });

  test("cancela si no se confirma la eliminación", async () => {
    const ctx = contextWithCities(["1", "n"]);
    const consoleSpy = captureConsole();

    await removeCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("Operación cancelada");
  });

  test("cancela si no se elige ciudad", async () => {
    const ctx = contextWithCities([""]);
    const consoleSpy = captureConsole();

    await removeCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("Operación cancelada");
  });
});
