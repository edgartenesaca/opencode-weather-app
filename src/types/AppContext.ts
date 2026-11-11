import type { Terminal } from "../presentation/input";
import type { Config } from "./Config";

export interface AppContext {
  terminal: Terminal;
  config: Config;
  updateConfig: (patch: Partial<Config>) => void;
}
