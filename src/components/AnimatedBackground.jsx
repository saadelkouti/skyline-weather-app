import { useMemo } from "react";
import { motion } from "framer-motion";

const RAIN_STREAKS = 26;
const SNOW_FLAKES = 34;

function seededSequence(count, seedMultiplier) {
  return Array.from({ length: count }, (_, i) => {
    const pseudo = Math.abs(Math.sin(i * seedMultiplier + 1));
    return pseudo - Math.floor(pseudo);
  });
}

function SunnyLayer({ isNight }) {
  return (
    <>
      <motion.div
        className={`absolute -top-24 right-[8%] h-72 w-72 rounded-full blur-3xl ${
          isNight ? "bg-cirrus/20" : "bg-amber/50"
        }`}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className={`absolute -top-16 right-[10%] h-48 w-48 rounded-full ${
          isNight ? "bg-cirrus/80" : "bg-gradient-to-br from-amber-soft to-amber"
        }`}
        style={{ boxShadow: isNight ? "0 0 60px 10px rgba(245,248,255,0.25)" : "0 0 90px 20px rgba(245,166,35,0.35)" }}
      />
    </>
  );
}

function CloudsLayer() {
  const clouds = useMemo(
    () => [
      { top: "12%", scale: 1.4, opacity: 0.5, duration: 55 },
      { top: "28%", scale: 1, opacity: 0.35, duration: 40 },
      { top: "48%", scale: 1.8, opacity: 0.25, duration: 70 },
      { top: "65%", scale: 1.1, opacity: 0.3, duration: 48 },
    ],
    []
  );
  return (
    <>
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute left-[-20%] w-[60%]"
          style={{ top: cloud.top, opacity: cloud.opacity }}
          animate={{ x: ["0%", "160%"] }}
          transition={{ duration: cloud.duration, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 200 80" style={{ transform: `scale(${cloud.scale})` }} className="w-full fill-white">
            <ellipse cx="60" cy="45" rx="55" ry="28" />
            <ellipse cx="110" cy="35" rx="45" ry="32" />
            <ellipse cx="150" cy="48" rx="40" ry="24" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function RainLayer() {
  const streaks = useMemo(() => seededSequence(RAIN_STREAKS, 12.9898), []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CloudsLayer />
      {streaks.map((seed, i) => {
        const left = seed * 100;
        const delay = seed * 0.9;
        const duration = 0.6 + seed * 0.5;
        return (
          <span
            key={i}
            className="absolute top-0 block h-16 w-[2px] rounded-full bg-gradient-to-b from-transparent via-teal-soft/70 to-teal-soft/10 animate-fall-rain"
            style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
          />
        );
      })}
    </div>
  );
}

function SnowLayer() {
  const flakes = useMemo(() => seededSequence(SNOW_FLAKES, 78.233), []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CloudsLayer />
      {flakes.map((seed, i) => {
        const left = seed * 100;
        const size = 3 + seed * 5;
        const delay = seed * 5;
        const duration = 5 + seed * 4;
        return (
          <span
            key={i}
            className="absolute top-0 block rounded-full bg-white/80 animate-fall-snow"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function ThunderstormLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CloudsLayer />
      <RainLayer />
      <div className="absolute inset-0 animate-flash bg-white" />
    </div>
  );
}

const LAYERS = {
  sunny: SunnyLayer,
  clouds: CloudsLayer,
  rain: RainLayer,
  snow: SnowLayer,
  thunderstorm: ThunderstormLayer,
};

/**
 * Full-viewport ambient background. Fixed behind the app shell, swaps its
 * gradient + particle layer based on the current condition and day/night.
 */
export default function AnimatedBackground({ theme }) {
  const variant = theme?.variant || "clouds";
  const isNight = theme?.isNight;
  const Layer = LAYERS[variant] || CloudsLayer;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        key={`${variant}-${isNight}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient || "from-midnight-deep to-midnight"}`}
      />
      <div className="absolute inset-0">
        <Layer isNight={isNight} />
      </div>
      {/* Horizon vignette keeps foreground cards legible over any variant */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/70 via-transparent to-midnight-deep/20" />
    </div>
  );
}
