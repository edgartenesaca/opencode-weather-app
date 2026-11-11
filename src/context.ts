import { saveConfig } from "./config";
import type { Config } from "./types";
import type { Terminal } from "./ui/terminal";

export interface AppContext {
  terminal: Terminal;
  config: Config;
  updateConfig: (patch: Partial<Config>) => void;
}

/**
 * Crea el contexto de la app con una única vía de escritura:
 * `updateConfig` reemplaza la configuración y la persiste.
 */
export function createContext(terminal: Terminal, config: Config): AppContext {
  const ctx: AppContext = {
    terminal,
    config,
    updateConfig: (patch) => {
      ctx.config = { ...ctx.config, ...patch };
      saveConfig(ctx.config);
    },
  };

  return ctx;
}
