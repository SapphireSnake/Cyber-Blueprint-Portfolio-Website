"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function TunnelMesh({ color }: { color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Rotate based on mouse position for "steering" feel
            const { mouse } = state;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouse.y * 0.5, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.1);

            // "Warp" effect by rotating the tube itself
            meshRef.current.rotation.z += delta * 0.5;
        }
    });

    // Create a grid texture programmatically
    const [texture] = useState(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 64, 64);
            context.strokeStyle = '#ffffff';
            context.lineWidth = 2;
            context.strokeRect(0, 0, 64, 64);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(20, 4); // Repeat along the tube
        return tex;
    });

    useFrame((state, delta) => {
        if (texture) {
            // eslint-disable-next-line react-hooks/immutability
            texture.offset.x -= delta * 2; // Move "forward"
        }
    });

    return (
        <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
            {/* Tube geometry: radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}
            <cylinderGeometry args={[10, 10, 100, 16, 64, true]} />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                side={THREE.BackSide}
                color={color}
                transparent
                opacity={0.8}
                fog={true}
            />
        </mesh>
    );
}

function Scene({ color }: { color: string }) {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 40]} />
            <TunnelMesh color={color} />
            <EffectComposer>
                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>
        </>
    );
}

export function WarpTunnel({ onExit }: { onExit: () => void }) {
    const [color, setColor] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.body.classList.contains("blueprint-mode") ? "#ffffff" : "#00ff9d";
        }
        return "#00ff9d";
    });

    useEffect(() => {
        // Listen for theme changes if needed, or just rely on initial state if it doesn't change dynamically for this component
        // The previous code set it on mount.
        // If we want it to be dynamic, we need an event listener.
        // But for now, let's just fix the lint error by removing the redundant set in effect if it's only for initial.
        // Actually, `document.body` might not be available during SSR, so `useEffect` is safer for accessing document.
        // But setting state in effect triggers re-render.
        // Better:
        const isBlueprint = document.body.classList.contains("blueprint-mode");
        if ((isBlueprint && color !== "#ffffff") || (!isBlueprint && color !== "#00ff9d")) {
            setColor(isBlueprint ? "#ffffff" : "#00ff9d");
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onExit();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onExit]);

    return (
        <div className="fixed inset-0 z-[200] bg-black cursor-none">
            {/* UI Overlay */}
            <div className="absolute top-8 left-8 z-50 font-mono text-schematic-accent pointer-events-none">
                <h2 className="text-2xl font-bold mb-2">WARP_DRIVE_ACTIVE</h2>
                <div className="text-xs text-schematic-secondary mt-2">
                    <div>TRAJECTORY_LOCKED</div>
                    <div>VELOCITY: MAX</div>
                    <div className="mt-4">[ESC] DISENGAGE</div>
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <Scene color={color} />
            </Canvas>
        </div>
    );
}
