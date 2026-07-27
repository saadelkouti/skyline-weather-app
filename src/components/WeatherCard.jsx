import { motion } from "framer-motion";
import { convertTemp, formatDay } from "../utils/formatters";

export default function WeatherCard({ entry, timezone, unit, delay = 0 }) {
  const condition = entry.weather?.[0];
  const iconUrl = condition ? `https://openweathermap.org/img/wn/${condition.icon}@2x.png` : null;
  const high = convertTemp(entry.main.temp_max, unit);
  const low = convertTemp(entry.main.temp_min, unit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="glass-panel flex min-w-[128px] flex-1 flex-col items-center gap-1 p-4 text-center"
    >
      <span className="instrument-label">{formatDay(entry.dt, timezone)}</span>
      {iconUrl && (
        <img src={iconUrl} alt={condition?.description || "forecast icon"} className="h-14 w-14 drop-shadow-lg" loading="lazy" />
      )}
      <span className="text-xs capitalize text-white/70">{condition?.description}</span>
      <div className="mt-1 flex items-baseline gap-2 instrument-value">
        <span className="text-lg font-semibold text-white">{Math.round(high)}°</span>
        <span className="text-sm text-white/50">{Math.round(low)}°</span>
      </div>
    </motion.div>
  );
}
