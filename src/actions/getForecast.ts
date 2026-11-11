import { getDailyForecast } from "../api/weather";
import { askIndex } from "../presentation/input";
import { renderCityList, renderDailyForecast, showError } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import type { AppContext } from "../types/AppContext";

export async function getForecast(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    showError("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad para el pronóstico: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    showError("Operación cancelada.");
    return;
  }

  const days = await withSpinner("Consultando el pronóstico", () =>
    getDailyForecast(city, ctx.config.unit),
  );

  console.log(`\n${renderDailyForecast(city, days, ctx.config.unit)}\n`);
}
