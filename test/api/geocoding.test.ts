import { afterEach, describe, expect, test } from "bun:test";
import { searchCities } from "../../src/api/geocoding";

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

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("searchCities", () => {
  test("consulta el servicio de geocodificación con los parámetros esperados", async () => {
    mockFetch({ results: [] });

    await searchCities("Madrid");

    const url = new URL(requestedUrl);
    expect(url.origin + url.pathname).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(url.searchParams.get("name")).toBe("Madrid");
    expect(url.searchParams.get("count")).toBe("5");
    expect(url.searchParams.get("language")).toBe("es");
    expect(url.searchParams.get("format")).toBe("json");
  });

  test("mapea los resultados a ciudades", async () => {
    mockFetch({
      results: [
        {
          id: 3117735,
          name: "Madrid",
          admin1: "Madrid",
          country: "España",
          latitude: 40.4165,
          longitude: -3.70256,
        },
      ],
    });

    expect(await searchCities("Madrid")).toEqual([
      {
        id: 3117735,
        name: "Madrid",
        admin1: "Madrid",
        country: "España",
        latitude: 40.4165,
        longitude: -3.70256,
      },
    ]);
  });

  test("completa el país vacío cuando no viene", async () => {
    mockFetch({ results: [{ id: 1, name: "X", latitude: 0, longitude: 0 }] });

    const [city] = await searchCities("X");

    expect(city?.country).toBe("");
    expect(city?.admin1).toBeUndefined();
  });

  test("devuelve una lista vacía si no hay resultados", async () => {
    mockFetch({});

    expect(await searchCities("Nowhere")).toEqual([]);
  });
});
