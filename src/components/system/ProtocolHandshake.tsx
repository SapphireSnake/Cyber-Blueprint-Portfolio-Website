"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLIENT_LOGS = [
    "INIT_UPLINK_SEQUENCE...",
    "RESOLVING_HOST...",
    "HANDSHAKE_SYN...",
    "SENDING_CREDENTIALS...",
    "REQUESTING_ACCESS...",
    "DOWNLOADING_ASSETS...",
    "RENDERING_VIEWPORT...",
];

const SERVER_LOGS = [
    "LISTENING_PORT_443...",
    "HOST_FOUND: 127.0.0.1",
    "HANDSHAKE_ACK...",
    "AUTH_VERIFIED...",
    "ACCESS_GRANTED...",
    "ASSETS_TRANSFER_COMPLETE...",
    "SESSION_ESTABLISHED...",
];

export function ProtocolHandshake({ onComplete }: { onComplete: () => void }) {
    const [clientLines, setClientLines] = useState<string[]>([]);
    const [serverLines, setServerLines] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let step = 0;
        const interval = setInterval(() => {
            if (step < CLIENT_LOGS.length) {
                setClientLines(prev => [...prev, CLIENT_LOGS[step]]);
                // Server responds slightly after
                setTimeout(() => {
                    setServerLines(prev => [...prev, SERVER_LOGS[step]]);
                }, 100);
                step++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(onComplete, 500);
                }, 800);
            }
        }, 300); // Faster speed

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono text-xs md:text-sm"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full max-w-4xl grid grid-cols-2 gap-8 p-8">
                        {/* Client Column */}
                        <div className="border-r border-schematic-grid pr-8 text-right">
                            <div className="mb-4 text-schematic-secondary border-b border-schematic-grid pb-2">CLIENT_UPLINK</div>
                            {clientLines.map((line, i) => (
                                <div key={i} className="text-schematic-accent mb-1">{line}</div>
                            ))}
                        </div>

                        {/* Server Column */}
                        <div className="pl-8">
                            <div className="mb-4 text-schematic-secondary border-b border-schematic-grid pb-2">SERVER_DOWNLINK</div>
                            {serverLines.map((line, i) => (
                                <div key={i} className="text-blue-400 mb-1">{line}</div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
