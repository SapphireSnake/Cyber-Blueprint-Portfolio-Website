"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LOG_MESSAGES = [
    "INITIALIZING_SYSTEM_CORE...",
    "LOADING_MODULE: NEXT_JS_ROUTER...",
    "ESTABLISHING_SECURE_CONNECTION...",
    "USER_DETECTED: IP_TRACKING_DISABLED",
    "FETCHING_PROJECT_DATA...",
    "RENDERING_GRID_MATRIX...",
    "OPTIMIZING_ASSETS...",
    "SYSTEM_STATUS: NOMINAL",
    "LISTENING_FOR_INPUT_EVENTS...",
    "EXECUTING_BACKGROUND_TASKS...",
    "MEMORY_USAGE: 42MB [STABLE]",
    "NETWORK_LATENCY: 12ms",
    "UPDATING_DOM_NODES...",
    "GARBAGE_COLLECTION_PENDING...",
    "SYNCING_WITH_VIRTUAL_DOM...",
];

export function SystemLog() {
    const [logs, setLogs] = useState<string[]>(() => LOG_MESSAGES.slice(0, 5));
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Interval for adding random logs

        const interval = setInterval(() => {
            const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

            setLogs(prev => {
                const newLogs = [...prev, `[${timestamp}] ${randomMsg}`];
                if (newLogs.length > 20) return newLogs.slice(newLogs.length - 20);
                return newLogs;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="fixed bottom-4 left-4 z-40 hidden lg:block w-64 font-mono text-[10px] text-schematic-secondary opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <div className="border border-schematic-grid bg-schematic-bg/90 p-2 rounded h-32 overflow-hidden flex flex-col">
                <div className="border-b border-schematic-grid mb-1 pb-1 flex justify-between">
                    <span>SYSTEM_LOG</span>
                    <span className="animate-pulse">●</span>
                </div>
                <div ref={scrollRef} className="overflow-y-auto flex-1 scrollbar-hide space-y-1">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="whitespace-nowrap"
                        >
                            {">"} {log}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
