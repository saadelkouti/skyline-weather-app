import { groupForecastByDay } from "../utils/formatters";
import WeatherCard from "./WeatherCard";

export default function Forecast({ forecast, unit }) {
  if (!forecast) return null;

  const days = groupForecastByDay(forecast.list, forecast.city?.timezone || 0);

  return (
    <section>
      <h2 className="instrument-label mb-3 px-1">5-Day Outlook</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
        {days.map((entry, i) => (
          <WeatherCard
            key={entry.dt}
            entry={entry}
            timezone={forecast.city?.timezone || 0}
            unit={unit}
            delay={i * 0.06}
          />
        ))}
      </div>
    </section>
  );
}
