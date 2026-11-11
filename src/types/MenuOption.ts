import type { AppContext } from "./AppContext";

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
