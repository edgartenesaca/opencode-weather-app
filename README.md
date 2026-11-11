## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.
- Ver el pronóstico de los próximos 7 días de cualquier ciudad registrada.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto
```

## Inicializar proyecto

```bash
bun init
```

### Ejemplo del menú
Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico de 7 días
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```

### Uso

```bash
bun install
bun run start        # ejecuta la app
bun run build        # genera el binario ./weather
bun run typecheck    # bun check
bun run test         # bun test
```

### Salida del clima

```
════════════════════════════════════════
  Cuenca, Azuay, Ecuador
  Temperatura: 14.4 °C
  Clima: 🌦️ Llovizna ligera
  Humedad: 72%
  Viento: 9.4 km/h
════════════════════════════════════════
```

### Salida del pronóstico

```
════════════════════════════════════════
  Pronóstico de 7 días — Cuenca, Azuay, Ecuador (°C)
════════════════════════════════════════
  hoy       🌦️  Llovizna ligera        22.1° / 9.4°
  mañana    🌦️  Chubascos ligeros      19.7° / 9.8°
  vie 13    🌧️  Llovizna intensa       20.3° / 10.3°
  sáb 14    🌦️  Chubascos ligeros      21.2° / 8.9°
  dom 15    🌦️  Llovizna moderada      20.8° / 9.8°
  lun 16    🌦️  Llovizna moderada      19.3° / 11.5°
  mar 17    🌦️  Llovizna ligera        21.1° / 10.0°
════════════════════════════════════════
```

### Configuración

Las ciudades, la ciudad default y la unidad de temperatura se guardan en
`$XDG_CONFIG_HOME/weather-cli/config.json` (`~/.config/weather-cli/config.json` por defecto):

```json
{
  "unit": "celsius",
  "defaultCityId": 6094817,
  "cities": [
    {
      "id": 6094817,
      "name": "Ottawa",
      "admin1": "Ontario",
      "country": "Canadá",
      "latitude": 45.41117,
      "longitude": -75.69812
    }
  ]
}
```