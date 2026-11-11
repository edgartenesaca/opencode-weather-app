import { showSuccess } from "../presentation/output";
import { nextUnit, unitSymbol } from "../utils/units";
import type { AppContext } from "../types/AppContext";

export async function changeUnit(ctx: AppContext): Promise<void> {
  const unit = nextUnit(ctx.config.unit);

  ctx.updateConfig({ unit });
  showSuccess(`Unidad de temperatura: ${unitSymbol(unit)}`);
}
