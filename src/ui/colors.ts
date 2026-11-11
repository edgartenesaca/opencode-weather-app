const CODES = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

const RESET = "\x1b[0m";

// Sin terminal la salida se pipea y los escapes ensucian el texto plano.
const enabled = process.stdout.isTTY === true;

function paint(code: string, text: string): string {
  return enabled ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return paint(CODES.cyan, text);
}

export function yellow(text: string): string {
  return paint(CODES.yellow, text);
}

export function green(text: string): string {
  return paint(CODES.green, text);
}

export function red(text: string): string {
  return paint(CODES.red, text);
}
