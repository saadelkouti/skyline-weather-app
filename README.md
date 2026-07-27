# Skyline Weather App

A frontend-only weather app — React + Vite, Tailwind CSS, Framer Motion, and Axios calling the OpenWeatherMap API directly from the browser. No backend, no server, no database.

## Features

- Search weather by city (via OpenWeatherMap Geocoding + Current Weather APIs)
- "Use my location" button (browser Geolocation API)
- Current conditions: city, country, temperature, feels-like, condition, humidity, wind speed, pressure, visibility, sunrise, sunset
- 5-day forecast (built from the 3-hour `/forecast` endpoint, one representative reading per day)
- Celsius / Fahrenheit switch (instant, no refetch — data is fetched once in metric and converted client-side)
- Dark / light mode, persisted in `localStorage`
- Recent searches, persisted in `localStorage`
- Animated, weather-reactive background (sunny / clouds / rain / snow / thunderstorm, day and night variants)
- Loading state and friendly error messages (invalid city, network/API errors, missing API key)

## Project structure

```
src/
 ├── components/       SearchBar, CurrentWeather, Forecast, WeatherCard,
 │                      WeatherDetails, Loader, ErrorMessage, ThemeToggle,
 │                      UnitToggle, AnimatedBackground
 ├── pages/
 │   └── Home.jsx       Main weather page, wires everything together
 ├── hooks/
 │   ├── useWeather.js   Weather/forecast state, loading, errors, history, geolocation
 │   └── useTheme.js     Dark/light mode state + persistence
 ├── services/
 │   └── weatherApi.js   All OpenWeatherMap requests (axios)
 ├── utils/
 │   ├── formatters.js   Unit conversion, date/time formatting, forecast grouping
 │   └── weatherTheme.js Maps conditions → background variant + accent colors
 ├── App.jsx
 └── main.jsx
```

## Setup

**Requirements:** Node.js 18+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. The API key is already wired up in `.env` at the project root:

   ```
   VITE_OPENWEATHER_API_KEY= your_api_key
   ```

   To use your own key instead, replace the value in `.env` (see `.env.example`). **Restart the dev server after changing `.env`** — Vite only reads env files on startup.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open the URL Vite prints (defaults to `http://localhost:5173`).

4. Build for production:

   ```bash
   npm run build
   npm run preview   # optional, serves the production build locally
   ```

   The output lands in `dist/` — it's static HTML/CSS/JS, so it can be deployed to any static host (Vercel, Netlify, GitHub Pages, S3, etc.) with no server component.

## A note on the API key

This is a frontend-only app, so `VITE_OPENWEATHER_API_KEY` gets bundled straight into the JavaScript that ships to the browser — anyone can read it from the built files or dev tools. That's an inherent trade-off of calling a third-party API directly from client-side code without a backend proxy, not a bug in this app. For a real production deployment you'd normally either restrict the key (OpenWeatherMap supports domain/IP restrictions on paid plans) or add a thin backend/proxy to keep it private — but per the brief, this build intentionally has neither.

## Notes on implementation choices

- **Units:** weather data is always fetched in metric units; the °C/°F toggle converts values client-side via `utils/formatters.js`, so switching units is instant and doesn't re-hit the API.
- **Forecast grouping:** OpenWeatherMap's free-tier forecast endpoint returns data in 3-hour steps for 5 days. `groupForecastByDay` picks the reading closest to midday for each calendar day so the 5-day strip shows one card per day.
- **Geocoding:** city search first resolves the name to coordinates via the Geocoding API, then fetches weather/forecast by lat/lon — this gives more reliable matches for ambiguous city names than querying `/weather?q=` directly.
