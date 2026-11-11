import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { getCurrentWeather, getDailyForecast } from "../../src/api/weather";
import { WeatherError } from "../../src/utils/errors";
import type { City } from "../../src/types/City";

const city: City = {
  id: 6094817,
  name: "Ottawa",
  admin1: "Ontario",
  country: "Canadá",
  latitude: 45.41117,
  longitude: -75.69812,
};

const dailyPayload = {
  daily: {
    time: ["2026-11-11", "2026-11-12", "2026-11-13"],
    weather_code: [3, 61, null],
    temperature_2m_max: [6.9, 3.4, 5.8],
    temperature_2m_min: [0.5, -0.2, -0.4],
  },
};

const originalFetch = globalThis.fetch;
let requestedUrl = "";

function mockFetch(payload: unknown): void {
  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify(payload), {
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

describe("getDailyForecast", () => {
  beforeEach(() => {
    requestedUrl = "";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("mapea los días del pronóstico", async () => {
    mockFetch(dailyPayload);

    const days = await getDailyForecast(city, "celsius");

    expect(days).toHaveLength(3);
    expect(days[0]).toEqual({ date: "2026-11-11", max: 6.9, min: 0.5, weatherCode: 3 });
    expect(days[1]?.weatherCode).toBe(61);
  });

  test("pide 7 días, timezone local y la unidad indicada", async () => {
    mockFetch(dailyPayload);

    await getDailyForecast(city, "fahrenheit");

    const url = new URL(requestedUrl);
    expect(url.searchParams.get("forecast_days")).toBe("7");
    expect(url.searchParams.get("timezone")).toBe("auto");
    expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit");
    expect(url.searchParams.get("daily")).toBe("weather_code,temperature_2m_max,temperature_2m_min");
    expect(url.searchParams.get("latitude")).toBe("45.41117");
  });

  test("acepta un número de días distinto", async () => {
    mockFetch(dailyPayload);

    await getDailyForecast(city, "celsius", 3);

    expect(new URL(requestedUrl).searchParams.get("forecast_days")).toBe("3");
  });

  test("lanza error si el servicio no devuelve pronóstico", async () => {
    mockFetch({});

    await expect(getDailyForecast(city, "celsius")).rejects.toThrow(WeatherError);
  });

  test("lanza error si todas las temperaturas vienen nulas", async () => {
    mockFetch({
      daily: {
        time: ["2026-11-11"],
        weather_code: [3],
        temperature_2m_max: [null],
        temperature_2m_min: [null],
      },
    });

    await expect(getDailyForecast(city, "celsius")).rejects.toThrow(WeatherError);
  });
});

describe("getCurrentWeather", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("mapea el clima actual", async () => {
    mockFetch({
      current: {
        time: "2026-11-11T10:00",
        temperature_2m: 4.2,
        relative_humidity_2m: 81,
        weather_code: 3,
        wind_speed_10m: 12.5,
      },
    });

    const weather = await getCurrentWeather(city, "celsius");

    expect(weather.temperature).toBe(4.2);
    expect(weather.humidity).toBe(81);
    expect(weather.windSpeed).toBe(12.5);
    expect(weather.weatherCode).toBe(3);
    expect(weather.observedAt).toBe("2026-11-11T10:00");
  });

  test("lanza error si falta la temperatura", async () => {
    mockFetch({ current: {} });

    await expect(getCurrentWeather(city, "celsius")).rejects.toThrow(WeatherError);
  });
});
