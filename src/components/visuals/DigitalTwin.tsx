"use client";

import { motion } from "framer-motion";

export function DigitalTwin() {
  return (
    <div className="relative w-full h-64 flex items-center justify-center perspective-1000 overflow-hidden border border-schematic-grid rounded-lg bg-schematic-bg/50">
      <div className="absolute top-2 left-2 flex items-center space-x-2">
        <span className="w-2 h-2 bg-schematic-accent rounded-full animate-pulse" />
        <span className="text-xs font-mono text-schematic-accent">DIGITAL_TWIN_V1.0</span>
      </div>

      <div className="relative w-20 h-20 preserve-3d animate-spin-slow">
        {/* Cube Faces */}
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 translate-z-16" />
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 -translate-z-16" />
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 rotate-y-90 translate-z-16" />
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 rotate-y-90 -translate-z-16" />
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 rotate-x-90 translate-z-16" />
        <div className="absolute inset-0 border-2 border-schematic-accent/50 bg-schematic-accent/5 rotate-x-90 -translate-z-16" />

        {/* Inner Core */}
        <div className="absolute inset-6 border border-schematic-primary/50 rounded-full animate-pulse" />
      </div>

      <div className="absolute bottom-4 w-full text-center">
        <p className="text-[10px] font-mono text-schematic-secondary">
          DEVICE_ID: 8F-2A-9C
        </p>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-16 {
          transform: translateZ(40px);
        }
        .-translate-z-16 {
          transform: translateZ(-40px);
        }
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        .rotate-x-90 {
          transform: rotateX(90deg);
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotateX(0) rotateY(0); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
