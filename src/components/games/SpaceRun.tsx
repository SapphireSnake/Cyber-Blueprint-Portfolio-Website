"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Text } from "@react-three/drei";

// Game Constants
const TUNNEL_RADIUS = 8;
const SEGMENTS = 16;
const SEGMENT_LENGTH = 4;
const SPEED = 8;
const ROTATION_SPEED = 1.5;
const VIEW_DISTANCE = 90;
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
    });

    if (!isFalling) return null;

    return (
        <group>
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
            <meshBasicMaterial color="#00539F" wireframe={true} transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
    );
}

function Player({
    gameActive,
    playerYRef,
    setGameOver,
    gameOver,
    isOverHole,
    hasStarted
}: {
    gameActive: boolean,
    playerYRef: React.MutableRefObject<number>,
    setGameOver: (state: boolean) => void,
    gameOver: boolean,
    isOverHole: React.MutableRefObject<boolean>,
    hasStarted: boolean
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const yPos = useRef(-TUNNEL_RADIUS + 0.5);
    const velocityY = useRef(0);
    const jumpCount = useRef(0);

    useFrame((state, delta) => {
        // Clamp delta to prevent huge physics jumps on frame drops
        const dt = Math.min(delta, 0.1);

        // If not started, just hover
        if (!hasStarted) {
            if (meshRef.current) {
                meshRef.current.position.y = yPos.current + Math.sin(state.clock.elapsedTime * 2) * 0.2;
            }
            return;
        }

        // If game over, let player fall into abyss
        if (gameOver) {
            velocityY.current -= GRAVITY * dt;
            yPos.current += velocityY.current * dt;

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
            velocityY.current -= GRAVITY * dt;
            const newY = yPos.current + velocityY.current * dt;

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
            velocityY.current -= GRAVITY * dt;
            yPos.current += velocityY.current * dt;
        }

        // Auto-Respawn Check (instead of Game Over)
        // If player falls past stars (e.g. -30), reset them to top
        if (yPos.current < -30) {
            yPos.current = 0; // Drop from center
            velocityY.current = 0;
            // Optional: Add a penalty or visual effect here
        }

        // Sync ref
        if (meshRef.current) {
            meshRef.current.position.y = yPos.current;
        }
        playerYRef.current = yPos.current;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameActive || gameOver || !hasStarted) return;
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
    }, [gameActive, gameOver, hasStarted]);

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
            <meshBasicMaterial color="#ffffff" />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
                <meshBasicMaterial color="#000000" />
            </lineSegments>
            <pointLight intensity={2} distance={10} color="#ffffff" />
        </mesh>
    );
}

