import { describe, expect, test } from "bun:test";
import { changeUnit } from "../../src/actions/changeUnit";
import { buildConfig, captureConsole, createContext, plain } from "./helpers";

describe("changeUnit", () => {
  test("alterna de celsius a fahrenheit", async () => {
    const ctx = createContext({ config: buildConfig({ unit: "celsius" }) });
    const consoleSpy = captureConsole();

    await changeUnit(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ unit: "fahrenheit" }]);
    expect(plain(consoleSpy.lines)).toContain("Unidad de temperatura: °F");
  });

  test("alterna de fahrenheit a celsius", async () => {
    const ctx = createContext({ config: buildConfig({ unit: "fahrenheit" }) });
    const consoleSpy = captureConsole();

    await changeUnit(ctx);
    consoleSpy.restore();

    expect(ctx.updates).toEqual([{ unit: "celsius" }]);
    expect(plain(consoleSpy.lines)).toContain("Unidad de temperatura: °C");
  });
});
