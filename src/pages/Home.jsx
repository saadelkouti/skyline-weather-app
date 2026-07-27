import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWeather from "../hooks/useWeather";
import useTheme from "../hooks/useTheme";
import { getWeatherTheme, isNightTime } from "../utils/weatherTheme";

import SearchBar from "../components/SearchBar";
import CurrentWeather from "../components/CurrentWeather";
import Forecast from "../components/Forecast";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import ThemeToggle from "../components/ThemeToggle";
import UnitToggle from "../components/UnitToggle";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const {
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
  } = useWeather();

  // Try to greet the user with their local weather on first load.
  useEffect(() => {
    useCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useMemo(() => {
    if (!weather) return getWeatherTheme("Clear", false);
    const night = isNightTime(weather.dt, weather.sys?.sunrise, weather.sys?.sunset);
    return getWeatherTheme(weather.weather?.[0]?.main, night);
  }, [weather]);

  async function handleSearch(query) {
    try {
      await searchCity(query);
    } catch {
      // error state already surfaced via useWeather
    }
  }

  return (
    <div className="relative min-h-screen w-full text-white">
      <AnimatedBackground theme={theme} />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight">Skyline</span>
              <span className="instrument-label hidden sm:inline">/ weather instrument</span>
            </div>
            <div className="flex items-center gap-3">
              <UnitToggle unit={unit} onChange={setUnit} />
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onLocate={useCurrentLocation}
            locating={locating}
            history={history}
            onClearHistory={clearHistory}
          />

          <ErrorMessage message={error} onDismiss={clearError} />
        </header>

        <main className="flex flex-1 flex-col gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" exit={{ opacity: 0 }}>
                <Loader label={locating ? "Locating you" : "Fetching conditions"} />
              </motion.div>
            ) : weather ? (
              <motion.div
                key={`${weather.id}-${unit}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-8"
              >
                <CurrentWeather weather={weather} unit={unit} theme={theme} />
                <Forecast forecast={forecast} unit={unit} />
              </motion.div>
            ) : (
              !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel flex flex-col items-center gap-2 py-16 text-center"
                >
                  <p className="font-display text-xl">Search a city to begin</p>
                  <p className="instrument-label">or allow location access above</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </main>

        <footer className="pb-4 text-center">
          <p className="instrument-label opacity-60">Data via OpenWeatherMap &middot; Skyline Weather App</p>
        </footer>
      </div>
    </div>
  );
}
