"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, Settings, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { SnakeGame } from "./SnakeGame";
import { SpaceRun } from "./SpaceRun";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [showSnake, setShowSnake] = useState(false);
    const [showWarp, setShowWarp] = useState(false);

    useEffect(() => {
        // Sequence:
        // 0: Initial Black
        // 1: CRT Line (100ms)
        // 2: CRT Expand (300ms)
        // 3: Connection Lines (800ms)
        // 4: Text Typing (1000ms)
        // 5: Menu Appear

        const timers = [
            setTimeout(() => setStep(1), 0),
            setTimeout(() => setStep(2), 200),
            setTimeout(() => setStep(3), 400),
            setTimeout(() => setStep(4), 1200),
            setTimeout(() => setStep(5), 2700),
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    const handleEnterSystem = () => {
        setStep(6); // Fade out
        setTimeout(onComplete, 500);
    };

    const handleSnake = () => {
        setShowSnake(true);
    };

    const handleWarp = () => {
        setShowWarp(true);
    };

    if (showSnake) {
        return <SnakeGame onExit={() => setShowSnake(false)} />;
    }

    if (showWarp) {
        return <SpaceRun onExit={() => setShowWarp(false)} />;
    }

    return (
        <AnimatePresence>
            {step < 6 && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* CRT Turn On Animation */}
                    {step === 1 && (
                        <motion.div
                            initial={{ scaleX: 0, scaleY: 0.005 }}
                            animate={{ scaleX: 1, scaleY: 0.005 }}
                            transition={{ duration: 0.1 }}
                            className="w-full h-2 bg-white shadow-[0_0_50px_white]"
                        />
                    )}
                    {step >= 2 && (
                        <div className="w-full h-full relative p-8 font-mono text-schematic-accent">
                            {/* CRT Scanlines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[size:100%_2px,3px_100%]" />

                            {/* Connection Animation */}
                            {step >= 3 && (
                                <>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "50%" }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute top-1/2 left-0 h-[1px] bg-schematic-accent shadow-[0_0_10px_#00ff9d]"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "50%" }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute top-1/2 right-0 h-[1px] bg-schematic-accent shadow-[0_0_10px_#00ff9d]"
                                    />
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.2 }}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-schematic-accent rounded-full shadow-[0_0_20px_#00ff9d]"
                                    />
                                </>
                            )}

                            {/* Content */}
                            <div className="relative z-20 max-w-2xl mx-auto mt-[20vh]">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    {step >= 4 && (
                                        <div className="flex items-center space-x-2 text-xl mb-8">
                                            <Terminal className="w-6 h-6" />
                                            <span>SYSTEM_BOOT_SEQUENCE_INITIATED...</span>
                                        </div>
                                    )}

                                    {step >= 4 && (
                                        <div className="space-y-2 text-sm text-schematic-secondary">
                                            <p>{">"} CHECKING_ integrity... OK</p>
                                            <p>{">"} LOADING_ modules... OK</p>
                                            <p>{">"} ESTABLISHING_ uplink... OK</p>
                                            <p>{">"} MOUNTING_ file_system... OK</p>
                                        </div>
                                    )}

                                    {step >= 5 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-12 border border-schematic-grid p-8 rounded bg-schematic-bg/50 backdrop-blur-sm"
                                        >
                                            <h2 className="text-center text-2xl font-bold mb-8 text-white tracking-widest">SELECT_BOOT_MODE</h2>

                                            <div className="space-y-4">
                                                <button
                                                    onClick={handleEnterSystem}
                                                    className="w-full group flex items-center justify-between p-4 border border-schematic-grid hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all"
                                                >
                                                    <span className="flex items-center space-x-4">
                                                        <span className="text-schematic-grid group-hover:text-schematic-accent">[1]</span>
                                                        <span className="font-bold">ENTER_PORTFOLIO</span>
                                                    </span>
                                                    <Power className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>

                                                <button
                                                    onClick={handleSnake}
                                                    className="w-full group flex items-center justify-between p-4 border border-schematic-grid hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all"
                                                >
                                                    <span className="flex items-center space-x-4">
                                                        <span className="text-schematic-grid group-hover:text-schematic-accent">[2]</span>
                                                        <span className="font-bold">PYTHON_SNAKE_GAME</span>
                                                    </span>
                                                    <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>

                                                <button
                                                    onClick={handleWarp}
                                                    className="w-full group flex items-center justify-between p-4 border border-schematic-grid hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all"
                                                >
                                                    <span className="flex items-center space-x-4">
                                                        <span className="text-schematic-grid group-hover:text-schematic-accent">[3]</span>
                                                        <span className="font-bold">INITIATE_SPACE_RUN</span>
                                                    </span>
                                                    <Settings className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
