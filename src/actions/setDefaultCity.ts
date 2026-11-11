import { askIndex } from "../presentation/input";
import { cityLabel, renderCityList, showError, showSuccess } from "../presentation/output";
import { defaultCitySet } from "../storage/citiesStorage";
import type { AppContext } from "../types/AppContext";

export async function setDefaultCity(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    showError("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad default: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    showError("Operación cancelada.");
    return;
  }

  ctx.updateConfig(defaultCitySet(city.id));
  showSuccess(`Ciudad default: ${cityLabel(city)}`);
}
