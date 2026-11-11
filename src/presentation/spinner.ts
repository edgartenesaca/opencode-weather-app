export const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

const FRAME_INTERVAL_MS = 120;
const ERASE_LINE = "\u001B[2K\r";

export interface SpinnerOptions {
  /** Por defecto sigue la interactividad del stdout; en un pipe se imprime un mensaje estático. */
  interactive?: boolean;
  intervalMs?: number;
}

export function startSpinner(text: string, options: SpinnerOptions = {}): () => void {
  const interactive = options.interactive ?? process.stdout.isTTY === true;

  if (!interactive) {
    process.stdout.write(`${text}...\n`);
    return () => {};
  }

  const intervalMs = options.intervalMs ?? FRAME_INTERVAL_MS;
  let index = 0;

  const render = (): void => {
    const frame = SPINNER_FRAMES[index % SPINNER_FRAMES.length] ?? "";
    process.stdout.write(`${ERASE_LINE}${frame} ${text}...`);
    index += 1;
  };

  render();
  const timer = setInterval(render, intervalMs);

  return () => {
    clearInterval(timer);
    process.stdout.write(ERASE_LINE);
  };
}

/** Ejecuta una tarea mostrando un spinner y siempre lo limpia al terminar. */
export async function withSpinner<T>(
  text: string,
  task: () => Promise<T>,
  options?: SpinnerOptions,
): Promise<T> {
  const stop = startSpinner(text, options);

  try {
    return await task();
  } finally {
    stop();
  }
}
