import { motion } from "framer-motion";
import { convertTemp, capitalize } from "../utils/formatters";
import WeatherDetails from "./WeatherDetails";

export default function CurrentWeather({ weather, unit, theme }) {
  if (!weather) return null;

  const condition = weather.weather?.[0];
  const iconUrl = condition ? `https://openweathermap.org/img/wn/${condition.icon}@4x.png` : null;
  const temp = convertTemp(weather.main.temp, unit);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel flex flex-col gap-6 p-6 sm:p-8"
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {weather.name}
            <span className="ml-2 align-middle text-lg font-normal text-white/60">{weather.sys?.country}</span>
          </h1>
          <p className="mt-1 instrument-label">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {iconUrl && (
            <motion.img
              src={iconUrl}
              alt={condition?.description || "weather icon"}
              className="h-24 w-24 drop-shadow-2xl sm:h-28 sm:w-28"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div>
            <p className="instrument-value text-6xl font-bold leading-none text-white sm:text-7xl">
              {Math.round(temp)}
              <span className="align-top text-2xl font-medium text-white/60">{unit === "metric" ? "°C" : "°F"}</span>
            </p>
            <p className="mt-1 text-lg capitalize text-white/80">{capitalize(condition?.description)}</p>
          </div>
        </div>
      </div>

      <WeatherDetails weather={weather} unit={unit} />
    </motion.section>
  );
}
