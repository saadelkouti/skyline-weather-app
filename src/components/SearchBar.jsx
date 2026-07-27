import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar({ onSearch, onLocate, locating, history, onClearHistory }) {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setShowHistory(false);
  }

  function handleHistoryClick(label) {
    setQuery(label);
    onSearch(label);
    setShowHistory(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="glass-panel flex items-center gap-2 p-2">
        <svg className="ml-2 h-5 w-5 flex-shrink-0 text-slate-instrument" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="Search a city — e.g. Casablanca"
          aria-label="Search for a city"
          className="focus-ring flex-1 rounded-xl bg-transparent px-1 py-2 font-body text-white placeholder-white/50 dark:text-white"
        />
        <button
          type="button"
          onClick={onLocate}
          disabled={locating}
          aria-label="Use my current location"
          title="Use my current location"
          className="focus-ring flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          {locating ? (
            <motion.svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </motion.svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          )}
        </button>
        <button type="submit" className="btn-primary !px-4 !py-2.5">
          Search
        </button>
      </form>

      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="glass-panel absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden p-2"
          >
            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              <span className="instrument-label">Recent</span>
              <button
                onClick={onClearHistory}
                className="focus-ring rounded font-mono text-[11px] text-slate-instrument transition hover:text-white"
              >
                Clear
              </button>
            </div>
            <ul>
              {history.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleHistoryClick(item)}
                    className="focus-ring flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-white/90 transition hover:bg-white/10"
                  >
                    <svg className="h-4 w-4 text-slate-instrument" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
