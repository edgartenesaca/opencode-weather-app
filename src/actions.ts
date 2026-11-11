import { getCurrentWeather, getDailyForecast } from "./api/forecast";
import { searchCities } from "./api/geocoding";
import type { AppContext } from "./context";
import type { City, Config } from "./types";
import { nextUnit, unitSymbol } from "./units";
import { green, red } from "./ui/colors";
import { askIndex, confirm } from "./ui/prompts";
import { withSpinner } from "./ui/spinner";
import type { Terminal } from "./ui/terminal";
import { cityLabel, renderCityList, renderWeather, renderDailyForecast } from "./ui/weather";

export async function showDefaultWeather(ctx: AppContext): Promise<void> {
  const city = ctx.config.cities.find((item) => item.id === ctx.config.defaultCityId);

  if (!city) {
    console.log(red("\n  No hay ciudad default. Usa la opción 5 para establecer una.\n"));
    return;
  }

  const weather = await withSpinner("Consultando el clima", () =>
    getCurrentWeather(city, ctx.config.unit),
  );
  console.log(`\n${renderWeather(city, weather, ctx.config.unit)}\n`);
}

export async function showAllWeather(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    console.log(red("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n"));
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

    console.log(red(`  ${cityLabel(city)}: ${errorMessage(result.reason)}`));
  });
}

export async function showDailyForecast(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    console.log(red("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n"));
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad para el pronóstico: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    console.log(red("\n  Operación cancelada.\n"));
    return;
  }

  const days = await withSpinner("Consultando el pronóstico", () =>
    getDailyForecast(city, ctx.config.unit),
  );

  console.log(`\n${renderDailyForecast(city, days, ctx.config.unit)}\n`);
}

export async function searchAndAddCity(ctx: AppContext): Promise<void> {
  const answer = await ctx.terminal.ask("\n  Nombre de la ciudad: ");
  const query = answer?.trim() ?? "";

  if (query === "") {
    console.log(red("\n  Ciudad vacía. Operación cancelada.\n"));
    return;
  }

  const results = await withSpinner("Buscando ciudades", () => searchCities(query));

  if (results.length === 0) {
    console.log(red(`\n  No se encontró ninguna ciudad con el nombre "${query}".\n`));
    return;
  }

  const city = results.length === 1 ? results[0] : await chooseCity(ctx.terminal, results);

  if (!city) {
    console.log(red("\n  Operación cancelada.\n"));
    return;
  }

  if (ctx.config.cities.some((item) => item.id === city.id)) {
    console.log(red(`\n  ${cityLabel(city)} ya está registrada.\n`));
    return;
  }

  ctx.updateConfig({ cities: [...ctx.config.cities, city] });
  console.log(green(`\n  Ciudad agregada: ${cityLabel(city)}\n`));
}

export async function deleteCity(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    console.log(red("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n"));
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad a eliminar: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    console.log(red("\n  Operación cancelada.\n"));
    return;
  }

  if (!(await confirm(ctx.terminal, `  ¿Eliminar ${cityLabel(city)}? (s/N): `))) {
    console.log(red("\n  Operación cancelada.\n"));
    return;
  }

  ctx.updateConfig({
    cities: cities.filter((item) => item.id !== city.id),
    defaultCityId: ctx.config.defaultCityId === city.id ? null : ctx.config.defaultCityId,
  });

  console.log(green(`\n  Ciudad eliminada: ${cityLabel(city)}\n`));
}

export async function setDefaultCity(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    console.log(red("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n"));
    return;
  }

  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad default: ", cities.length);
  const city = index === null ? undefined : cities[index];

  if (!city) {
    console.log(red("\n  Operación cancelada.\n"));
    return;
  }

  ctx.updateConfig({ defaultCityId: city.id });
  console.log(green(`\n  Ciudad default: ${cityLabel(city)}\n`));
}

export async function toggleUnit(ctx: AppContext): Promise<void> {
  const unit = nextUnit(ctx.config.unit);

  ctx.updateConfig({ unit });
  console.log(green(`\n  Unidad de temperatura: ${unitSymbol(unit)}\n`));
}

async function chooseCity(terminal: Terminal, cities: City[]): Promise<City | null> {
  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(terminal, "  Elige una ciudad: ", cities.length);
  return index === null ? null : (cities[index] ?? null);
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : "Ocurrió un error inesperado.";
}
