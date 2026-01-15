"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Monitor, Wifi } from "lucide-react";

export function CmmSenseVisual() {
    const [phase, setPhase] = useState<'idle' | 'cutting' | 'booting' | 'shaking' | 'hit' | 'recovering' | 'signaling_up' | 'cooldown'>('idle');
    const [waveStyle, setWaveStyle] = useState<'smooth' | 'digital' | 'frequency'>('smooth');

    const toggleWave = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering main sequence
        setWaveStyle(prev =>
            prev === 'smooth' ? 'digital' :
                prev === 'digital' ? 'frequency' : 'smooth'
        );
    };

    const handleMouseEnter = () => {
        if (phase === 'idle') {
            runSequence();
        }
    };

    const runSequence = async () => {
        setPhase('cutting');
        await new Promise(r => setTimeout(r, 2000)); // Cut duration

        setPhase('booting');
        await new Promise(r => setTimeout(r, 500)); // Boot duration

        setPhase('shaking');
        await new Promise(r => setTimeout(r, 2000)); // Shake duration (Little waves)

        setPhase('hit');
        await new Promise(r => setTimeout(r, 1000)); // Hit/Red duration (Big Red Wave)

        setPhase('signaling_up');
        await new Promise(r => setTimeout(r, 500)); // Signal Up (Red Report)

        setPhase('recovering');
        await new Promise(r => setTimeout(r, 1500)); // Recover duration (Green again)

        setPhase('cooldown');
        await new Promise(r => setTimeout(r, 3000)); // Cooldown

        setPhase('idle');
    };

    // Wave Paths
    const waves = {
        smooth: [
            "M0 25 Q 10 20, 20 25 T 40 25 T 60 25 T 80 25 T 100 25",
            "M0 25 Q 10 30, 20 25 T 40 25 T 60 25 T 80 25 T 100 25",
            "M0 25 Q 10 20, 20 25 T 40 25 T 60 25 T 80 25 T 100 25"
        ],
        digital: [
            "M0 25 L 10 25 L 10 15 L 20 15 L 20 25 L 30 25 L 30 35 L 40 35 L 40 25 L 100 25",
            "M0 25 L 10 25 L 10 35 L 20 35 L 20 25 L 30 25 L 30 15 L 40 15 L 40 25 L 100 25",
            "M0 25 L 10 25 L 10 15 L 20 15 L 20 25 L 30 25 L 30 35 L 40 35 L 40 25 L 100 25"
        ],
        frequency: [
            "M0 25 Q 5 15, 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25",
            "M0 25 Q 5 35, 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25",
            "M0 25 Q 5 15, 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25"
        ]
    };

    return (
        <div
            className="relative w-full h-full cursor-pointer group"
            onMouseEnter={handleMouseEnter}
        >
            {/* Main Scene Container */}
            <div className="absolute inset-0 flex items-center justify-center">

                {/* 1. The Device */}
                <motion.div
                    className="relative z-10 w-48"
                    animate={
                        (phase === 'shaking' || phase === 'recovering') ? {
                            x: [0, 60, 0], // Move towards rock and back
                            transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
                        } : (phase === 'hit' || phase === 'signaling_up') ? {
                            x: 60, // Stop at rock
                            scale: [1, 1.05, 1],
                            transition: { duration: 0.2 }
                        } : { x: 0 }
                    }
                >
                    <img
                        src="/Attached-cmm-sense.png"
                        alt="CMM Sense Device"
                        className="w-full h-auto drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]"
                    />

                    {/* The Cord - Only visible during cutting */}
                    <AnimatePresence>
                        {phase === 'cutting' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-[60%] right-[-60px] w-[60px] h-1 bg-gray-500 origin-left rotate-12"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* 2. The Scissors */}
                <AnimatePresence>
                    {phase === 'cutting' && (
                        <motion.div
                            initial={{ opacity: 0, x: 100, y: 100 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                x: [100, 50, 50, 100],
                                y: [100, 0, -40, -100]
                            }}
                            transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
                            className="absolute z-20 text-red-500"
                            style={{ left: "50%", top: "50%" }}
                        >
                            <Scissors className="w-24 h-24 transform -rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. The Computer - Centered Vertically, Right Side */}
                <AnimatePresence>
                    {['booting', 'shaking', 'hit', 'recovering', 'signaling_up'].includes(phase) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-1/2 right-1 md:right-6 -translate-y-1/2 z-20"
                            onClick={toggleWave} // Toggle wave style on click
                        >
                            <div className="relative group/monitor">
                                <Monitor className="w-48 h-48 text-schematic-primary drop-shadow-lg bg-black/50 rounded-lg cursor-pointer hover:text-schematic-accent transition-colors" />

                                {/* Tooltip for Wave Toggle */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-schematic-accent opacity-0 group-hover/monitor:opacity-100 transition-opacity whitespace-nowrap">
                                    [CLICK_TO_CHANGE_WAVE: {waveStyle.toUpperCase()}]
                                </div>

                                {/* Screen Content */}
                                <div className="absolute top-4 left-4 right-4 bottom-14 bg-black/90 overflow-hidden flex items-center justify-center pointer-events-none">
                                    <motion.svg
                                        viewBox="0 0 100 50"
                                        className="w-full h-full"
                                    >
                                        <motion.path
                                            d="M0 25 L 100 25"
                                            animate={
                                                (phase === 'hit' || phase === 'signaling_up') ? {
                                                    stroke: "#ff0000",
                                                    d: "M0 25 Q 25 25, 50 0 Q 75 45, 100 25", // Red Up Spike
                                                    translateX: 0,
                                                    transition: { stroke: { duration: 0 } } // Instant Red
                                                } : (phase === 'shaking' || phase === 'recovering') ? {
                                                    stroke: "#00ff9d",
                                                    d: waves[waveStyle], // Use selected wave style
                                                    translateX: [0, -20],
                                                    transition: { stroke: { duration: 0 } } // Instant Green
                                                } : phase === 'booting' ? {
                                                    stroke: "#00ff9d",
                                                    d: [
                                                        "M0 25 Q 25 25, 50 25 T 100 25",
                                                        "M0 25 Q 25 5, 50 25 T 100 25",
                                                        "M0 25 Q 25 45, 50 25 T 100 25",
                                                        "M0 25 Q 25 25, 50 25 T 100 25"
                                                    ],
                                                    translateX: 0,
                                                    transition: { stroke: { duration: 0 } } // Instant Green
                                                } : { d: "M0 25 L 100 25", stroke: "#00ff9d", translateX: 0, transition: { stroke: { duration: 0 } } }
                                            }
                                            transition={phase === 'hit' ? { duration: 0.2 } : { duration: 1, ease: "linear", repeat: Infinity }}
                                            fill="none"
                                            strokeWidth="2"
                                        />
                                    </motion.svg>
                                </div>

                                {/* Upward Signal (During Red Phase) */}
                                {phase === 'signaling_up' && (
                                    <motion.div
                                        initial={{ opacity: 1, y: 0 }}
                                        animate={{ opacity: 0, y: -100 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute top-0 left-1/2 -translate-x-1/2"
                                    >
                                        <Wifi className="w-12 h-12 text-red-500" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 4. The Rock */}
                <motion.div
                    className="absolute z-0"
                    style={{ right: "20%", top: "60%" }} // Positioned to be hit
                    initial={{ opacity: 0 }}
                    animate={['shaking', 'hit', 'recovering'].includes(phase) ? { opacity: 1 } : { opacity: 0 }}
                >
                    <img
                        src="/rock.png"
                        alt="Rock Obstacle"
                        className="w-16 h-16 opacity-80"
                    />
                </motion.div>

            </div>
        </div>
    );
}
