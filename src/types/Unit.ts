export const UNITS = ["celsius", "fahrenheit"] as const;

export type Unit = (typeof UNITS)[number];
