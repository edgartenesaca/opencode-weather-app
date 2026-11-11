import { searchCities } from "../api/geocoding";
import { askIndex } from "../presentation/input";
import { cityLabel, renderCityList, showError, showSuccess } from "../presentation/output";
import { withSpinner } from "../presentation/spinner";
import { addedCity } from "../storage/citiesStorage";
import type { AppContext } from "../types/AppContext";
import type { City } from "../types/City";

export async function addCity(ctx: AppContext): Promise<void> {
  const answer = await ctx.terminal.ask("\n  Nombre de la ciudad: ");
  const query = answer?.trim() ?? "";

  if (query === "") {
    showError("Ciudad vacía. Operación cancelada.");
    return;
  }

  const results = await withSpinner("Buscando ciudades", () => searchCities(query));

  if (results.length === 0) {
    showError(`No se encontró ninguna ciudad con el nombre "${query}".`);
    return;
  }

  const city = results.length === 1 ? results[0] : await chooseCity(ctx, results);

  if (!city) {
    showError("Operación cancelada.");
    return;
  }

  if (ctx.config.cities.some((item) => item.id === city.id)) {
    showError(`${cityLabel(city)} ya está registrada.`);
    return;
  }

  ctx.updateConfig(addedCity(ctx.config, city));
  showSuccess(`Ciudad agregada: ${cityLabel(city)}`);
}

async function chooseCity(ctx: AppContext, cities: City[]): Promise<City | null> {
  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Elige una ciudad: ", cities.length);
  return index === null ? null : (cities[index] ?? null);
}
