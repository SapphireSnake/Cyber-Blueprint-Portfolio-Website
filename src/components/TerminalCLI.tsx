"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMANDS: Record<string, string> = {
    help: "AVAILABLE COMMANDS: help, about, skills, contact, clear",
    about: "ALEX MITELMAN // IOT & FULL STACK ENGINEER. BUILDING BRIDGES BETWEEN BITS AND ATOMS.",
    skills: "CORE MODULES: REACT, NEXT.JS, TYPESCRIPT, NODE.JS, PYTHON, C++, EMBEDDED SYSTEMS, MQTT, DOCKER.",
    contact: "TRANSMIT DATA TO: ALEXMIT450@GMAIL.COM",
    clear: "CLEARING BUFFER...",
};

export function TerminalCLI() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "WELCOME TO SYSTEM_CLI V1.0",
        "TYPE 'help' FOR AVAILABLE COMMANDS.",
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();

        if (!cmd) return;

        if (cmd === "clear") {
            setHistory([]);
        } else {
            const response = COMMANDS[cmd] || `ERROR: COMMAND '${cmd}' NOT RECOGNIZED.`;
            setHistory(prev => [...prev, `> ${input}`, response]);
        }

        setInput("");
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 bg-schematic-bg border border-schematic-accent text-schematic-accent p-3 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:bg-schematic-accent hover:text-schematic-bg transition-all"
            >
                <Terminal className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-schematic-bg border border-schematic-grid rounded-lg shadow-2xl overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-schematic-grid/10 border-b border-schematic-grid p-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2 px-2">
                        <Terminal className="w-4 h-4 text-schematic-accent" />
                        <span className="text-xs font-mono text-schematic-primary">ROOT@SYSTEM:~</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-schematic-secondary/20 rounded"><Minus className="w-3 h-3 text-schematic-secondary" /></button>
                        <button className="p-1 hover:bg-schematic-secondary/20 rounded"><Square className="w-3 h-3 text-schematic-secondary" /></button>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-500/20 rounded group"><X className="w-3 h-3 text-schematic-secondary group-hover:text-red-500" /></button>
                    </div>
                </div>

                {/* Terminal Body */}
                <div
                    ref={scrollRef}
                    className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-2"
                    onClick={() => inputRef.current?.focus()}
                >
                    {history.map((line, i) => (
                        <div key={i} className={cn(
                            "break-words",
                            line.startsWith(">") ? "text-schematic-secondary" : "text-schematic-accent"
                        )}>
                            {line}
                        </div>
                    ))}

                    <form onSubmit={handleCommand} className="flex items-center space-x-2 mt-2">
                        <span className="text-schematic-secondary">{">"}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-schematic-primary placeholder-schematic-grid/50"
                            autoFocus
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
