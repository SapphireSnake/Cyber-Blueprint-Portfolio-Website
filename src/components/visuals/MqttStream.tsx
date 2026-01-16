"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Wifi, WifiOff, Minus, Square, Minimize2, Maximize2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MqttMessage {
    id: string;
    topic: string;
    payload: string;
    timestamp: string;
    className?: string;
}

const TOPICS = [
    "sys/cpu/temp",
    "sys/memory/usage",
    "net/uplink/latency",
    "iot/sensor/temp",
    "iot/sensor/humidity",
    "iot/relay/state",
    "db/query/duration",
    "api/request/status",
    "security/auth/attempt",
    "kernel/log/info"
];

// Command definitions
const COMMANDS: Record<string, string> = {
    help: "AVAILABLE COMMANDS: help, about, skills, clear",
    about: "Alex Mitelman | Full-Stack & Embedded Systems Engineer | Part-Time Server | Full-Time...",
    skills: "LANGUAGES: C++, Python, TypeScript, C#, Java, SQL | STACK: React, Next.js, Node.js, Docker.",
    clear: "CLEARING BUFFER...",
};

export function MqttStream({ side = "left" }: { side?: "left" | "right" }) {
    // MQTT State
    const [messages, setMessages] = useState<MqttMessage[]>([]);
    const [isConnected, setIsConnected] = useState(true);

    // Terminal State
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "SYSTEM_TERMINAL V2.4 INITIALIZED",
        "TYPE 'help' FOR COMMANDS",
    ]);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isMinimized, setIsMinimized] = useState(true); // Start minimized
    const scrollRef = useRef<HTMLDivElement>(null);

    // Real System Tracking (Left Side)
    useEffect(() => {
        if (side === "right" || !isConnected) return;

        // 1. Latency Tracking
        let lastTime = performance.now();
        let frameCount = 0;
        let lastUpdate = performance.now();

        const updateLatency = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastUpdate >= 2000) { // Log every 2 seconds
                const fps = frameCount / 2;
                const latency = fps > 0 ? Math.round(1000 / fps) : 0;

                let colorClass = "text-red-500";
                if (latency < 20) colorClass = "text-green-500";
                else if (latency < 50) colorClass = "text-yellow-500";

                const id = Math.random().toString(36).substring(7);
                const timestamp = new Date().toLocaleTimeString();
                const newMessage: MqttMessage = {
                    id,
                    topic: "sys/net/latency",
                    payload: `${latency}ms`,
                    timestamp,
                    className: colorClass
                };
                setMessages(prev => [...prev.slice(-50), newMessage]);

                frameCount = 0;
                lastUpdate = now;
            }
            requestAnimationFrame(updateLatency);
        };
        const animationId = requestAnimationFrame(updateLatency);

        // 2. Navigation Tracking (Intersection Observer)
        const sections = ["hero", "about", "skills", "smart-search", "experience", "education", "data-uplink"];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = Math.random().toString(36).substring(7);
                    const timestamp = new Date().toLocaleTimeString();
                    let sectionName = entry.target.id.toUpperCase().replace("-", "_");

                    // Custom Section Renaming
                    if (sectionName === "HERO") sectionName = "HOME";
                    else if (sectionName === "SMART_SEARCH") sectionName = "PROJECTS"; // Renamed as requested
                    else if (sectionName === "SKILLS") sectionName = "TECH_STACK";   // Renamed to avoid collision

                    const newMessage = {
                        id,
                        topic: "usr/nav/loc",
                        payload: `ENTERED: ${sectionName}`,
                        timestamp
                    };
                    setMessages(prev => [...prev.slice(-50), newMessage]);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // 3. Project Expansion Tracking
        const handleProjectExpand = (e: Event) => {
            const customEvent = e as CustomEvent;
            const projectName = customEvent.detail;
            const id = Math.random().toString(36).substring(7);
            const timestamp = new Date().toLocaleTimeString();
            const newMessage = {
                id,
                topic: "usr/ui/expand",
                payload: `${projectName.toUpperCase()}`,
                timestamp
            };
            setMessages(prev => [...prev.slice(-50), newMessage]);
        };

        // 4. Filter Tracking
        const handleFilterChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            const filterName = customEvent.detail;
            const id = Math.random().toString(36).substring(7);
            const timestamp = new Date().toLocaleTimeString();
            const newMessage = {
                id,
                topic: "usr/ui/filter",
                payload: `FILTER: ${filterName.toUpperCase()}`,
                timestamp
            };
            setMessages(prev => [...prev.slice(-50), newMessage]);
        };

        // 5. Game Tracking
        const handleGameOver = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { game, score } = customEvent.detail;
            const id = Math.random().toString(36).substring(7);
            const timestamp = new Date().toLocaleTimeString();

            let topic = "usr/game/over";
            let payload = `${score}`;

            if (game === "PYTHON_SNAKE") {
                topic = "usr/score/snake";
            } else if (game === "SPACE_RUN") {
                topic = "usr/score/space-run";
                payload = `${score}ms`; // "ms" suffix for distance
            }

            const newMessage = {
                id,
                topic,
                payload,
                timestamp,
                className: "text-schematic-accent"
            };
            setMessages(prev => [...prev.slice(-50), newMessage]);
        };

        window.addEventListener("project-expanded", handleProjectExpand);
        window.addEventListener("filter-changed", handleFilterChange);
        window.addEventListener("game-over", handleGameOver);

        return () => {
            cancelAnimationFrame(animationId);
            observer.disconnect();
            window.removeEventListener("project-expanded", handleProjectExpand);
            window.removeEventListener("filter-changed", handleFilterChange);
            window.removeEventListener("game-over", handleGameOver);
        };
    }, [isConnected, side]);

    // Auto-scroll Effect
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, history, isMinimized]);

    // Listen for global toggle event
    useEffect(() => {
        const handleToggle = () => setIsMinimized(prev => !prev);
        window.addEventListener("toggle-log", handleToggle);
        return () => window.removeEventListener("toggle-log", handleToggle);
    }, []);

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

    return (
        <div className={cn(
            "fixed bottom-4 z-30 w-80 font-mono text-xs",
            side === "right" ? "right-4" : "left-4"
        )}>
            <div className={cn(
                "bg-schematic-bg/90 border rounded-lg overflow-hidden shadow-lg backdrop-blur-sm flex flex-col transition-colors duration-300",
                side === "right" ? "border-gradient-void" : "border-schematic-grid"
            )}>
                {/* Header */}
                <div
                    className="bg-schematic-grid/20 p-2 flex justify-between items-center border-b border-schematic-grid cursor-pointer hover:bg-schematic-grid/30 transition-colors"
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    <div className="flex items-center space-x-2">
                        {side === "right" ? (
                            <Terminal className={cn("w-3 h-3", isConnected ? "text-schematic-accent animate-pulse" : "text-red-500")} />
                        ) : (
                            <Activity className={cn("w-3 h-3", isConnected ? "text-schematic-accent animate-pulse" : "text-red-500")} />
                        )}
                        <span className={cn(
                            "font-bold",
                            side === "right" ? "text-gradient-void" : "text-schematic-primary"
                        )}>
                            {side === "right" ? "SYSTEM_TERMINAL" : "LIVE_SYSTEM_LOG"}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {side === "left" && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsConnected(!isConnected); }}
                                className={cn("text-[10px] px-1 rounded border mr-2", isConnected ? "border-gradient-void" : "border-red-500 text-red-500")}
                                title={isConnected ? "DISCONNECT STREAM" : "CONNECT STREAM"}
                            >
                                {isConnected ? <span className="text-gradient-void">CNCT</span> : "OFF"}
                            </button>
                        )}

                        <button
                            className="hover:text-schematic-accent transition-colors"
                            title={isMinimized ? "EXPAND" : "MINIMIZE"}
                        >
                            {isMinimized ? <Maximize2 className="w-3 h-3 text-schematic-secondary" /> : <Minimize2 className="w-3 h-3 text-schematic-secondary" />}
                        </button>
                    </div>
                </div>

                {/* Body */}
                <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 256, opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden flex flex-col"
                        >
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide h-64"
                                onClick={() => side === "right" && inputRef.current?.focus()}
                            >
                                {side === "left" ? (
                                    // MQTT Stream Output
                                    <>
                                        {messages.map((msg) => (
                                            <div key={msg.id} className="flex space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                                                <span className="text-schematic-secondary shrink-0">[{msg.timestamp}]</span>
                                                <span className={cn("shrink-0", getTopicColor(msg.topic))}>{msg.topic}:</span>
                                                <span className={cn("truncate", msg.className || "text-schematic-primary")}>{msg.payload}</span>
                                            </div>
                                        ))}
                                        {!isConnected && (
                                            <div className="text-red-500 italic">Connection lost... Retrying...</div>
                                        )}
                                    </>
                                ) : (
                                    // Interactive Terminal Output
                                    <>
                                        {history.map((line, i) => (
                                            <div key={i} className={cn(
                                                "whitespace-nowrap",
                                                line.startsWith(">") ? "text-schematic-secondary" : "text-schematic-accent"
                                            )}>
                                                {line}
                                            </div>
                                        ))}
                                        <form onSubmit={handleCommand} className="flex items-center space-x-2 mt-1">
                                            <span className="text-schematic-secondary shrink-0">{">"}</span>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                className="flex-1 bg-transparent border-none outline-none text-schematic-primary placeholder-schematic-grid/50 min-w-0"
                                                autoFocus
                                                autoComplete="off"
                                                spellCheck="false"
                                            />
                                        </form>
                                        <div className="h-4" />
                                    </>
                                )}
                                <div className="h-4" /> {/* Spacer for auto-scroll */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function getTopicColor(topic: string) {
    if (topic.includes("error")) return "text-red-500";
    if (topic.includes("warning")) return "text-yellow-500";
    if (topic.includes("success")) return "text-schematic-accent";
    return "text-blue-400";
}
