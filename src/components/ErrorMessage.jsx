import { motion, AnimatePresence } from "framer-motion";

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="alert"
          className="mx-auto flex w-full max-w-xl items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-left backdrop-blur-md"
        >
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-100">{message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="focus-ring rounded-lg p-1 text-red-200/70 transition hover:text-red-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
