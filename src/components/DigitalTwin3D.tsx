"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DigitalTwin } from "./DigitalTwin"; // Fallback CSS Cube

function Model({ path }: { path: string }) {
    const { scene } = useGLTF(path);
    const ref = useRef<any>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.005; // Slow auto-rotation
        }
    });

    return <primitive ref={ref} object={scene} />;
}

export function DigitalTwin3D() {
    const [modelExists, setModelExists] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if the file exists (simple HEAD request)
        fetch("/cmm-sense.glb", { method: "HEAD" })
            .then((res) => setModelExists(res.ok))
            .catch(() => setModelExists(false));
    }, []);

    if (modelExists === null) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-schematic-accent">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (modelExists === false) {
        // Fallback to PNG if no model found
        return (
            <div className="w-full h-64 md:h-96 relative flex items-center justify-center border border-schematic-grid bg-schematic-grid/10">
                <img
                    src="/Attached-cmm-sense.png"
                    alt="CMM Sense Device"
                    className="max-h-full max-w-full object-contain opacity-80"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <div className="absolute bottom-2 right-2 text-xs text-schematic-secondary font-mono">
                    [IMG_LOADED]
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-64 md:h-96 relative group">
            <div className="absolute top-2 left-2 z-10 font-mono text-xs text-schematic-accent bg-schematic-bg/80 px-2 py-1 border border-schematic-accent/30">
                CMM-SENSE_DEVICE [ONLINE]
            </div>

            {/* PNG Overlay */}
            <div className="absolute bottom-2 right-2 z-10 h-80 w-auto p-1 opacity-80 hover:opacity-100 transition-opacity pointer-events-none">
                <img
                    src="/Attached-cmm-sense.png"
                    alt="Device Reference"
                    className="h-full w-auto object-contain"
                />
            </div>

            <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 8, 8] }} style={{ background: "transparent" }}>
                <Suspense fallback={<Html center><Loader2 className="w-8 h-8 text-schematic-accent animate-spin" /></Html>}>
                    <PresentationControls
                        speed={1.5}
                        global
                        zoom={0.5}
                        polar={[0, Math.PI / 2]}
                        azimuth={[-Infinity, Infinity]}
                    >
                        <Stage environment="city" intensity={0.05} shadows={false}>
                            <group position={[-3.5, 0, 0]}>
                                <Model path="/cmm-sense.glb" />
                            </group>
                        </Stage>
                    </PresentationControls>
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[-5, 5, 5]} intensity={1} />
                    <directionalLight position={[5, 5, -5]} intensity={0.5} color="#00ff9d" />
                </Suspense>
            </Canvas>
        </div>
    );
}
