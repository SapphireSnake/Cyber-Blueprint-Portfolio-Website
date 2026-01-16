"use client";

import { motion } from "framer-motion";

interface ProjectDiagramProps {
    project: string;
}

export function ProjectDiagram({ project }: ProjectDiagramProps) {
    if (project === "Repo Rover") {
        return (
            <div className="w-full h-32 bg-schematic-bg border border-schematic-grid rounded p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-schematic-grid)_1px,_transparent_1px)] bg-[length:4px_4px]" />
                <div className="flex items-center justify-between h-full relative z-10 text-xs font-mono">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-10 border border-schematic-accent/50 rounded flex items-center justify-center bg-schematic-accent/5">
                            INGEST
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-schematic-grid mx-2 relative">
                        <motion.div
                            className="absolute top-1/2 left-0 w-2 h-2 bg-schematic-accent rounded-full -mt-1"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-10 border border-schematic-secondary/50 rounded flex items-center justify-center">
                            VECTOR_DB
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-schematic-grid mx-2 relative">
                        <motion.div
                            className="absolute top-1/2 left-0 w-2 h-2 bg-schematic-accent rounded-full -mt-1"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-10 border border-schematic-primary/50 rounded flex items-center justify-center">
                            LLM
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (project === "React Smart Lock") {
        return (
            <div className="w-full h-32 bg-schematic-bg border border-schematic-grid rounded p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-schematic-grid)_1px,_transparent_1px)] bg-[length:4px_4px]" />
                <div className="flex items-center justify-between h-full relative z-10 text-xs font-mono">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-10 border border-schematic-accent/50 rounded flex items-center justify-center bg-schematic-accent/5">
                            REACT_UI
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-schematic-grid mx-2 relative">
                        <motion.div
                            className="absolute top-1/2 left-0 w-2 h-2 bg-schematic-accent rounded-full -mt-1"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-10 border border-schematic-secondary/50 rounded flex items-center justify-center">
                            MICRO_CTRL
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-schematic-grid mx-2 relative">
                        <motion.div
                            className="absolute top-1/2 left-0 w-2 h-2 bg-schematic-accent rounded-full -mt-1"
                            animate={{ left: ["0%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-10 border border-schematic-primary/50 rounded flex items-center justify-center">
                            SOLENOID
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
