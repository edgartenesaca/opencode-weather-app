import { addCity } from "../actions/addCity";
import { changeUnit } from "../actions/changeUnit";
import { getForecast } from "../actions/getForecast";
import { getWeather } from "../actions/getWeather";
import { listCities } from "../actions/listCities";
import { removeCity } from "../actions/removeCity";
import { setDefaultCity } from "../actions/setDefaultCity";
import type { AppContext } from "../types/AppContext";
import type { MenuOption } from "../types/MenuOption";
import { cyan } from "../utils/colors";
import { LINE_WIDTH, SEPARATOR } from "../utils/constants";
import { unitSymbol } from "../utils/units";

export const MENU: MenuOption[] = [
  { key: "1", label: () => "Clima de ciudad default", action: getWeather },
  {
    key: "2",
    label: (ctx) => `Clima de todas las ciudades (${ctx.config.cities.length})`,
    action: listCities,
  },
  { key: "3", label: () => "Buscar y agregar ciudad", action: addCity },
  { key: "4", label: () => "Eliminar ciudad", action: removeCity },
  { key: "5", label: () => "Establecer ciudad default", action: setDefaultCity },
  { key: "6", label: () => "Pronóstico de 7 días", action: getForecast },
  { key: "8", label: (ctx) => `Ajustes (${unitSymbol(ctx.config.unit)})`, action: changeUnit },
  { key: "9", label: () => "Salir", exit: true },
];

export interface MenuEntry {
  key: string;
  label: string;
}

export function menuEntries(ctx: AppContext): MenuEntry[] {
  return MENU.map((option) => ({ key: option.key, label: option.label(ctx) }));
}

export function findOption(key: string): MenuOption | undefined {
  return MENU.find((option) => option.key === key);
}

export function renderMenu(entries: MenuEntry[]): string {
  const options = entries.map((entry) => `  ${entry.key}. ${entry.label}`);
  const lines = [SEPARATOR, center("WEATHER CLI"), SEPARATOR, ...options, SEPARATOR];

  return cyan(lines.join("\n"));
}

function center(text: string): string {
  const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
  return " ".repeat(padding) + text;
}
