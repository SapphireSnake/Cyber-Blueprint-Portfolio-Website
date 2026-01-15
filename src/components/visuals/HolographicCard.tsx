"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function HolographicCard({ children, className, onClick }: HolographicCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        // Check if we are in dark mode (schematic-mode)
        // We use getComputedStyle to read the CSS variable set in globals.css
        const isDarkMode = getComputedStyle(document.documentElement).getPropertyValue('--is-dark-mode').trim() === '1';

        if (!isDarkMode) {
            setRotateX(0);
            setRotateY(0);
            setGlarePosition({ x: 50, y: 50 });
            return;
        }

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max 10 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXValue = ((y - centerY) / centerY) * -5; // Invert Y for tilt
        const rotateYValue = ((x - centerX) / centerX) * 5;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);

        // Calculate glare position (percentage)
        setGlarePosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
        });
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setGlarePosition({ x: 50, y: 50 });
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <motion.div
                className="holographic-card-inner relative w-full h-full"
                style={{
                    rotateX,
                    rotateY,
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            >
                <div className="relative z-10">
                    {children}
                </div>

                {/* Glare Overlay */}
                <div
                    className="holographic-glare-v2 absolute inset-0 pointer-events-none rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        "--mouse-x": `${glarePosition.x}%`,
                        "--mouse-y": `${glarePosition.y}%`,
                    } as React.CSSProperties}
                />
            </motion.div>
        </motion.div>
    );
}
