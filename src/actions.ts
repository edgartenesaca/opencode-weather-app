import { getTemperature } from "./api/forecast";
import { searchCities } from "./api/geocoding";
import type { City, Config } from "./types";
import { askIndex, confirm } from "./ui/prompts";
import type { Terminal } from "./ui/terminal";
import { cityLabel, renderCityList, renderWeather, unitSymbol } from "./ui/weather";

export interface AppContext {
  terminal: Terminal;
  config: Config;
  persist: () => void;
}

export async function showDefaultWeather(ctx: AppContext): Promise<void> {
  const city = ctx.config.cities.find((item) => item.id === ctx.config.defaultCityId);

  if (!city) {
    console.log("\n  No hay ciudad default. Usa la opción 5 para establecer una.\n");
    return;
  }

  const temperature = await getTemperature(city, ctx.config.unit);
  console.log(`\n${renderWeather(city, temperature, ctx.config.unit)}\n`);
}

export async function showAllWeather(ctx: AppContext): Promise<void> {
  const cities = ctx.config.cities;

  if (cities.length === 0) {
    console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n");
    return;
  }

  const results = await Promise.allSettled(
    cities.map((city) => getTemperature(city, ctx.config.unit)),
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

    console.log(`  ${cityLabel(city)}: ${errorMessage(result.reason)}`);
  });
}

export async function searchAndAddCity(ctx: AppContext): Promise<void> {
  const answer = await ctx.terminal.ask("\n  Nombre de la ciudad: ");
  const query = answer?.trim() ?? "";

  if (query === "") {
    console.log("\n  Ciudad vacía. Operación cancelada.\n");
    return;
  }

  const results = await searchCities(query);

  if (results.length === 0) {
    console.log(`\n  No se encontró ninguna ciudad con el nombre "${query}".\n`);
    return;
  }

  const city = results.length === 1 ? results[0] : await chooseCity(ctx.terminal, results);

  if (!city) {
    console.log("\n  Operación cancelada.\n");
    return;
  }

  if (ctx.config.cities.some((item) => item.id === city.id)) {
    console.log(`\n  ${cityLabel(city)} ya está registrada.\n`);
    return;
  }

  ctx.config.cities.push(city);
  ctx.persist();
  console.log(`\n  Ciudad agregada: ${cityLabel(city)}\n`);
}

export async function deleteCity(ctx: AppContext): Promise<void> {
  if (ctx.config.cities.length === 0) {
    console.log("\n  No hay ciudades registradas.\n");
    return;
  }

  console.log(`\n${renderCityList(ctx.config.cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad a eliminar: ", ctx.config.cities.length);
  const city = index === null ? undefined : ctx.config.cities[index];

  if (!city) {
    console.log("\n  Operación cancelada.\n");
    return;
  }

  if (!(await confirm(ctx.terminal, `  ¿Eliminar ${cityLabel(city)}? (s/N): `))) {
    console.log("\n  Operación cancelada.\n");
    return;
  }

  ctx.config.cities = ctx.config.cities.filter((item) => item.id !== city.id);

  if (ctx.config.defaultCityId === city.id) {
    ctx.config.defaultCityId = null;
  }

  ctx.persist();
  console.log(`\n  Ciudad eliminada: ${cityLabel(city)}\n`);
}

export async function setDefaultCity(ctx: AppContext): Promise<void> {
  if (ctx.config.cities.length === 0) {
    console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.\n");
    return;
  }

  console.log(`\n${renderCityList(ctx.config.cities)}\n`);
  const index = await askIndex(ctx.terminal, "  Ciudad default: ", ctx.config.cities.length);
  const city = index === null ? undefined : ctx.config.cities[index];

  if (!city) {
    console.log("\n  Operación cancelada.\n");
    return;
  }

  ctx.config.defaultCityId = city.id;
  ctx.persist();
  console.log(`\n  Ciudad default: ${cityLabel(city)}\n`);
}

export async function toggleUnit(ctx: AppContext): Promise<void> {
  ctx.config.unit = ctx.config.unit === "celsius" ? "fahrenheit" : "celsius";
  ctx.persist();
  console.log(`\n  Unidad de temperatura: ${unitSymbol(ctx.config.unit)}\n`);
}

async function chooseCity(terminal: Terminal, cities: City[]): Promise<City | null> {
  console.log(`\n${renderCityList(cities)}\n`);
  const index = await askIndex(terminal, "  Elige una ciudad: ", cities.length);
  return index === null ? null : (cities[index] ?? null);
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : "Ocurrió un error inesperado.";
}
