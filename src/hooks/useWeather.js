import { useCallback, useEffect, useState } from "react";
import {
  geocodeCity,
  getCurrentWeatherByCoords,
  getForecastByCoords,
} from "../services/weatherApi";

const HISTORY_KEY = "skyline:recent-searches";
const UNIT_KEY = "skyline:unit";
const MAX_HISTORY = 6;

function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadUnit() {
  const saved = window.localStorage.getItem(UNIT_KEY);
  return saved === "imperial" ? "imperial" : "metric";
}

/**
 * Central hook that owns weather + forecast data, loading/error state,
 * unit preference, recent-search history, and geolocation lookup.
 * Weather is always fetched in metric; unit conversion for display
 * happens in the formatting utilities so switching units is instant.
 */
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(loadUnit);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    window.localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  const persistHistory = useCallback((next) => {
    setHistory(next);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }, []);

  const addToHistory = useCallback(
    (label) => {
      setHistory((prev) => {
        const deduped = [label, ...prev.filter((item) => item.toLowerCase() !== label.toLowerCase())];
        const next = deduped.slice(0, MAX_HISTORY);
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    persistHistory([]);
  }, [persistHistory]);

  const loadByCoords = useCallback(async (lat, lon, labelForHistory) => {
    setLoading(true);
    setError(null);
    try {
      const [current, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon, "metric"),
        getForecastByCoords(lat, lon, "metric"),
      ]);
      setWeather(current);
      setForecast(forecastData);
      const label = labelForHistory || `${current.name}, ${current.sys?.country ?? ""}`.trim();
      if (label) addToHistory(label);
      return current;
    } catch (err) {
      setError(err.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  const searchCity = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      try {
        const matches = await geocodeCity(trimmed, 1);
        const place = matches[0];
        const label = [place.name, place.state, place.country].filter(Boolean).join(", ");
        await loadByCoords(place.lat, place.lon, label);
      } catch (err) {
        setError(err.message || "We couldn't find that city.");
        setLoading(false);
        throw err;
      }
    },
    [loadByCoords]
  );

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await loadByCoords(latitude, longitude);
        } catch {
          // error already set inside loadByCoords
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        setLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("Location access was denied. Search for a city instead.");
        } else {
          setError("Couldn't determine your location. Search for a city instead.");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, [loadByCoords]);

  const clearError = useCallback(() => setError(null), []);

  return {
    weather,
    forecast,
    loading,
    locating,
    error,
    unit,
    setUnit,
    history,
    searchCity,
    useCurrentLocation,
    clearHistory,
    clearError,
  };
}

export default useWeather;
