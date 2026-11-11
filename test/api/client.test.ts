import { afterEach, describe, expect, test } from "bun:test";
import { fetchJson } from "../../src/api/client";
import { WeatherError } from "../../src/utils/errors";

const originalFetch = globalThis.fetch;

function mockFetch(implementation: () => Promise<Response>): void {
  globalThis.fetch = (async () => implementation()) as unknown as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchJson", () => {
  test("devuelve el JSON parseado", async () => {
    mockFetch(async () =>
      new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      }),
    );

    expect(await fetchJson<{ ok: boolean }>("https://example.com")).toEqual({ ok: true });
  });

  test("lanza WeatherError si el estado no es 2xx", async () => {
    mockFetch(async () => new Response("nope", { status: 500 }));

    await expect(fetchJson("https://example.com")).rejects.toThrow(WeatherError);
    await expect(fetchJson("https://example.com")).rejects.toThrow("estado 500");
  });

  test("lanza WeatherError si falla la conexión", async () => {
    mockFetch(async () => {
      throw new Error("network down");
    });

    await expect(fetchJson("https://example.com")).rejects.toThrow("No se pudo conectar");
  });

  test("lanza WeatherError si la respuesta no es JSON válido", async () => {
    mockFetch(async () => new Response("<html>nope</html>"));

    await expect(fetchJson("https://example.com")).rejects.toThrow("respuesta inválida");
  });
});
