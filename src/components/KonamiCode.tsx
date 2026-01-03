"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export function KonamiCode() {
    const [input, setInput] = useState<string[]>([]);
    const [godMode, setGodMode] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newKey = e.key;

            setInput((prev) => {
                const updated = [...prev, newKey].slice(-KONAMI_CODE.length);

                if (JSON.stringify(updated) === JSON.stringify(KONAMI_CODE)) {
                    setGodMode(true);
                    // Optional: Reset after some time or keep it
                    // setTimeout(() => setGodMode(false), 10000);
                }

                return updated;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <AnimatePresence>
            {godMode && (
                <motion.div
                    className="fixed inset-0 z-[200] pointer-events-none border-[20px]"
                    style={{
                        borderImage: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) 1",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 font-mono text-2xl font-bold border border-white animate-pulse">
                        GOD_MODE_ENABLED
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-mono text-sm bg-black/50 px-4 py-1">
                        ALL_SYSTEMS_OVERCLOCKED
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
