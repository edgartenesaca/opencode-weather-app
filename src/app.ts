import { loadConfig } from "./config";
import { createContext, type AppContext } from "./context";
import { WeatherError } from "./errors";
import { MENU } from "./menu";
import { green, red } from "./ui/colors";
import { Terminal } from "./ui/terminal";
import { renderMenu, type MenuEntry } from "./ui/weather";

export async function run(): Promise<void> {
  const terminal = new Terminal();
  const ctx = createContext(terminal, loadConfig());

  process.on("SIGINT", () => {
    goodbye();
    process.exit(0);
  });

  try {
    while (true) {
      terminal.clearScreen();
      console.log(renderMenu(menuEntries(ctx)));
      const choice = await terminal.ask("  Selecciona una opción: ");

      if (choice === null) {
        break;
      }

      const option = MENU.find((item) => item.key === choice.trim());

      if (!option) {
        console.log(red("\n  Opción inválida. Intenta de nuevo.\n"));
        continue;
      }

      if ("exit" in option) {
        break;
      }

      await runOption(option.action, ctx);
    }
  } finally {
    terminal.close();
  }

  goodbye();
}

async function runOption(
  action: (ctx: AppContext) => Promise<void>,
  ctx: AppContext,
): Promise<void> {
  try {
    await action(ctx);
  } catch (error) {
    const message = error instanceof WeatherError ? error.message : "Ocurrió un error inesperado.";
    console.log(red(`\n  ${message}\n`));
  }
}

function menuEntries(ctx: AppContext): MenuEntry[] {
  return MENU.map((option) => ({ key: option.key, label: option.label(ctx) }));
}

function goodbye(): void {
  console.log(green("\n  ¡Hasta pronto!\n"));
}
