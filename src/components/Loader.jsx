import { motion } from "framer-motion";

/**
 * Instrument-panel style loader: a sweeping needle inside a dial,
 * echoing the "reading being taken" feel of the rest of the UI.
 */
export default function Loader({ label = "Reading the sky" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16" role="status" aria-live="polite">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/15 dark:border-white/10" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cerulean border-r-cerulean"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-3 rounded-full bg-cerulean/20"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="instrument-label text-slate-instrument">{label}&hellip;</p>
    </div>
  );
}
