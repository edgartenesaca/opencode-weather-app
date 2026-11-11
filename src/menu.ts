import {
  deleteCity,
  searchAndAddCity,
  setDefaultCity,
  showAllWeather,
  showDailyForecast,
  showDefaultWeather,
  toggleUnit,
} from "./actions";
import type { AppContext } from "./context";
import { unitSymbol } from "./units";

export type MenuOption =
  | {
      key: string;
      label: (ctx: AppContext) => string;
      action: (ctx: AppContext) => Promise<void>;
    }
  | {
      key: string;
      label: (ctx: AppContext) => string;
      exit: true;
    };

export const MENU: MenuOption[] = [
  { key: "1", label: () => "Clima de ciudad default", action: showDefaultWeather },
  {
    key: "2",
    label: (ctx) => `Clima de todas las ciudades (${ctx.config.cities.length})`,
    action: showAllWeather,
  },
  { key: "3", label: () => "Buscar y agregar ciudad", action: searchAndAddCity },
  { key: "4", label: () => "Eliminar ciudad", action: deleteCity },
  { key: "5", label: () => "Establecer ciudad default", action: setDefaultCity },
  { key: "6", label: () => "Pronóstico de 7 días", action: showDailyForecast },
  { key: "8", label: (ctx) => `Ajustes (${unitSymbol(ctx.config.unit)})`, action: toggleUnit },
  { key: "9", label: () => "Salir", exit: true },
];
