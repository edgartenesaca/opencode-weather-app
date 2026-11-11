import { createInterface, type Interface } from "node:readline";
import { red } from "../utils/colors";

/**
 * Terminal basado en eventos "line" de readline.
 * Se usa en lugar de readline/promises porque Bun descarta las líneas
 * escritas mientras no hay una pregunta pendiente.
 * `ask` resuelve con null cuando la entrada termina (Ctrl+D).
 */
export class Terminal {
  private readonly interface: Interface;
  private readonly buffered: string[] = [];
  private readonly waiting: Array<(line: string | null) => void> = [];
  private closed = false;

  constructor() {
    this.interface = createInterface({ input: process.stdin, output: process.stdout });
    this.interface.on("line", (line) => this.receive(line));
    this.interface.on("close", () => this.finish());
  }

  async ask(question: string): Promise<string | null> {
    process.stdout.write(question);
    return this.nextLine();
  }

  clearScreen(): void {
    process.stdout.write("\u001B[2J\u001B[H");
  }

  close(): void {
    this.interface.close();
  }

  private receive(line: string): void {
    const resolve = this.waiting.shift();

    if (resolve) {
      resolve(line);
      return;
    }

    this.buffered.push(line);
  }

  private finish(): void {
    this.closed = true;

    while (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve?.(this.buffered.shift() ?? null);
    }
  }

  private nextLine(): Promise<string | null> {
    const line = this.buffered.shift();

    if (line !== undefined) {
      return Promise.resolve(line);
    }

    if (this.closed) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => this.waiting.push(resolve));
  }
}

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

    console.log(red(`  Opción inválida. Ingresa un número entre 1 y ${count}.`));
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
