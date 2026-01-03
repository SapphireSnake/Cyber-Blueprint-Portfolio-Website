export const GRID_SIZE = 40;
export const SPEED = 80;
export const DOT_SIZE = 12;

export interface Point {
    x: number;
    y: number;
}

export const spawnFood = (
    currentSnake: Point[],
    currentFood: Point[],
    cols: number,
    rows: number
): Point => {
    const isValidPos = (x: number, y: number) => {
        // 1. Boundary Check (Avoid outermost layer)
        if (x <= 0 || x >= cols - 1 || y <= 0 || y >= rows - 1) return false;

        // 2. Snake Collision Check (Player)
        if (currentSnake.some(s => s.x === x && s.y === y)) return false;

        // 3. Mirror Snake Collision Check
        const mirrorSegments = currentSnake.map(s => ({
            x: cols - 1 - s.x,
            y: rows - 1 - s.y
        }));
        if (mirrorSegments.some(s => s.x === x && s.y === y)) return false;

        // 4. Existing Food Check
        if (currentFood.some(f => f.x === x && f.y === y)) return false;

        return true;
    };

    // Try to spawn near the snake (Proximity Bias)
    for (let i = 0; i < 10; i++) {
        // Pick a random reference segment (from player or mirror)
        const useMirror = Math.random() > 0.5;
        const sourceSnake = useMirror
            ? currentSnake.map(s => ({ x: cols - 1 - s.x, y: rows - 1 - s.y }))
            : currentSnake;

        const randomSegment = sourceSnake[Math.floor(Math.random() * sourceSnake.length)];

        // Random offset (-5 to +5)
        const offsetX = Math.floor(Math.random() * 11) - 5;
        const offsetY = Math.floor(Math.random() * 11) - 5;

        const candidateX = randomSegment.x + offsetX;
        const candidateY = randomSegment.y + offsetY;

        if (isValidPos(candidateX, candidateY)) {
            return { x: candidateX, y: candidateY };
        }
    }

    // Fallback: Random valid position
    let attempts = 0;
    while (attempts < 100) {
        const x = Math.floor(Math.random() * (cols - 2)) + 1; // 1 to cols-2
        const y = Math.floor(Math.random() * (rows - 2)) + 1; // 1 to rows-2
        if (isValidPos(x, y)) return { x, y };
        attempts++;
    }

    // Emergency Fallback (Center)
    return { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
};
