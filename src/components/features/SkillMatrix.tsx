"use client";

import { motion } from "framer-motion";
import { RESUME } from "@/data/resume";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Gauge, Zap, Thermometer, Activity } from "lucide-react";

export function SkillMatrix() {
    const [sensorData, setSensorData] = useState({
        temp: 24.5,
        battery: 98,
        load: 12,
        vibration: 0.02
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setSensorData(prev => ({
                temp: +(prev.temp + (Math.random() - 0.5) * 0.5).toFixed(1),
                battery: Math.max(0, +(prev.battery - 0.01).toFixed(2)),
                load: Math.min(100, Math.max(0, +(prev.load + (Math.random() - 0.5) * 5).toFixed(0))),
                vibration: Math.abs(+(prev.vibration + (Math.random() - 0.5) * 0.01).toFixed(3))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 border-b border-schematic-grid">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-4 mb-10">
                    <h2 className="text-2xl font-bold font-mono tracking-tighter">
                        TECH_STACK
                    </h2>
                    <div className="h-px flex-1 bg-schematic-grid" />
                    <span className="text-xs font-mono text-schematic-secondary">
                        STACKS_I_BUILD_WITH
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Languages Module */}
                    <div className="border border-schematic-grid rounded p-6 bg-schematic-bg/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-schematic-grid group-hover:bg-schematic-accent transition-colors duration-500" />
                        <h3 className="text-lg font-mono mb-6 text-schematic-secondary flex items-center justify-between">
                            <span>LANGUAGES</span>
                            <span className="text-xs text-schematic-accent opacity-50">
                                [ACTIVE]
                            </span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {RESUME.skills.languages.map((skill, index) => (
                                <div
                                    key={skill}
                                    className="flex items-center justify-between font-mono text-sm border-b border-schematic-grid/30 pb-2"
                                >
                                    <span>{skill}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-schematic-secondary">
                                            99.9%
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-schematic-accent shadow-[0_0_5px_var(--color-schematic-accent)] animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Software/Tools Module */}
                    <div className="border border-schematic-grid rounded p-6 bg-schematic-bg/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-schematic-grid group-hover:bg-schematic-accent transition-colors duration-500" />
                        <h3 className="text-lg font-mono mb-6 text-schematic-secondary flex items-center justify-between">
                            <span>SOFTWARE_STACK</span>
                            <span className="text-xs text-schematic-accent opacity-50">
                                [OPERATIONAL]
                            </span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {RESUME.skills.software.map((skill, index) => (
                                <div
                                    key={skill}
                                    className="flex items-center justify-between font-mono text-sm border-b border-schematic-grid/30 pb-2"
                                >
                                    <span>{skill}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-schematic-secondary">
                                            READY
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-schematic-accent/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Industrial Sensor Module */}
                    <div className="border border-schematic-grid rounded p-6 bg-schematic-bg/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-schematic-grid group-hover:bg-schematic-accent transition-colors duration-500" />
                        <h3 className="text-lg font-mono mb-6 text-schematic-secondary flex items-center justify-between">
                            <span>SYSTEM_STATUS</span>
                            <span className="text-xs text-schematic-accent opacity-50 animate-pulse">
                                [LIVE_FEED]
                            </span>
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-schematic-secondary">
                                    <Thermometer className="w-4 h-4" />
                                    <span className="font-mono text-sm">CORE_TEMP</span>
                                </div>
                                <span className="font-mono text-schematic-primary">{sensorData.temp}°C</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-schematic-secondary">
                                    <Zap className="w-4 h-4" />
                                    <span className="font-mono text-sm">BATTERY</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-2 bg-schematic-grid rounded-full overflow-hidden">
                                        <div className="h-full bg-schematic-accent" style={{ width: `${sensorData.battery}%` }} />
                                    </div>
                                    <span className="font-mono text-schematic-primary text-sm">{sensorData.battery}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-schematic-secondary">
                                    <Activity className="w-4 h-4" />
                                    <span className="font-mono text-sm">VIBRATION</span>
                                </div>
                                <span className="font-mono text-schematic-primary">{sensorData.vibration} G</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-schematic-secondary">
                                    <Gauge className="w-4 h-4" />
                                    <span className="font-mono text-sm">CPU_LOAD</span>
                                </div>
                                <span className="font-mono text-schematic-primary">{sensorData.load}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
