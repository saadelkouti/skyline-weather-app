/**
 * Maps an OpenWeather "main" condition + day/night flag to a visual theme.
 * `variant` drives which <AnimatedBackground> renders; `gradient` and
 * `accent` are used to tint cards, buttons, and the instrument readouts.
 */
const THEMES = {
  sunny: {
    variant: "sunny",
    label: "Clear",
    gradientDay: "from-cerulean-soft via-amber-soft/70 to-cirrus",
    gradientNight: "from-midnight-deep via-midnight to-violet/40",
    accent: "amber",
  },
  clouds: {
    variant: "clouds",
    label: "Clouds",
    gradientDay: "from-slate-400 via-slate-300 to-cirrus",
    gradientNight: "from-midnight-deep via-midnight-soft to-slate-700",
    accent: "slate",
  },
  rain: {
    variant: "rain",
    label: "Rain",
    gradientDay: "from-slate-600 via-cerulean/60 to-teal/40",
    gradientNight: "from-midnight-deep via-midnight to-teal/20",
    accent: "teal",
  },
  snow: {
    variant: "snow",
    label: "Snow",
    gradientDay: "from-cirrus via-cerulean-soft/40 to-white",
    gradientNight: "from-midnight-soft via-midnight to-cirrus/10",
    accent: "cerulean",
  },
  thunderstorm: {
    variant: "thunderstorm",
    label: "Thunderstorm",
    gradientDay: "from-violet via-midnight-soft to-slate-700",
    gradientNight: "from-midnight-deep via-violet/30 to-midnight",
    accent: "violet",
  },
};

const CONDITION_MAP = {
  Clear: "sunny",
  Clouds: "clouds",
  Rain: "rain",
  Drizzle: "rain",
  Snow: "snow",
  Thunderstorm: "thunderstorm",
  Mist: "clouds",
  Smoke: "clouds",
  Haze: "clouds",
  Dust: "clouds",
  Fog: "clouds",
  Sand: "clouds",
  Ash: "clouds",
  Squall: "clouds",
  Tornado: "thunderstorm",
};

export function getWeatherTheme(main, isNight = false) {
  const key = CONDITION_MAP[main] || "clouds";
  const theme = THEMES[key];
  return {
    ...theme,
    gradient: isNight ? theme.gradientNight : theme.gradientDay,
    isNight,
  };
}

export function isNightTime(dt, sunrise, sunset) {
  if (!dt || !sunrise || !sunset) return false;
  return dt < sunrise || dt > sunset;
}

export default getWeatherTheme;
