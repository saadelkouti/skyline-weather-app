export function formatTemp(value, unit = "metric") {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  const symbol = unit === "metric" ? "°C" : "°F";
  return `${Math.round(value)}${symbol}`;
}

export function convertTemp(celsiusValue, unit) {
  if (celsiusValue === null || celsiusValue === undefined) return null;
  if (unit === "imperial") return celsiusValue * (9 / 5) + 32;
  return celsiusValue;
}

export function formatWindSpeed(metersPerSecond, unit = "metric") {
  if (metersPerSecond === null || metersPerSecond === undefined) return "--";
  if (unit === "imperial") {
    const mph = metersPerSecond * 2.23694;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(metersPerSecond)} m/s`;
}

export function formatVisibility(meters, unit = "metric") {
  if (meters === null || meters === undefined) return "--";
  if (unit === "imperial") {
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

export function formatTime(unixSeconds, timezoneOffsetSeconds = 0) {
  if (!unixSeconds) return "--";
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export function formatDay(unixSeconds, timezoneOffsetSeconds = 0) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function formatDate(unixSeconds, timezoneOffsetSeconds = 0) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Groups a 3-hour-interval /forecast list into one representative
 * entry per calendar day (prefers the reading closest to midday).
 */
export function groupForecastByDay(list, timezoneOffsetSeconds = 0) {
  const days = new Map();

  list.forEach((entry) => {
    const localDate = new Date((entry.dt + timezoneOffsetSeconds) * 1000);
    const dayKey = localDate.toISOString().slice(0, 10);
    const hour = localDate.getUTCHours();

    if (!days.has(dayKey)) {
      days.set(dayKey, { entry, hourDiff: Math.abs(hour - 12) });
    } else {
      const current = days.get(dayKey);
      const diff = Math.abs(hour - 12);
      if (diff < current.hourDiff) {
        days.set(dayKey, { entry, hourDiff: diff });
      }
    }
  });

  return Array.from(days.values())
    .map((v) => v.entry)
    .slice(0, 5);
}