function Tunnel({
    tunnelRotation,
    gameActive,
    isOverHole,
    isFalling,
    playerYRef,
    hasStarted
}: {
    tunnelRotation: number,
    gameActive: boolean,
    isOverHole: React.MutableRefObject<boolean>,
    isFalling: boolean,
    playerYRef: React.MutableRefObject<number>,
    hasStarted: boolean
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    // Use Ref instead of State for rings to ensure synchronous updates with the render loop
    // This eliminates the jitter caused by React state update latency
    const rings = useRef<boolean[][]>([]);
    const localOffset = useRef(0); // Tracks distance within current segment
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
        rings.current = initialRings;
    }, []);

    // Game Loop
    useFrame((state, delta) => {
        if ((!gameActive && !isFalling) || !meshRef.current) return;

        // Only move forward if game is active, NOT falling, and STARTED
        if (gameActive && !isFalling && hasStarted) {
            const moveDist = SPEED * delta;
            localOffset.current += moveDist;

            // When we've moved past one segment length, shift the world
            // Doing this synchronously in the frame loop prevents visual jitter
            if (localOffset.current >= SEGMENT_LENGTH) {
                localOffset.current -= SEGMENT_LENGTH;

                // Shift rings
                const next = [...rings.current.slice(1)];
                const newRing = new Array(SEGMENTS).fill(false);

                // Path generation logic
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
                rings.current = next;
            }
        }

        // Collision Detection Logic
        let normalizedRot = tunnelRotation % (Math.PI * 2);
        if (normalizedRot < 0) normalizedRot += Math.PI * 2;

        const segmentAngleStep = (Math.PI * 2) / SEGMENTS;
        const bottomAngle = Math.PI * 1.5;

        let targetSegmentAngle = bottomAngle - tunnelRotation;
        targetSegmentAngle = targetSegmentAngle % (Math.PI * 2);
        if (targetSegmentAngle < 0) targetSegmentAngle += Math.PI * 2;

        const segmentIdx = Math.round(targetSegmentAngle / segmentAngleStep) % SEGMENTS;

        if (rings.current.length > 0 && playerYRef.current <= -TUNNEL_RADIUS + 0.6) {
            const currentRing = rings.current[0];
            isOverHole.current = !currentRing[segmentIdx];
        } else {
            isOverHole.current = false;
        }

        // Update Instances
        const tempObject = new THREE.Object3D();
        let instanceId = 0;

        rings.current.forEach((ring, ringIdx) => {
            // Calculate Z position based on ring index and local offset
            // Ring 0 is at 0 + localOffset
            // Ring 1 is at -SEGMENT_LENGTH + localOffset

            const actualZ = -(ringIdx * SEGMENT_LENGTH) + localOffset.current;

            // Cull if behind camera (camera at +5)
            if (actualZ > 10) return;

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
                <meshBasicMaterial color="#00539F" wireframe={false} transparent opacity={0.8} side={THREE.DoubleSide} />
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
    invertControls,
    hasStarted
}: {
    gameActive: boolean,
    setGameOver: (s: boolean) => void,
    score: number,
    playerYRef: React.MutableRefObject<number>,
    isOverHole: React.MutableRefObject<boolean>,
    gameOver: boolean,
    invertControls: boolean,
    hasStarted: boolean
}) {
    const [rotation, setRotation] = useState(0);
    const targetRotation = useRef(0);

    useFrame((state, delta) => {
        const isFalling = isOverHole.current || gameOver;
        if (!gameActive && !isFalling) return;

        if (gameOver) {
            // No rotation on death
        } else if (gameActive && hasStarted) {
            setRotation(r => {
                const diff = targetRotation.current - r;
                return r + diff * delta * 2;
            });
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameActive || gameOver || !hasStarted) return;

            const direction = invertControls ? -1 : 1;

            if (e.key === "ArrowLeft") {
                targetRotation.current += ((Math.PI * 2) / SEGMENTS) * direction;
            }
            if (e.key === "ArrowRight") {
                targetRotation.current -= ((Math.PI * 2) / SEGMENTS) * direction;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameActive, gameOver, invertControls, hasStarted]);

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
                    hasStarted={hasStarted}
                />
            </group>
        </>
    );
}

export function SpaceRun({ onExit }: { onExit: () => void }) {
    const [gameActive, setGameActive] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const playerYRef = useRef(-TUNNEL_RADIUS + 0.5);
    const [gameId, setGameId] = useState(0);
    const [waitingForRestart, setWaitingForRestart] = useState(false);
    const [invertControls, setInvertControls] = useState(false);
    const isOverHole = useRef(false);
    const [hasStarted, setHasStarted] = useState(false);
    const restartCooldown = useRef(false);

    const gameOverRef = useRef(false);

    useEffect(() => {
        if (gameActive && !gameOver && hasStarted) {
            const interval = setInterval(() => setScore(s => s + 1), 100);
            return () => clearInterval(interval);
        }
    }, [gameActive, gameOver, hasStarted]);

    useEffect(() => {
        if (gameOver && !gameOverRef.current) {
            gameOverRef.current = true;
            window.dispatchEvent(new CustomEvent("game-over", { detail: { game: "SPACE_RUN", score } }));
        }
    }, [gameOver, score]);

    const handleRestart = () => {
        setGameOver(false);
        setWaitingForRestart(false);
        setScore(0);
        setGameActive(true);
        setGameId(prev => prev + 1);
        playerYRef.current = -TUNNEL_RADIUS + 0.5;
        isOverHole.current = false;
        setHasStarted(false); // Reset start state
        gameOverRef.current = false;
        window.dispatchEvent(new CustomEvent("game-started", { detail: "SPACE_RUN" }));

        // Prevent immediate start
        restartCooldown.current = true;
        setTimeout(() => {
            restartCooldown.current = false;
        }, 500);
    };

    // Handle Any Key for Start / Restart
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onExit();
                return;
            }

            if (restartCooldown.current) return;

            if (!hasStarted) {
                setHasStarted(true);
                window.dispatchEvent(new CustomEvent("game-started", { detail: "SPACE_RUN" }));
                return;
            }

            if (waitingForRestart) {
                handleRestart();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [waitingForRestart, hasStarted, onExit]);

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

            {/* Start Prompt */}
            {!hasStarted && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-black/80 border border-schematic-accent p-8 rounded text-center animate-pulse">
                        <h1 className="text-4xl font-bold text-schematic-accent mb-4">READY_PLAYER_ONE</h1>
                        <p className="text-xl text-schematic-primary">PRESS ANY KEY TO ENGAGE THRUSTERS</p>
                    </div>
                </div>
            )}

            <Canvas camera={{ position: [0, -TUNNEL_RADIUS + 3, 5], fov: 75 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 40, 120]} />

                <GameScene
                    key={`scene-${gameId}`}
                    gameActive={gameActive}
                    setGameOver={setGameOver}
                    score={score}
                    playerYRef={playerYRef}
                    isOverHole={isOverHole}
                    gameOver={gameOver}
                    invertControls={invertControls}
                    hasStarted={hasStarted}
                />

                <Player
                    key={`player-${gameId}`}
                    gameActive={gameActive}
                    playerYRef={playerYRef}
                    setGameOver={setGameOver}
                    gameOver={gameOver}
                    isOverHole={isOverHole}
                    hasStarted={hasStarted}
                />
                <CameraController playerYRef={playerYRef} />
                <SpeedLines isFalling={gameOver} />

                <EffectComposer>
                    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

function CameraController({ playerYRef }: { playerYRef: React.MutableRefObject<number> }) {
    const { camera } = useThree();

    useFrame((state, delta) => {
        // Camera follow logic
        const targetY = playerYRef.current + 4.0;
        const targetZ = 10.0;

        // Use damp for smoother, frame-independent smoothing
        // lambda = 5 is a good starting point for smooth tracking
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, delta);
        camera.position.x = 0;
        camera.position.z = targetZ;

        camera.lookAt(0, playerYRef.current - 2, -20);
    });
    return null;
}
