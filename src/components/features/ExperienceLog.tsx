"use client";

import { RESUME } from "@/data/resume";
import { Clock, MapPin, ChevronRight, Terminal, Server, Cpu, Code, Wifi, Shield, Brain, Layers, Globe } from "lucide-react";

// Helper to get icon for stack
const getStackIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes("react") || t.includes("next")) return <Code className="w-3 h-3" />;
    if (t.includes("iot") || t.includes("hardware")) return <Cpu className="w-3 h-3" />;
    if (t.includes("security") || t.includes("network")) return <Shield className="w-3 h-3" />;
    if (t.includes("ai") || t.includes("ml")) return <Brain className="w-3 h-3" />;
    if (t.includes("c++") || t.includes("c#")) return <Terminal className="w-3 h-3" />;
    return <Layers className="w-3 h-3" />;
};

export function ExperienceLog() {
    return (
        <section id="experience" className="mb-20 relative max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="h-px bg-schematic-grid flex-grow" />
                <div className="flex items-center space-x-2 text-schematic-primary">
                    <Terminal className="w-5 h-5" />
                    <h2 className="text-2xl font-bold font-mono tracking-wider">OPERATIONAL_HISTORY</h2>
                </div>
                <div className="h-px bg-schematic-grid flex-grow" />
            </div>

            {/* Main Container (Large Rectangle) */}
            <div className="glass-panel p-6 md:p-8 rounded-lg space-y-6">
                {RESUME.experience.map((job, index) => (
                    // Inner Card (Rectangle inside)
                    <div
                        key={index}
                        className="group glass-base p-6 rounded hover:border-schematic-accent/50 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Logo Column */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                    {job.logo ? (
                                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-2 border-schematic-grid rounded-lg">
                                            <div className="text-3xl font-bold font-mono text-schematic-secondary group-hover:text-schematic-accent">
                                                {job.company.charAt(0)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-grow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-schematic-primary font-mono group-hover:text-schematic-accent transition-colors">
                                            {job.company}
                                        </h3>
                                        <div className="text-lg text-schematic-secondary font-mono">
                                            {job.role}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end mt-2 md:mt-0 space-y-1 text-sm text-schematic-secondary/70 font-mono">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{job.period}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{job.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack Badges */}
                                {job.stack && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.stack.map((tech, i) => (
                                            <span key={i} className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-mono bg-schematic-accent/5 text-schematic-accent border border-schematic-accent/20">
                                                {getStackIcon(tech)}
                                                <span>{tech}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {job.description && (
                                    <p className="text-schematic-secondary/90 font-mono text-sm leading-relaxed mb-4">
                                        {job.description}
                                    </p>
                                )}

                                <ul className="space-y-2">
                                    {job.achievements.map((achievement, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-schematic-secondary/90 group-hover:text-schematic-secondary transition-colors text-sm leading-relaxed">
                                            <ChevronRight className="w-4 h-4 mt-1 text-schematic-accent flex-shrink-0 opacity-50 group-hover:opacity-100" />
                                            <span>{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
