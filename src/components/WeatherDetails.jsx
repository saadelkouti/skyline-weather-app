import { motion } from "framer-motion";
import { formatWindSpeed, formatVisibility, formatTime } from "../utils/formatters";

const ICONS = {
  humidity: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a7.5 7.5 0 007.5-7.5c0-4.142-7.5-11.5-7.5-11.5S4.5 9.358 4.5 13.5A7.5 7.5 0 0012 21z" />
  ),
  wind: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h9a3 3 0 100-6 2.98 2.98 0 00-2.121.879M3.75 15h13.5a3 3 0 110 6 2.98 2.98 0 01-2.121-.879M3.75 12h16.5" />
  ),
  pressure: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  visibility: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
  sunrise: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3.5m6.364.136l-2.474 2.474M21 12h-3.5m-11 0H3m3.11-6.39L8.586 8.09M3.75 18h16.5M7 15a5 5 0 0110 0" />
  ),
  sunset: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5V6m6.364 3.636l-2.474 2.474M21 15h-3.5m-11 0H3m3.11-5.61L8.586 11.91M3.75 18h16.5M17 15a5 5 0 10-10 0" />
  ),
  feels: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
  ),
};

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-panel flex flex-col gap-2 p-4"
    >
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-cerulean-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          {icon}
        </svg>
        <span className="instrument-label">{label}</span>
      </div>
      <span className="instrument-value text-xl font-semibold text-white">{value}</span>
    </motion.div>
  );
}

export default function WeatherDetails({ weather, unit }) {
  if (!weather) return null;

  const { main, wind, visibility, sys, timezone } = weather;

  const stats = [
    { key: "feels", label: "Feels like", value: `${Math.round(main.feels_like)}°`, icon: ICONS.feels },
    { key: "humidity", label: "Humidity", value: `${main.humidity}%`, icon: ICONS.humidity },
    { key: "wind", label: "Wind speed", value: formatWindSpeed(wind?.speed, unit), icon: ICONS.wind },
    { key: "pressure", label: "Pressure", value: `${main.pressure} hPa`, icon: ICONS.pressure },
    { key: "visibility", label: "Visibility", value: formatVisibility(visibility, unit), icon: ICONS.visibility },
    { key: "sunrise", label: "Sunrise", value: formatTime(sys.sunrise, timezone), icon: ICONS.sunrise },
    { key: "sunset", label: "Sunset", value: formatTime(sys.sunset, timezone), icon: ICONS.sunset },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.key} icon={stat.icon} label={stat.label} value={stat.value} delay={i * 0.05} />
      ))}
    </div>
  );
}
