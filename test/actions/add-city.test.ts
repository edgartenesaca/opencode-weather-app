import { afterEach, describe, expect, test } from "bun:test";
import { addCity } from "../../src/actions/addCity";
import {
  buenosAires,
  buildConfig,
  captureConsole,
  createContext,
  mockFetchJson,
  montreal,
  plain,
  restoreFetch,
} from "./helpers";

afterEach(() => {
  restoreFetch();
});

describe("addCity", () => {
  test("cancela si el nombre está vacío", async () => {
    const ctx = createContext({ answers: ["   "] });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("Ciudad vacía");
    
  });

  test("avisa si no se encontraron ciudades", async () => {
    mockFetchJson({ results: [] });
    const ctx = createContext({ answers: ["Nowhere"] });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain('No se encontró ninguna ciudad con el nombre "Nowhere"');
  });

  test("agrega la ciudad cuando hay un único resultado", async () => {
    mockFetchJson({ results: [buenosAires] });
    const ctx = createContext({ answers: ["Buenos Aires"] });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ cities: [buenosAires] }]);
    expect(plain(consoleSpy.lines)).toContain("Ciudad agregada: Buenos Aires");
  });

  test("pide elegir cuando hay varios resultados", async () => {
    mockFetchJson({ results: [buenosAires, montreal] });
    const ctx = createContext({ answers: ["Buenos Aires", "2"] });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ cities: [montreal] }]);
    expect(plain(consoleSpy.lines)).toContain("Ciudad agregada: Montreal");
  });

  test("cancela si no se elige ninguna ciudad", async () => {
    mockFetchJson({ results: [buenosAires, montreal] });
    const ctx = createContext({ answers: ["Buenos Aires", ""] });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("Operación cancelada");
  });

  test("avisa si la ciudad ya está registrada", async () => {
    mockFetchJson({ results: [buenosAires] });
    const ctx = createContext({
      config: buildConfig({ cities: [buenosAires] }),
      answers: ["Buenos Aires"],
    });
    const consoleSpy = captureConsole();

    await addCity(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("ya está registrada");
  });
});
