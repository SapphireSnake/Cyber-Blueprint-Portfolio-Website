"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function GridBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [radius, setRadius] = useState(300);
    const [packets, setPackets] = useState<{ id: number; x: number; y: number; axis: 'x' | 'y'; direction: 1 | -1; distance: number }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

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

            const axis = Math.random() > 0.5 ? 'x' : 'y';
            const direction = Math.random() > 0.5 ? 1 : -1;

            let startX, startY;

            if (axis === 'x') {
                startX = direction === 1 ? -100 : rect.width + 100;
                startY = Math.floor(Math.random() * rows) * gridSize;
            } else {
                startX = Math.floor(Math.random() * cols) * gridSize;
                startY = direction === 1 ? -100 : rect.height + 100;
            }

            const newPacket = {
                id: Date.now(),
                x: startX,
                y: startY,
                axis: axis as 'x' | 'y',
                direction: direction as 1 | -1,
                distance: axis === 'x' ? rect.width + 200 : rect.height + 200
            };

            setPackets(prev => [...prev, newPacket]);

            // Cleanup old packets
            setTimeout(() => {
                setPackets(prev => prev.filter(p => p.id !== newPacket.id));
            }, 5000);

        }, 4000); // Spawn every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden bg-schematic-bg pointer-events-none transition-colors duration-500">
                {/* Base Grid (Dim) */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px]"
                />

                {/* Glow Grid (Dynamic Color) - Masked by Cursor */}
                <motion.div
                    className="absolute inset-0 bg-[size:40px_40px]"
                    style={{
                        backgroundImage: `linear-gradient(to right, var(--color-schematic-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-schematic-accent) 1px, transparent 1px)`,
                        maskImage: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        WebkitMaskImage: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                    }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Data Packets (Moving Particles with Gradient Trails) (Shooting Star Effect) */}
                {packets.map(packet => {
                    const isX = packet.axis === 'x';
                    const isPositive = packet.direction === 1;

                    const headStyle = isX
                        ? { left: isPositive ? '60px' : '0', top: 0, marginTop: '-1px' }
                        : { top: isPositive ? '60px' : '0', left: 0, marginLeft: '-1px' };

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
                                    width: isX ? '60px' : '2px',
                                    height: isX ? '2px' : '60px',
                                    background: isX
                                        ? `linear-gradient(${isPositive ? '90deg' : '-90deg'}, transparent, var(--color-schematic-accent))`
                                        : `linear-gradient(${isPositive ? '180deg' : '0deg'}, transparent, var(--color-schematic-accent))`,
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
                                    backgroundColor: 'var(--color-schematic-accent)',
                                    boxShadow: `0 0 10px var(--color-schematic-accent)`
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

            {/* Control Slider - Moved OUT of z-[-1] container */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-schematic-bg/90 border border-schematic-grid p-3 rounded backdrop-blur-md shadow-lg pointer-events-auto">
                <span className="text-xs font-mono text-schematic-secondary">GLOW_RANGE</span>
                <input
                    type="range"
                    min="100"
                    max="800"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-32 h-1 bg-schematic-grid rounded-lg appearance-none cursor-pointer accent-schematic-accent"
                />
                <span className="text-xs font-mono text-schematic-accent w-12 text-right">{radius}px</span>
            </div>
        </>
    );
}
