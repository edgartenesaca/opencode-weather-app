import { describe, expect, test } from "bun:test";
import { WeatherError } from "../../src/utils/errors";

describe("WeatherError", () => {
  test("conserva el mensaje", () => {
    expect(new WeatherError("algo falló").message).toBe("algo falló");
  });

  test("expone su nombre para identificarla", () => {
    expect(new WeatherError("boom").name).toBe("WeatherError");
  });

  test("es una instancia de Error", () => {
    expect(new WeatherError("boom")).toBeInstanceOf(Error);
  });
});
