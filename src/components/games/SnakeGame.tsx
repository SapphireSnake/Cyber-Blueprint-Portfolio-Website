"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { GRID_SIZE, SPEED, DOT_SIZE, spawnFood, Point } from "@/lib/gameUtils";

// Helper for color interpolation
function interpolateColor(color1: string, color2: string, factor: number) {
    if (factor > 1) factor = 1;
    if (factor < 0) factor = 0;

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
}

export function SnakeGame({ onExit }: { onExit: () => void }) {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point[]>([]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [gridColor, setGridColor] = useState("#00ff9d");
    const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
    const [invertControls, setInvertControls] = useState(false);
    const gameOverRef = useRef(false);

    const triggerGameOver = () => {
        if (gameOverRef.current) return;
        gameOverRef.current = true;
        setGameOver(true);
        // Defer dispatch to avoid "Cannot update component while rendering another" error
        // because this is often called from within a state updater (setSnake)
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent("game-over", { detail: { game: "PYTHON_SNAKE", score } }));
        }, 0);
    };

    // Initialize Game & Dimensions
    useEffect(() => {
        const handleResize = () => {
            const cols = Math.ceil(window.innerWidth / GRID_SIZE);
            const rows = Math.ceil(window.innerHeight / GRID_SIZE);
            setDimensions({ cols, rows });
        };

        // Initial setup
        handleResize();
        window.addEventListener("resize", handleResize);

        // Dispatch Game Start
        window.dispatchEvent(new CustomEvent("game-started", { detail: "PYTHON_SNAKE" }));

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Spawn initial food when dimensions are ready
    useEffect(() => {
        if (dimensions.cols > 0 && food.length === 0 && !gameOver) {
            const initialFood: Point[] = [];
            // Spawn 2 items to start
            initialFood.push(spawnFood([{ x: 10, y: 10 }], [], dimensions.cols, dimensions.rows));
            initialFood.push(spawnFood([{ x: 10, y: 10 }], initialFood, dimensions.cols, dimensions.rows));
            setFood(initialFood);
        }
    }, [dimensions, gameOver]); // Run when dimensions are set or game restarts

    // Watch for Theme Changes
    useEffect(() => {
        const updateColor = () => {
            const isBlueprint = document.body.classList.contains("blueprint-mode");
            setGridColor(isBlueprint ? "#ffffff" : "#00539F");
        };
        updateColor();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") updateColor();
            });
        });
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver) {
                if (e.key === "Escape") onExit();
                return;
            }

            const inv = invertControls ? -1 : 1;

            switch (e.key) {
                case "ArrowUp": if (direction.y === 0) setDirection({ x: 0, y: -1 * inv }); break;
                case "ArrowDown": if (direction.y === 0) setDirection({ x: 0, y: 1 * inv }); break;
                case "ArrowLeft": if (direction.x === 0) setDirection({ x: -1 * inv, y: 0 }); break;
                case "ArrowRight": if (direction.x === 0) setDirection({ x: 1 * inv, y: 0 }); break;
                case "Escape": onExit(); break;
                case " ": setIsPaused(prev => !prev); break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction, gameOver, onExit, invertControls]);

    // Game Loop
    useEffect(() => {
        if (gameOver || isPaused || dimensions.cols === 0) return;

        const moveSnake = setInterval(() => {
            setSnake(prev => {
                const { cols, rows } = dimensions;

                // Calculate new head position with wrap-around
                let newHeadX = prev[0].x + direction.x;
                let newHeadY = prev[0].y + direction.y;

                // Wrap around logic
                if (newHeadX < 0) newHeadX = cols - 1;
                if (newHeadX >= cols) newHeadX = 0;
                if (newHeadY < 0) newHeadY = rows - 1;
                if (newHeadY >= rows) newHeadY = 0;

                const newHead = { x: newHeadX, y: newHeadY };

                // Calculate Mirror Snake Head
                const mirrorHead = { x: cols - 1 - newHeadX, y: rows - 1 - newHeadY };

                // Check collisions
                // 1. Self collision (Ignore index 1 - Neck Immunity)
                if (prev.some((segment, index) => index !== 1 && segment.x === newHead.x && segment.y === newHead.y)) {
                    triggerGameOver();
                    return prev;
                }

                // 2. Mirror Snake collision
                const mirrorSnakeSegments = prev.map(seg => ({
                    x: cols - 1 - seg.x,
                    y: rows - 1 - seg.y
                }));

                if (mirrorSnakeSegments.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                    triggerGameOver();
                    return prev;
                }

                if (mirrorHead.x === newHead.x && mirrorHead.y === newHead.y) {
                    triggerGameOver();
                    return prev;
                }

                const newSnake = [newHead, ...prev];
                let currentFoodList = [...food];
                let foodChanged = false;
                let grew = false;

                // 1. Check Mirror Snake Food Collision (Stealing)
                const mirrorFoodIndex = currentFoodList.findIndex(f => f.x === mirrorHead.x && f.y === mirrorHead.y);
                if (mirrorFoodIndex !== -1) {
                    // Mirror ate food! Remove it.
                    currentFoodList.splice(mirrorFoodIndex, 1);

                    // Spawn replacement
                    currentFoodList.push(spawnFood(newSnake, currentFoodList, cols, rows));
                    foodChanged = true;
                    grew = true;
                }

                // 2. Check Player Food Collision
                // Note: We check against currentFoodList which might have just had an item removed by the mirror
                const foodIndex = currentFoodList.findIndex(f => f.x === newHead.x && f.y === newHead.y);

                if (foodIndex !== -1) {
                    setScore(s => s + 1);

                    // Remove eaten food
                    currentFoodList.splice(foodIndex, 1);

                    // Spawn replacement(s)
                    currentFoodList.push(spawnFood(newSnake, currentFoodList, cols, rows));

                    // Chance to spawn an extra one
                    if (currentFoodList.length < 3 && Math.random() > 0.7) {
                        currentFoodList.push(spawnFood(newSnake, currentFoodList, cols, rows));
                    }

                    foodChanged = true;
                    grew = true;
                }

                if (!grew) {
                    // Only pop if NO ONE ate
                    newSnake.pop();
                }

                if (foodChanged) {
                    setFood(currentFoodList);
                }

                return newSnake;
            });
        }, SPEED);

        return () => clearInterval(moveSnake);
    }, [direction, food, gameOver, isPaused, dimensions]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood([]); // Will trigger the useEffect to spawn new food
        setDirection({ x: 1, y: 0 });
        setGameOver(false);
        gameOverRef.current = false;
        setScore(0);
        setIsPaused(false);
        window.dispatchEvent(new CustomEvent("game-started", { detail: "PYTHON_SNAKE" }));
    };

    if (dimensions.cols === 0) return null; // Wait for dimensions

    return (
        <div className="fixed inset-0 z-[200] bg-schematic-bg overflow-hidden cursor-none">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none" />

            {/* UI Overlay */}
            <div className="absolute top-8 left-8 z-50 font-mono text-schematic-accent pointer-events-none">
                <h2 className="text-2xl font-bold mb-2">PYTHON_EXECUTION_ENV</h2>
                <div className="text-xl">PACKETS_COLLECTED: {score}</div>
                <div className="text-xs text-schematic-secondary mt-4 space-y-1 max-w-md">
                    <div>Pythons can go through walls.</div>
                    <div>Both snakes can collect orbs but cannot cross.</div>
                    <div className="mt-2">[ESC] to exit</div>
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

            {/* Player Snake */}
            {snake.map((segment, i) => {
                const isHead = i === 0;
                // Blue (#00539F) to Purple (#8A2BE2)
                const color = interpolateColor("#00539F", "#8A2BE2", i / (snake.length + 5));

                return (
                    <motion.div
                        key={`player-${segment.x}-${segment.y}-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: segment.x * GRID_SIZE - DOT_SIZE / 2,
                            top: segment.y * GRID_SIZE - DOT_SIZE / 2,
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            backgroundColor: color,
                            boxShadow: isHead ? `0 0 20px ${color}` : 'none',
                            opacity: Math.max(0.4, 1 - i / (snake.length + 10)),
                            zIndex: 10
                        }}
                        initial={false}
                    />
                );
            })}

            {/* Mirror Snake */}
            {snake.map((segment, i) => {
                const isHead = i === 0;
                const mirrorX = dimensions.cols - 1 - segment.x;
                const mirrorY = dimensions.rows - 1 - segment.y;
                // Yellow (#FFD700) to Red (#FF0055)
                const color = interpolateColor("#FFD700", "#FF0055", i / (snake.length + 5));

                return (
                    <motion.div
                        key={`mirror-${mirrorX}-${mirrorY}-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: mirrorX * GRID_SIZE - DOT_SIZE / 2,
                            top: mirrorY * GRID_SIZE - DOT_SIZE / 2,
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            backgroundColor: color,
                            boxShadow: isHead ? `0 0 20px ${color}` : 'none',
                            opacity: Math.max(0.4, 1 - i / (snake.length + 10)),
                            zIndex: 10
                        }}
                        initial={false}
                    />
                );
            })}

            {/* Food Items */}
            {food.map((item, i) => (
                <div
                    key={`food-${item.x}-${item.y}-${i}`}
                    className="absolute"
                    style={{
                        left: item.x * GRID_SIZE - DOT_SIZE / 2,
                        top: item.y * GRID_SIZE - DOT_SIZE / 2,
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                    }}
                >
                    <div
                        className="w-full h-full rounded-full animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{ backgroundColor: '#000000' }}
                    />
                </div>
            ))}

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center text-center cursor-auto">
                    <h3 className="text-4xl font-bold text-red-500 mb-4 font-mono tracking-widest">SYSTEM_FAILURE</h3>
                    <p className="text-schematic-secondary mb-8 font-mono text-xl">DATA_PACKETS_RECOVERED: {score}</p>
                    <div className="flex space-x-6">
                        <button
                            onClick={resetGame}
                            className="flex items-center space-x-2 px-8 py-4 border border-schematic-accent text-schematic-accent hover:bg-schematic-accent hover:text-black transition-colors font-mono font-bold rounded text-lg"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>RETRY_PROCESS</span>
                        </button>
                        <button
                            onClick={onExit}
                            className="px-8 py-4 border border-schematic-secondary text-schematic-secondary hover:bg-schematic-secondary hover:text-black transition-colors font-mono rounded text-lg"
                        >
                            TERMINATE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
