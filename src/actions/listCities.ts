import { getCurrentWeather } from "../api/weather";
import { cityLabel, renderWeather, showError, showErrorDetail } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import type { AppContext } from "../types/AppContext";

export async function listCities(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    showError("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  const results = await withSpinner("Consultando el clima", () =>
    Promise.allSettled(cities.map((city) => getCurrentWeather(city, ctx.config.unit))),
  );

  console.log("");

  results.forEach((result, index) => {
    const city = cities[index];

    if (!city) {
      return;
    }

    if (result.status === "fulfilled") {
      console.log(renderWeather(city, result.value, ctx.config.unit));
      console.log("");
      return;
    }

    showErrorDetail(`${cityLabel(city)}: ${errorMessage(result.reason)}`);
  });
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : "Ocurrió un error inesperado.";
}
