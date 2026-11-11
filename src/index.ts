#!/usr/bin/env bun
import { findOption, menuEntries, renderMenu } from "./presentation/menu";
import { Terminal } from "./presentation/input";
import { showError, showSuccess } from "./presentation/output";
import { loadConfig, saveConfig } from "./storage/settingsStorage";
import type { AppContext } from "./types/AppContext";
import type { Config } from "./types/Config";
import { WeatherError } from "./utils/errors";

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

      const option = findOption(choice.trim());

      if (!option) {
        showError("Opción inválida. Intenta de nuevo.");
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
    showError(message);
  }
}

/** Crea el contexto con una única vía de escritura: `updateConfig` persiste cada cambio. */
function createContext(terminal: Terminal, config: Config): AppContext {
  const ctx: AppContext = {
    terminal,
    config,
    updateConfig: (patch) => {
      ctx.config = { ...ctx.config, ...patch };
      saveConfig(ctx.config);
    },
  };

  return ctx;
}

function goodbye(): void {
  showSuccess("¡Hasta pronto!");
}

await run();
