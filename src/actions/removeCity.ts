import { askIndex, confirm } from "../presentation/input";
import { cityLabel, renderCityList, showError, showSuccess } from "../presentation/output";
import { removedCity } from "../storage/citiesStorage";
import type { AppContext } from "../types/AppContext";

export async function removeCity(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    showError("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad a eliminar: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    showError("Operación cancelada.");
    return;
  }

  if (!(await confirm(ctx.terminal, `  ¿Eliminar ${cityLabel(city)}? (s/N): `))) {
    showError("Operación cancelada.");
    return;
  }

  ctx.updateConfig(removedCity(ctx.config, city));
  showSuccess(`Ciudad eliminada: ${cityLabel(city)}`);
}
