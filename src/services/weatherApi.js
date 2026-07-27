import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

if (!API_KEY) {
  // Surfaced in the console only — the UI shows a friendly error via useWeather.
  console.warn(
    "[weatherApi] VITE_OPENWEATHER_API_KEY is missing. Add it to a .env file at the project root."
  );
}

const client = axios.create({
  timeout: 12000,
});

/**
 * Normalizes axios/OpenWeather errors into a single friendly message
 * so every caller can display something sensible without duplicating logic.
 */
function toFriendlyError(error) {
  if (!API_KEY) {
    return new Error(
      "Missing API key. Add VITE_OPENWEATHER_API_KEY to your .env file and restart the dev server."
    );
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.message;

    if (status === 404) {
      return new Error("We couldn't find that city. Check the spelling and try again.");
    }
    if (status === 401) {
      return new Error("That API key was rejected. Double-check VITE_OPENWEATHER_API_KEY.");
    }
    if (status === 429) {
      return new Error("Too many requests right now. Wait a moment and try again.");
    }
    if (error.code === "ECONNABORTED") {
      return new Error("The request timed out. Check your connection and try again.");
    }
    if (!error.response) {
      return new Error("Network error — couldn't reach the weather service.");
    }
    return new Error(apiMessage ? `Weather service error: ${apiMessage}` : "Something went wrong fetching the weather.");
  }

  return new Error("Something unexpected went wrong. Please try again.");
}

/**
 * Look up matching places for a free-text city query.
 * Returns an array of { name, state, country, lat, lon }.
 */
export async function geocodeCity(query, limit = 5) {
  try {
    const { data } = await client.get(`${GEO_URL}/direct`, {
      params: { q: query, limit, appid: API_KEY },
    });
    if (!data || data.length === 0) {
      throw { response: { status: 404 } };
    }
    return data;
  } catch (error) {
    throw toFriendlyError(error);
  }
}

/**
 * Fetch current weather for a city name (e.g. "Paris" or "Paris,FR").
 */
export async function getCurrentWeatherByCity(city, units = "metric") {
  try {
    const { data } = await client.get(`${BASE_URL}/weather`, {
      params: { q: city, units, appid: API_KEY },
    });
    return data;
  } catch (error) {
    throw toFriendlyError(error);
  }
}

/**
 * Fetch current weather for geographic coordinates.
 */
export async function getCurrentWeatherByCoords(lat, lon, units = "metric") {
  try {
    const { data } = await client.get(`${BASE_URL}/weather`, {
      params: { lat, lon, units, appid: API_KEY },
    });
    return data;
  } catch (error) {
    throw toFriendlyError(error);
  }
}

/**
 * Fetch the 5-day / 3-hour forecast for geographic coordinates.
 */
export async function getForecastByCoords(lat, lon, units = "metric") {
  try {
    const { data } = await client.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, units, appid: API_KEY },
    });
    return data;
  } catch (error) {
    throw toFriendlyError(error);
  }
}

export default {
  geocodeCity,
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  getForecastByCoords,
};
