"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Command,
    Search,
    FileText,
    Terminal,
    Cpu,
    Wifi,
    Moon,
    Sun,
    X,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Toggle Open/Close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Actions
    const actions = [
        {
            id: "resume",
            label: "DOWNLOAD_RESUME",
            icon: FileText,
            shortcut: "↵",
            action: () => {
                window.open("/resume.pdf", "_blank");
                setIsOpen(false);
            }
        },
        {
            id: "projects",
            label: "VIEW_PROJECTS",
            icon: Cpu,
            shortcut: "P",
            action: () => {
                document.getElementById("smart-search")?.scrollIntoView({ behavior: "smooth" });
                setIsOpen(false);
            }
        },
        {
            id: "contact",
            label: "ESTABLISH_UPLINK",
            icon: Wifi,
            shortcut: "C",
            action: () => {
                document.getElementById("data-uplink")?.scrollIntoView({ behavior: "smooth" });
                setIsOpen(false);
            }
        },
        {
            id: "theme",
            label: "TOGGLE_BLUEPRINT_MODE",
            icon: Sun,
            shortcut: "T",
            action: () => {
                window.dispatchEvent(new CustomEvent("toggle-theme"));
                setIsOpen(false);
            }
        },
        {
            id: "system",
            label: "SYSTEM_STATUS",
            icon: Terminal,
            shortcut: "S",
            action: () => {
                window.dispatchEvent(new CustomEvent("toggle-log"));
                setIsOpen(false);
            }
        }
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredActions.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                filteredActions[selectedIndex]?.action();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, filteredActions]);

    // Reset selection on query change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg bg-schematic-bg/90 border border-schematic-accent/50 rounded-xl shadow-[0_0_50px_rgba(0,255,157,0.1)] overflow-hidden flex flex-col"
                    >
                        {/* Header / Search */}
                        <div className="flex items-center px-4 py-3 border-b border-schematic-grid/50">
                            <Search className="w-5 h-5 text-schematic-secondary mr-3" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="TYPE_COMMAND..."
                                className="flex-1 bg-transparent border-none outline-none font-mono text-lg text-schematic-primary placeholder:text-schematic-grid"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-schematic-grid border border-schematic-grid px-1 rounded">ESC</span>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                            {filteredActions.length === 0 ? (
                                <div className="p-4 text-center text-schematic-secondary font-mono text-sm">
                                    NO_COMMANDS_FOUND
                                </div>
                            ) : (
                                filteredActions.map((action, index) => (
                                    <button
                                        key={action.id}
                                        onClick={action.action}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group",
                                            index === selectedIndex
                                                ? "bg-schematic-accent/10 border border-schematic-accent/30"
                                                : "hover:bg-schematic-grid/10 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={cn(
                                                "p-2 rounded bg-schematic-grid/20 text-schematic-secondary transition-colors",
                                                index === selectedIndex && "bg-schematic-accent text-schematic-bg"
                                            )}>
                                                <action.icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "font-mono text-sm transition-colors",
                                                index === selectedIndex ? "text-schematic-accent font-bold" : "text-schematic-primary"
                                            )}>
                                                {action.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            {index === selectedIndex && (
                                                <ArrowRight className="w-4 h-4 text-schematic-accent animate-pulse" />
                                            )}
                                            {action.shortcut && (
                                                <span className="text-[10px] font-mono text-schematic-secondary border border-schematic-grid/50 px-1.5 py-0.5 rounded min-w-[20px] text-center">
                                                    {action.shortcut}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-schematic-grid/10 border-t border-schematic-grid/30 flex justify-between items-center text-[10px] font-mono text-schematic-secondary">
                            <span>SYSTEM_READY</span>
                            <span>v2.0.4</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
