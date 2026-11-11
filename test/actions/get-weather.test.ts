import { afterEach, describe, expect, test } from "bun:test";
import { getWeather } from "../../src/actions/getWeather";
import {
  buenosAires,
  buildConfig,
  captureConsole,
  createContext,
  currentWeatherPayload,
  mockFetchJson,
  plain,
  restoreFetch,
} from "./helpers";

afterEach(() => {
  restoreFetch();
});

describe("getWeather", () => {
  test("avisa si no hay ciudad default", async () => {
    const ctx = createContext();
    const consoleSpy = captureConsole();

    await getWeather(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([]);
    expect(plain(consoleSpy.lines)).toContain("No hay ciudad default");
  });

  test("consulta y muestra el clima de la ciudad default", async () => {
    mockFetchJson(currentWeatherPayload);
    const ctx = createContext({
      config: buildConfig({ defaultCityId: buenosAires.id, cities: [buenosAires] }),
    });
    const consoleSpy = captureConsole();

    await getWeather(ctx);
    consoleSpy.restore();

    const output = plain(consoleSpy.lines);
    expect(output).toContain("Buenos Aires");
    expect(output).toContain("21.5 °C");
  });
});
