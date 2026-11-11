export interface CurrentWeather {
  temperature: number;
  humidity?: number;
  windSpeed?: number;
  weatherCode?: number;
  observedAt?: string;
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
  weatherCode?: number;
}
