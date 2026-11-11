import { WeatherError } from "../utils/errors";

const REQUEST_TIMEOUT_MS = 10_000;

export async function fetchJson<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch {
    throw new WeatherError("No se pudo conectar con el servicio. Revisa tu conexión a internet.");
  }

  if (!response.ok) {
    throw new WeatherError(`El servicio respondió con el estado ${response.status}.`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new WeatherError("El servicio devolvió una respuesta inválida.");
  }
}
