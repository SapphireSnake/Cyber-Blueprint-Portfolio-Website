"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Text } from "@react-three/drei";

// Game Constants
// Game Constants
// Game Constants
const TUNNEL_RADIUS = 8;
const SEGMENTS = 16;
const SEGMENT_LENGTH = 4;
const SPEED = 8;
const ROTATION_SPEED = 1.5;
const VIEW_DISTANCE = 90; // Increased from 60
const GRAVITY = 12;
const JUMP_FORCE = 8;

interface GameState {
    score: number;
    gameOver: boolean;
    speed: number;
}

function Stars() {
    const starsRef = useRef<THREE.Points>(null);
    const [positions] = useState(() => {
        const pos = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            const r = TUNNEL_RADIUS + 10 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        return pos;
    });

    useFrame((state, delta) => {
        if (starsRef.current) {
            starsRef.current.rotation.z += delta * 0.05;
        }
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} />
        </points>
    );
}

function SpeedLines({ isFalling }: { isFalling: boolean }) {
    const linesRef = useRef<THREE.InstancedMesh>(null);
    const count = 100;

    useFrame((state, delta) => {
        if (!linesRef.current || !isFalling) return;
        // Animate lines moving up rapidly to simulate falling down
        // ... (Simple implementation for now, or just skip if complex)
        // Actually, let's just use a simple particle system that only appears when falling
    });

    if (!isFalling) return null;

    return (
        <group>
            {/* Placeholder for speed lines - simple vertical streaks */}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={i} position={[
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 20 - 10,
                    (Math.random() - 0.5) * 10
                ]}>
                    <boxGeometry args={[0.05, 2, 0.05]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    )
}

function BackgroundTunnel() {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[TUNNEL_RADIUS + 2, TUNNEL_RADIUS + 2, VIEW_DISTANCE * SEGMENT_LENGTH, 32, 64, true]} />
            <meshBasicMaterial color="#00ff9d" wireframe={true} transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>
    );
}

