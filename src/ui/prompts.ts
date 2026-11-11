import type { Terminal } from "./terminal";

export async function askIndex(
  terminal: Terminal,
  question: string,
  count: number,
): Promise<number | null> {
  while (true) {
    const answer = await terminal.ask(question);

    if (answer === null) {
      return null;
    }

    const trimmed = answer.trim();

    if (trimmed === "") {
      return null;
    }

    const index = Number(trimmed);

    if (Number.isInteger(index) && index >= 1 && index <= count) {
      return index - 1;
    }

    console.log(`  Opción inválida. Ingresa un número entre 1 y ${count}.`);
  }
}

export async function confirm(terminal: Terminal, question: string): Promise<boolean> {
  const answer = await terminal.ask(question);

  if (answer === null) {
    return false;
  }

  const normalized = answer.trim().toLowerCase();
  return normalized === "s" || normalized === "si" || normalized === "sí" || normalized === "y";
}
