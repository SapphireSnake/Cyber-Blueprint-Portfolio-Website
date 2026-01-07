"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Wifi, WifiOff, Minus, Square, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MqttMessage {
    id: string;
    topic: string;
    payload: string;
    timestamp: string;
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

export function MqttStream() {
    const [messages, setMessages] = useState<MqttMessage[]>([]);
    const [isConnected, setIsConnected] = useState(true);
    const [isMinimized, setIsMinimized] = useState(true); // Start minimized
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
            const id = Math.random().toString(36).substring(7);
            const timestamp = new Date().toLocaleTimeString();

            let payload = "";
            if (topic.includes("temp")) payload = `${(Math.random() * 30 + 20).toFixed(1)}°C`;
            else if (topic.includes("usage")) payload = `${Math.floor(Math.random() * 100)}%`;
            else if (topic.includes("latency")) payload = `${Math.floor(Math.random() * 50 + 10)}ms`;
            else if (topic.includes("state")) payload = Math.random() > 0.5 ? "ON" : "OFF";
            else if (topic.includes("status")) payload = Math.random() > 0.9 ? "500 ERROR" : "200 OK";
            else payload = `DATA_PACKET_0x${Math.floor(Math.random() * 1000).toString(16)}`;

            const newMessage = { id, topic, payload, timestamp };

            setMessages(prev => [...prev.slice(-50), newMessage]);
        }, 800);

        return () => clearInterval(interval);
    }, [isConnected]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isMinimized]);

    // Listen for global toggle event
    useEffect(() => {
        const handleToggle = () => setIsMinimized(prev => !prev);
        window.addEventListener("toggle-log", handleToggle);
        return () => window.removeEventListener("toggle-log", handleToggle);
    }, []);

    return (
        <div className="fixed bottom-4 left-4 z-40 w-80 font-mono text-xs">
            <div className="bg-schematic-bg/90 border border-schematic-grid rounded-lg overflow-hidden shadow-lg backdrop-blur-sm flex flex-col transition-colors duration-300">
                {/* Header */}
                <div
                    className="bg-schematic-grid/20 p-2 flex justify-between items-center border-b border-schematic-grid cursor-pointer hover:bg-schematic-grid/30 transition-colors"
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    <div className="flex items-center space-x-2">
                        <Activity className={cn("w-3 h-3", isConnected ? "text-schematic-accent animate-pulse" : "text-red-500")} />
                        <span className="font-bold text-schematic-primary">LIVE_SYSTEM_LOG</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsConnected(!isConnected); }}
                            className={cn("text-[10px] px-1 rounded border mr-2", isConnected ? "border-schematic-accent text-schematic-accent" : "border-red-500 text-red-500")}
                            title={isConnected ? "DISCONNECT STREAM" : "CONNECT STREAM"}
                        >
                            {isConnected ? "CNCT" : "OFF"}
                        </button>

                        <button
                            className="hover:text-schematic-accent transition-colors"
                            title={isMinimized ? "EXPAND" : "MINIMIZE"}
                        >
                            {isMinimized ? <Maximize2 className="w-3 h-3 text-schematic-secondary" /> : <Minimize2 className="w-3 h-3 text-schematic-secondary" />}
                        </button>
                    </div>
                </div>

                {/* Log Body */}
                <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 256, opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden flex flex-col"
                        >
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide h-64">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="flex space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                                        <span className="text-schematic-secondary shrink-0">[{msg.timestamp}]</span>
                                        <span className={cn("shrink-0", getTopicColor(msg.topic))}>{msg.topic}</span>
                                        <span className="text-schematic-primary truncate">{msg.payload}</span>
                                    </div>
                                ))}
                                {!isConnected && (
                                    <div className="text-red-500 italic">Connection lost... Retrying...</div>
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
