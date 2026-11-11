import { getCurrentWeather } from "../api/weather";
import { renderWeather, showError } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import { findDefaultCity } from "../storage/citiesStorage";
import type { AppContext } from "../types/AppContext";

export async function getWeather(ctx: AppContext): Promise<void> {
  const city = findDefaultCity(ctx.config);

  if (!city) {
    showError("No hay ciudad default. Usa la opción 5 para establecer una.");
    return;
  }

  const weather = await withSpinner("Consultando el clima", () =>
    getCurrentWeather(city, ctx.config.unit),
  );

  console.log(`\n${renderWeather(city, weather, ctx.config.unit)}\n`);
}
