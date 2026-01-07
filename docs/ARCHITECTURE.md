# Architecture & Component Overview

## Component Overview

### Features
-   **SkillMatrix**: A "System Telemetry" view displaying skills as a live data stream.
-   **TechStack**: A "Glass Box" component displaying technologies with magnetic repulsion physics.
-   **SmartSearch**: A terminal-style search interface for filtering projects.

### Visuals
-   **GridBackground**: A CSS-driven background grid that respects theme changes instantly.
-   **MqttStream**: A visual representation of data packets flowing through the system.
-   **DigitalTwin**: A 3D visualization of the system architecture.
-   **CmmSenseVisual**: A complex SVG animation state machine (idle -> cutting -> booting) visualizing the CMM-Sense device lifecycle.
-   **ProjectDiagram**: Renders architectural diagrams for specific projects (e.g., Repo Rover, Smart Lock) using Framer Motion.

### System
-   **BootSequence**: The initial "BIOS" style loading screen.
-   **ProtocolHandshake**: The very first loading state before the boot sequence.

### Games
-   **SnakeGame**: A classic Snake game implementation.
-   **SpaceRun**: A 3D tunnel runner game using React Three Fiber.
-   **Game Logic**: `src/lib/gameUtils.ts` contains shared game logic (e.g., Snake collision detection, food spawning).

## Data Layer
-   **`src/data/resume.ts`**: The single source of truth for all portfolio content (Experience, Education, Projects, Skills). This file exports a `RESUME` constant used throughout the app.

## Utilities
-   **`src/lib/utils.ts`**: Contains the `cn` helper function, which merges Tailwind classes using `clsx` and `tailwind-merge` to resolve conflicts.
