"use client";

import { useState, useEffect } from "react";
import { SnakeGame } from "@/components/games/SnakeGame";
import { SpaceRun } from "@/components/games/SpaceRun";

export function GameOverlay() {
    const [activeGame, setActiveGame] = useState<"snake" | "space-run" | null>(null);

    useEffect(() => {
        const handleSnake = () => setActiveGame("snake");
        const handleSpaceRun = () => setActiveGame("space-run");

        window.addEventListener("toggle-snake", handleSnake);
        window.addEventListener("toggle-space-run", handleSpaceRun);

        return () => {
            window.removeEventListener("toggle-snake", handleSnake);
            window.removeEventListener("toggle-space-run", handleSpaceRun);
        };
    }, []);

    if (!activeGame) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black">
            {activeGame === "snake" && (
                <SnakeGame onExit={() => setActiveGame(null)} />
            )}
            {activeGame === "space-run" && (
                <SpaceRun onExit={() => setActiveGame(null)} />
            )}
        </div>
    );
}
