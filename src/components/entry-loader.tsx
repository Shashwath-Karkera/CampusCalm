"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EntryLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("campuscalm_loader_seen");
    const delay = seen ? 2500 : 1300;
    const id = window.setTimeout(() => {
      sessionStorage.setItem("campuscalm_loader_seen", "1");
      setLoading(false);
    }, delay);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Welcome to</p>
              <h1 className="mt-3 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                CampusCalm
              </h1>
              <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-300 to-blue-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
