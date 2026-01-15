"use client";

import { useState, useEffect } from "react";
import { Activity, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function SystemFooter({ radius, setRadius }: { radius: number; setRadius: (r: number) => void }) {
    const [time, setTime] = useState<string>("");
    const [latency, setLatency] = useState(12);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Time update interval
        const timeInterval = setInterval(() => {
            setTime(new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            }).toUpperCase());
        }, 1000);

        // Real-time latency (FPS) calculation
        let lastTime = performance.now();
        let frameCount = 0;
        let lastUpdate = performance.now();

        const updateLatency = () => {
            const now = performance.now();
            frameCount++;

            // Update every 500ms
            if (now - lastUpdate >= 500) {
                const fps = frameCount * 2; // Approximate FPS
                const frameTime = 1000 / fps; // Average frame time in ms

                // If frameTime is Infinity (0 fps), default to 0. Otherwise round to 1 decimal.
                setLatency(fps > 0 ? Math.round(frameTime) : 0);

                frameCount = 0;
                lastUpdate = now;
            }

            requestAnimationFrame(updateLatency);
        };

        const animationId = requestAnimationFrame(updateLatency);

        return () => {
            clearInterval(timeInterval);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const getLatencyColor = (ms: number) => {
        if (ms < 20) return "text-green-500";
        if (ms < 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-schematic-bg/90 border-t border-schematic-grid backdrop-blur-sm py-1 px-4 text-[10px] font-mono text-schematic-secondary flex justify-between items-center select-none">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <Server className="w-3 h-3" />
                    <span>SERVER_TIME: {mounted ? time : "INITIALIZING..."}</span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                    <Activity className={cn("w-3 h-3", getLatencyColor(latency))} />
                    <span className={getLatencyColor(latency)}>LATENCY: {latency}ms</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="hidden md:inline">GLOW_RANGE</span>
                    <input
                        type="range"
                        min="100"
                        max="800"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-24 md:w-32 h-1 bg-schematic-grid rounded-lg appearance-none cursor-pointer accent-schematic-accent"
                    />
                    <span className="text-schematic-accent w-8 md:w-12 text-right">{radius}px</span>
                </div>
            </div>
        </footer>
    );
}
