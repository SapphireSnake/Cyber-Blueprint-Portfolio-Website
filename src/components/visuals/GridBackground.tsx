"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { useTheme } from "@/context/ThemeContext";

export function GridBackground({ radius = 100 }: { radius?: number }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [packets, setPackets] = useState<{ id: number; x: number; y: number; axis: 'x' | 'y'; direction: 1 | -1; distance: number }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    // No more theme watching needed! CSS variables handle it instantly.

    useEffect(() => {
        let animationFrameId: number;

        const handleMouseMove = (event: MouseEvent) => {
            if (animationFrameId) return;

            animationFrameId = requestAnimationFrame(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setMousePosition({
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top,
                    });
                }
                animationFrameId = 0;
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const gridSize = 40;
            const cols = Math.floor(rect.width / gridSize);
            const rows = Math.floor(rect.height / gridSize);

            let axis: 'x' | 'y';
            let direction: 1 | -1;

            if (theme === 'schematic') {
                // Dark Mode: Bias towards Top-Down (Matrix/Rain style)
                // 80% chance of Vertical (y), 90% chance of Down (1)
                axis = Math.random() > 0.2 ? 'y' : 'x';
                if (axis === 'y') {
                    direction = Math.random() > 0.1 ? 1 : -1;
                } else {
                    direction = Math.random() > 0.5 ? 1 : -1;
                }
            } else {
                // Light Mode: Random
                axis = Math.random() > 0.5 ? 'x' : 'y';
                direction = Math.random() > 0.5 ? 1 : -1;
            }

            let startX, startY;

            if (axis === 'x') {
                startX = direction === 1 ? -200 : rect.width + 200; // Increased buffer for longer trails
                startY = Math.floor(Math.random() * rows) * gridSize;
            } else {
                startX = Math.floor(Math.random() * cols) * gridSize;
                startY = direction === 1 ? -200 : rect.height + 200; // Increased buffer for longer trails
            }

            const newPacket = {
                id: Date.now(),
                x: startX,
                y: startY,
                axis: axis as 'x' | 'y',
                direction: direction as 1 | -1,
                distance: axis === 'x' ? rect.width + 400 : rect.height + 400
            };

            setPackets(prev => [...prev, newPacket]);

            // Cleanup old packets
            setTimeout(() => {
                setPackets(prev => prev.filter(p => p.id !== newPacket.id));
            }, 5000);

        }, 7000); // Spawn every 7 seconds (Reduced frequency)

        return () => clearInterval(interval);
    }, [theme]); // Re-run when theme changes to update logic

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden bg-schematic-bg pointer-events-none transition-colors duration-500">
                {/* Base Grid (Dim) */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
                />

                {/* Glow Bleed (Behind Grid Lines) */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle ${radius * 1.2}px at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-color-1), transparent 70%)`,
                        opacity: 0.1, // Subtle bleed
                        mixBlendMode: "screen"
                    }}
                />

                {/* Lit Grid (Gradient Lines) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        maskImage: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        WebkitMaskImage: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom right, var(--glow-color-1), var(--glow-color-2))`,
                            maskImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                            WebkitMaskImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                            maskSize: '40px 40px',
                            WebkitMaskSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Bloom Layer (Blurred Lit Grid) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        maskImage: `radial-gradient(${radius * 1.5}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        WebkitMaskImage: `radial-gradient(${radius * 1.5}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        opacity: 0.6,
                        filter: 'blur(4px)',
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom right, var(--glow-color-1), var(--glow-color-2))`,
                            maskImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                            WebkitMaskImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
                            maskSize: '40px 40px',
                            WebkitMaskSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Data Packets (Shooting Stars with Gradient) */}
                {packets.map(packet => {
                    const isX = packet.axis === 'x';
                    const isPositive = packet.direction === 1;

                    const headStyle = isX
                        ? { left: isPositive ? 'var(--trail-length)' : '0', top: 0, marginTop: '-1px' }
                        : { top: isPositive ? 'var(--trail-length)' : '0', left: 0, marginLeft: '-1px' };

                    const trailStyle = isX
                        ? { left: isPositive ? '0' : '4px', top: 0 }
                        : { top: isPositive ? '0' : '4px', left: 0 };

                    return (
                        <div key={packet.id} className="absolute z-10 will-change-transform" style={{ left: packet.x, top: packet.y }}>
                            {/* Trail */}
                            <motion.div
                                className="absolute"
                                style={{
                                    ...trailStyle,
                                    width: isX ? 'var(--trail-length)' : '2px',
                                    height: isX ? '2px' : 'var(--trail-length)',
                                    background: isX
                                        ? `linear-gradient(${isPositive ? '90deg' : '-90deg'}, transparent, var(--glow-color-1), var(--glow-color-2))`
                                        : `linear-gradient(${isPositive ? '180deg' : '0deg'}, transparent, var(--glow-color-1), var(--glow-color-2))`,
                                    borderRadius: '1px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    x: isX ? packet.direction * packet.distance : 0,
                                    y: !isX ? packet.direction * packet.distance : 0,
                                }}
                                transition={{ duration: 4, ease: "linear" }}
                            />

                            {/* Head */}
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    ...headStyle,
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: 'var(--glow-color-2)',
                                    boxShadow: `0 0 10px var(--glow-color-2)`
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    x: isX ? packet.direction * packet.distance : 0,
                                    y: !isX ? packet.direction * packet.distance : 0,
                                }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
