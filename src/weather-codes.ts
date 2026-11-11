export interface WeatherDescription {
  label: string;
  icon: string;
}

/** Códigos WMO retornados por OpenMeteo en `weather_code`. */
const DESCRIPTIONS: Record<number, WeatherDescription> = {
  0: { label: "Cielo despejado", icon: "☀️" },
  1: { label: "Mayormente despejado", icon: "🌤️" },
  2: { label: "Parcialmente nublado", icon: "⛅" },
  3: { label: "Cielo nublado", icon: "☁️" },
  45: { label: "Niebla", icon: "🌫️" },
  48: { label: "Niebla con escarcha", icon: "🌫️" },
  51: { label: "Llovizna ligera", icon: "🌦️" },
  53: { label: "Llovizna moderada", icon: "🌦️" },
  55: { label: "Llovizna intensa", icon: "🌧️" },
  56: { label: "Llovizna helada ligera", icon: "🌧️" },
  57: { label: "Llovizna helada intensa", icon: "🌧️" },
  61: { label: "Lluvia ligera", icon: "🌦️" },
  63: { label: "Lluvia moderada", icon: "🌧️" },
  65: { label: "Lluvia intensa", icon: "🌧️" },
  66: { label: "Lluvia helada ligera", icon: "🌧️" },
  67: { label: "Lluvia helada intensa", icon: "⛈️" },
  71: { label: "Nevada ligera", icon: "🌨️" },
  73: { label: "Nevada moderada", icon: "🌨️" },
  75: { label: "Nevada intensa", icon: "❄️" },
  77: { label: "Granos de nieve", icon: "❄️" },
  80: { label: "Chubascos ligeros", icon: "🌦️" },
  81: { label: "Chubascos moderados", icon: "🌧️" },
  82: { label: "Chubascos violentos", icon: "⛈️" },
  85: { label: "Chubascos de nieve ligeros", icon: "🌨️" },
  86: { label: "Chubascos de nieve fuertes", icon: "❄️" },
  95: { label: "Tormenta eléctrica", icon: "⛈️" },
  96: { label: "Tormenta con granizo", icon: "⛈️" },
  99: { label: "Tormenta fuerte con granizo", icon: "⛈️" },
};

export function describeWeatherCode(code: number): WeatherDescription | undefined {
  return DESCRIPTIONS[code];
}
