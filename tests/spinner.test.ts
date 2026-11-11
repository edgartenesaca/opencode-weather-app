import { describe, expect, test } from "bun:test";
import { SPINNER_FRAMES, startSpinner, withSpinner } from "../src/ui/spinner";

interface Writable {
  write: (chunk: string) => boolean;
}

async function captureWrites(task: () => Promise<void>): Promise<string[]> {
  const stdout = process.stdout as unknown as Writable;
  const original = stdout.write;
  const writes: string[] = [];

  stdout.write = (chunk: string) => {
    writes.push(chunk);
    return true;
  };

  try {
    await task();
  } finally {
    stdout.write = original;
  }

  return writes;
}

describe("spinner", () => {
  test("los frames son únicos y hay más de uno", () => {
    expect(SPINNER_FRAMES.length).toBeGreaterThan(1);
    expect(new Set(SPINNER_FRAMES).size).toBe(SPINNER_FRAMES.length);
  });

  test("en modo no interactivo imprime un mensaje estático", async () => {
    const writes = await captureWrites(async () => {
      const stop = startSpinner("Consultando el clima", { interactive: false });
      stop();
    });

    expect(writes).toEqual(["Consultando el clima...\n"]);
  });

  test("en modo interactivo anima y limpia la línea al detener", async () => {
    const writes = await captureWrites(async () => {
      const stop = startSpinner("Consultando el clima", { interactive: true, intervalMs: 10 });
      await new Promise((resolve) => setTimeout(resolve, 40));
      stop();
    });

    const frames = writes.filter((write) => write.includes("Consultando el clima"));
    expect(frames.length).toBeGreaterThan(1);
    expect(writes.at(-1)).toBe("\u001B[2K\r");
  });

  test("withSpinner devuelve el resultado de la tarea", async () => {
    let result: number | undefined;

    await captureWrites(async () => {
      result = await withSpinner("Consultando", async () => 42, { interactive: false });
    });

    expect(result).toBe(42);
  });

  test("withSpinner propaga el error y limpia el spinner", async () => {
    const writes = await captureWrites(async () => {
      await withSpinner(
        "Consultando",
        async () => {
          throw new Error("fallo de red");
        },
        { interactive: true, intervalMs: 10 },
      ).catch(() => undefined);
    });

    expect(writes.at(-1)).toBe("\u001B[2K\r");
  });
});
