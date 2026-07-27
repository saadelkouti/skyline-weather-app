export default function UnitToggle({ unit, onChange }) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md dark:border-white/10"
    >
      {["metric", "imperial"].map((option) => {
        const isActive = unit === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`focus-ring rounded-full px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              isActive
                ? "bg-cerulean text-white shadow-sm"
                : "text-slate-instrument hover:text-white dark:hover:text-white"
            }`}
          >
            {option === "metric" ? "°C" : "°F"}
          </button>
        );
      })}
    </div>
  );
}