function Player({
    gameActive,
    playerYRef,
    setGameOver,
    gameOver,
    isOverHole
}: {
    gameActive: boolean,
    playerYRef: React.MutableRefObject<number>,
    setGameOver: (state: boolean) => void,
    gameOver: boolean,
    isOverHole: React.MutableRefObject<boolean>
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    // Local state for physics to avoid re-renders, but we need to sync with ref
    const yPos = useRef(-TUNNEL_RADIUS + 0.5);
    const velocityY = useRef(0);
    const jumpCount = useRef(0);

    useFrame((state, delta) => {
        // If game over, let player fall into abyss
        if (gameOver) {
            velocityY.current -= GRAVITY * delta;
            yPos.current += velocityY.current * delta;

            if (meshRef.current) {
                meshRef.current.position.y = yPos.current;
            }
            playerYRef.current = yPos.current;
            return;
        }

        if (!gameActive) return;

        // Apply Gravity
        const groundLevel = -TUNNEL_RADIUS + 0.5;

        // If we are above ground, apply gravity
        if (yPos.current > groundLevel || velocityY.current > 0) {
            velocityY.current -= GRAVITY * delta;
            const newY = yPos.current + velocityY.current * delta;

            // Check landing
            if (newY <= groundLevel && velocityY.current < 0) {
                if (isOverHole.current) {
                    // Fall through
                    yPos.current = newY;
                } else {
                    // Land safely
                    yPos.current = groundLevel;
                    velocityY.current = 0;
                    jumpCount.current = 0;
                }
            } else {
                yPos.current = newY;
            }
        } else if (isOverHole.current) {
            // Fall
            velocityY.current -= GRAVITY * delta;
            yPos.current += velocityY.current * delta;
        }

        // Check Death Depth
        if (yPos.current < -20 && !gameOver) {
            setGameOver(true);
        }

        // Sync ref
        if (meshRef.current) {
            meshRef.current.position.y = yPos.current;
        }
        playerYRef.current = yPos.current;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameActive || gameOver) return;
            if (e.key === "ArrowUp") {
                if (jumpCount.current < 2) {
                    velocityY.current = JUMP_FORCE;
                    jumpCount.current++;
                }
            }
            if (e.key === "ArrowDown") {
                velocityY.current = -JUMP_FORCE * 1.5;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameActive, gameOver]);

    // Reset physics on mount
    useEffect(() => {
        yPos.current = -TUNNEL_RADIUS + 0.5;
        velocityY.current = 0;
        jumpCount.current = 0;
        playerYRef.current = -TUNNEL_RADIUS + 0.5;
    }, []);

    return (
        <mesh ref={meshRef} position={[0, -TUNNEL_RADIUS + 0.5, 2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#00ff9d" />
            <pointLight intensity={2} distance={10} color="#00ff9d" />
        </mesh>
    );
}

function Tunnel({
    tunnelRotation,
    gameActive,
    isOverHole,
    isFalling,
    playerYRef
}: {
    tunnelRotation: number,
    gameActive: boolean,
    isOverHole: React.MutableRefObject<boolean>,
    isFalling: boolean,
    playerYRef: React.MutableRefObject<number>
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const [rings, setRings] = useState<boolean[][]>([]);
    const offsetZ = useRef(0);
    const lastRingIndex = useRef(0);
    const pathCenter = useRef(0);

    // Initialize rings
    useEffect(() => {
        const initialRings = [];
        for (let i = 0; i < VIEW_DISTANCE; i++) {
            if (i < 5) {
                initialRings.push(new Array(SEGMENTS).fill(true));
            } else {
                const ring = new Array(SEGMENTS).fill(false);
                if (Math.random() < 0.5) {
                    pathCenter.current = (pathCenter.current + (Math.random() < 0.5 ? 1 : -1) + SEGMENTS) % SEGMENTS;
                }
                for (let j = -1; j <= 1; j++) {
                    const idx = (pathCenter.current + j + SEGMENTS) % SEGMENTS;
                    ring[idx] = true;
                }
                if (Math.random() < 0.1) {
                    ring[pathCenter.current] = false;
                }
                initialRings.push(ring);
            }
        }
        setRings(initialRings);
    }, []);

    // Game Loop
    useFrame((state, delta) => {
        if ((!gameActive && !isFalling) || !meshRef.current) return;

        // Only move forward if game is active and NOT falling
        if (gameActive && !isFalling) {
            const moveDist = SPEED * delta;
            offsetZ.current += moveDist;

            const currentRingIdx = Math.floor((offsetZ.current + 2) / SEGMENT_LENGTH);

            if (currentRingIdx > lastRingIndex.current) {
                lastRingIndex.current = currentRingIdx;

                setRings(prev => {
                    const next = [...prev.slice(1)];
                    const newRing = new Array(SEGMENTS).fill(false);
                    if (Math.random() < 0.4) {
                        const shift = Math.random() < 0.5 ? 1 : -1;
                        pathCenter.current = (pathCenter.current + shift + SEGMENTS) % SEGMENTS;
                    }
                    for (let j = -1; j <= 1; j++) {
                        const idx = (pathCenter.current + j + SEGMENTS) % SEGMENTS;
                        newRing[idx] = true;
                    }
                    if (Math.random() < 0.2) {
                        newRing[pathCenter.current] = false;
                    }
                    next.push(newRing);
                    return next;
                });
            }
        }

        // Collision Detection Logic (Always run to update isOverHole)
        let normalizedRot = tunnelRotation % (Math.PI * 2);
        if (normalizedRot < 0) normalizedRot += Math.PI * 2;

        const segmentAngleStep = (Math.PI * 2) / SEGMENTS;
        const bottomAngle = Math.PI * 1.5;

        let targetSegmentAngle = bottomAngle - tunnelRotation;
        targetSegmentAngle = targetSegmentAngle % (Math.PI * 2);
        if (targetSegmentAngle < 0) targetSegmentAngle += Math.PI * 2;

        const segmentIdx = Math.round(targetSegmentAngle / segmentAngleStep) % SEGMENTS;

        // Use ref for playerY check
        if (rings.length > 0 && playerYRef.current <= -TUNNEL_RADIUS + 0.6) {
            const currentRing = rings[0];
            isOverHole.current = !currentRing[segmentIdx];
        } else {
            isOverHole.current = false;
        }

        // Update Instances
        const tempObject = new THREE.Object3D();
        let instanceId = 0;

        rings.forEach((ring, ringIdx) => {
            const actualZ = -((ringIdx * SEGMENT_LENGTH)) + (offsetZ.current % SEGMENT_LENGTH);
            if (actualZ > 15) return;

            ring.forEach((isActive, segIdx) => {
                if (!isActive) return;

                const angle = (segIdx / SEGMENTS) * Math.PI * 2;
                const x = Math.cos(angle) * TUNNEL_RADIUS;
                const y = Math.sin(angle) * TUNNEL_RADIUS;

                tempObject.position.set(x, y, actualZ);
                tempObject.rotation.z = angle - Math.PI / 2;

                const width = (2 * Math.PI * TUNNEL_RADIUS) / SEGMENTS;
                tempObject.scale.set(width * 1.02, 0.2, SEGMENT_LENGTH);

                tempObject.updateMatrix();
                meshRef.current!.setMatrixAt(instanceId++, tempObject.matrix);
            });
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.count = instanceId;
    });

    return (
        <group>
            <Stars />
            <instancedMesh ref={meshRef} args={[undefined, undefined, VIEW_DISTANCE * SEGMENTS]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="#00ff9d" wireframe={false} transparent opacity={0.6} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                </lineSegments>
            </instancedMesh>
        </group>
    );
}

function GameScene({
    gameActive,
    setGameOver,
    score,
    playerYRef,
    isOverHole,
    gameOver,
    invertControls
}: {
    gameActive: boolean,
    setGameOver: (s: boolean) => void,
    score: number,
    playerYRef: React.MutableRefObject<number>,
    isOverHole: React.MutableRefObject<boolean>,
    gameOver: boolean,
    invertControls: boolean
}) {
    const [rotation, setRotation] = useState(0);
    const targetRotation = useRef(0);

    useFrame((state, delta) => {
        const isFalling = isOverHole.current || gameOver;
        if (!gameActive && !isFalling) return;

        if (gameOver) {
            // No rotation on death
        } else if (gameActive) {
            setRotation(r => {
                const diff = targetRotation.current - r;
                return r + diff * delta * 2;
            });
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameActive || gameOver) return;

            const direction = invertControls ? -1 : 1;

            if (e.key === "ArrowLeft") {
                // SWAPPED: Left now ADDS rotation (moves player left relative to tunnel)
                targetRotation.current += ((Math.PI * 2) / SEGMENTS) * direction;
            }
            if (e.key === "ArrowRight") {
                // SWAPPED: Right now SUBTRACTS rotation
                targetRotation.current -= ((Math.PI * 2) / SEGMENTS) * direction;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameActive, gameOver, invertControls]);

    return (
        <>
            <BackgroundTunnel />
            <group rotation={[0, 0, rotation]}>
                <Tunnel
                    tunnelRotation={rotation}
                    gameActive={gameActive}
                    isOverHole={isOverHole}
                    isFalling={gameOver}
                    playerYRef={playerYRef}
                />
            </group>
        </>
    );
}

export function SpaceRun({ onExit }: { onExit: () => void }) {
    const [gameActive, setGameActive] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    // Use ref for playerY to avoid re-renders
    const playerYRef = useRef(-TUNNEL_RADIUS + 0.5);
    const [gameId, setGameId] = useState(0);
    const [waitingForRestart, setWaitingForRestart] = useState(false);
    const [invertControls, setInvertControls] = useState(false);
    const isOverHole = useRef(false);

    useEffect(() => {
        if (gameActive && !gameOver) {
            const interval = setInterval(() => setScore(s => s + 1), 100);
            return () => clearInterval(interval);
        }
    }, [gameActive, gameOver]);

    const handleRestart = () => {
        setGameOver(false);
        setWaitingForRestart(false);
        setScore(0);
        setGameActive(true);
        setGameId(prev => prev + 1);
        playerYRef.current = -TUNNEL_RADIUS + 0.5;
        isOverHole.current = false;
    };

    // Handle Any Key for Restart
    useEffect(() => {
        if (!waitingForRestart) return;
        const handleAnyKey = () => handleRestart();
        window.addEventListener("keydown", handleAnyKey);
        return () => window.removeEventListener("keydown", handleAnyKey);
    }, [waitingForRestart]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onExit();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onExit]);

    return (
        <div className="fixed inset-0 z-[200] bg-black cursor-none">
            <div className="absolute top-8 left-8 z-50 font-mono text-schematic-accent pointer-events-none">
                <h2 className="text-2xl font-bold mb-2">SPACE_RUN_PROTOCOL</h2>
                <div className="text-xl">DISTANCE: {score}m</div>
                <div className="text-xs text-schematic-secondary mt-4 space-y-1">
                    <div>[LEFT/RIGHT] ROTATE_GRAVITY</div>
                    <div>[UP] JUMP_THRUST</div>
                    <div>[DOWN] FAST_DESCENT</div>
                    <div>[ESC] ABORT_MISSION</div>
                </div>
                <div className="mt-4 pointer-events-auto">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={invertControls}
                            onChange={(e) => setInvertControls(e.target.checked)}
                            className="form-checkbox bg-transparent border-schematic-accent text-schematic-accent focus:ring-0"
                        />
                        <span className="text-sm">INVERT_CONTROLS</span>
                    </label>
                </div>
            </div>

            {/* UI Removed as per request */}
            {/* {gameOver && (...)} */}

            <Canvas camera={{ position: [0, -TUNNEL_RADIUS + 3, 5], fov: 75 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 20, 100]} />

                <GameScene
                    key={`scene-${gameId}`}
                    gameActive={gameActive}
                    setGameOver={setGameOver}
                    score={score}
                    playerYRef={playerYRef}
                    isOverHole={isOverHole}
                    gameOver={gameOver}
                    invertControls={invertControls}
                />

                <Player
                    key={`player-${gameId}`}
                    gameActive={gameActive}
                    playerYRef={playerYRef}
                    setGameOver={setGameOver}
                    gameOver={gameOver}
                    isOverHole={isOverHole}
                />
                <CameraController playerYRef={playerYRef} />
                <RestartController
                    gameOver={gameOver}
                    playerYRef={playerYRef}
                    waitingForRestart={waitingForRestart}
                    setWaitingForRestart={setWaitingForRestart}
                />
                <SpeedLines isFalling={gameOver} />

                <EffectComposer>
                    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

function RestartController({
    gameOver,
    playerYRef,
    waitingForRestart,
    setWaitingForRestart
}: {
    gameOver: boolean,
    playerYRef: React.MutableRefObject<number>,
    waitingForRestart: boolean,
    setWaitingForRestart: (b: boolean) => void
}) {
    useFrame(() => {
        if (gameOver && playerYRef.current < -50 && !waitingForRestart) {
            setWaitingForRestart(true);
        }
    });
    return null;
}

function CameraController({ playerYRef }: { playerYRef: React.MutableRefObject<number> }) {
    const { camera } = useThree();

    useFrame(() => {
        // Camera follow logic
        const targetY = playerYRef.current + 4.0;
        const targetZ = 10.0;

        camera.position.set(0, THREE.MathUtils.lerp(camera.position.y, targetY, 0.1), targetZ);

        camera.lookAt(0, playerYRef.current - 2, -20);
    });
    return null;
}
