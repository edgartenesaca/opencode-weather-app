import {
  deleteCity,
  searchAndAddCity,
  setDefaultCity,
  showAllWeather,
  showDefaultWeather,
  toggleUnit,
  type AppContext,
} from "./actions";
import { loadConfig, saveConfig } from "./config";
import { WeatherError } from "./errors";
import { Terminal } from "./ui/terminal";
import { renderMenu } from "./ui/weather";

export async function run(): Promise<void> {
  const config = loadConfig();
  const terminal = new Terminal();

  process.on("SIGINT", () => {
    goodbye();
    process.exit(0);
  });

  const ctx: AppContext = {
    terminal,
    config,
    persist: () => saveConfig(config),
  };

  try {
    while (true) {
      terminal.clearScreen();
      console.log(renderMenu(config.cities.length, config.unit));
      const choice = await terminal.ask("  Selecciona una opción: ");

      if (choice === null) {
        break;
      }

      const option = choice.trim();

      if (option === "9") {
        break;
      }

      await dispatch(ctx, option);
    }
  } finally {
    terminal.close();
  }

  goodbye();
}

async function dispatch(ctx: AppContext, choice: string): Promise<void> {
  try {
    switch (choice) {
      case "1":
        await showDefaultWeather(ctx);
        break;
      case "2":
        await showAllWeather(ctx);
        break;
      case "3":
        await searchAndAddCity(ctx);
        break;
      case "4":
        await deleteCity(ctx);
        break;
      case "5":
        await setDefaultCity(ctx);
        break;
      case "8":
        await toggleUnit(ctx);
        break;
      default:
        console.log("\n  Opción inválida. Intenta de nuevo.\n");
    }
  } catch (error) {
    const message = error instanceof WeatherError ? error.message : "Ocurrió un error inesperado.";
    console.log(`\n  ${message}\n`);
  }
}

function goodbye(): void {
  console.log("\n  ¡Hasta pronto!\n");
}
