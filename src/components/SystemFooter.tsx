"use client";

import { useState, useEffect } from "react";
import { Activity, Server, Shield } from "lucide-react";

export function SystemFooter() {
    const [time, setTime] = useState<string>(() => new Date().toISOString());
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toISOString());
            setLatency(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(5, Math.min(50, prev + change));
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-schematic-bg/90 border-t border-schematic-grid backdrop-blur-sm py-1 px-4 text-[10px] font-mono text-schematic-secondary flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <Server className="w-3 h-3" />
                    <span>SERVER_TIME: {time}</span>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-schematic-accent" />
                    <span>LATENCY: {latency}ms</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-schematic-accent" />
                    <span>SECURE_CONNECTION</span>
                </div>
                <div>
                    BUILD_V2.4.0
                </div>
            </div>
        </footer>
    );
}
