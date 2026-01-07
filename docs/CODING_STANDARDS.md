# Coding Standards

## Theme Architecture
-   **Root-Level Context**: Theme state is managed by `ThemeContext` (`src/context/ThemeContext.tsx`).
-   **No DOM Polling**: Components should **never** poll the DOM or use `MutationObserver` to detect theme changes.
-   **Consumption**:
    -   **React Components**: Use `const { theme, colors } = useTheme();`.
    -   **CSS/Styles**: Use CSS variables (e.g., `var(--color-schematic-accent)`) which update instantly.
-   **Prevention of FOUC**: This architecture ensures the correct theme is applied before hydration, preventing "Flash of Unstyled Content".

## File Organization
-   `src/components/layout`: Global layout elements (Header, Footer).
-   `src/components/features`: Core functionality (TechStack, Search, Logs).
-   `src/components/visuals`: Visual effects (Grid, Warp Tunnel, 3D).
-   `src/components/system`: System-level logic (Boot, Protocols).
-   `src/components/games`: Interactive mini-games.
-   `src/components/unused`: Deprecated or unused components.

## Data Management
-   **Static Content**: All resume data (text, links, dates) must be stored in `src/data/resume.ts`. Do not hardcode content in components.
-   **Type Safety**: Ensure all data usage matches the structure defined in `resume.ts`.

## Utility Usage
-   **Class Merging**: Always use the `cn()` utility from `src/lib/utils.ts` when combining Tailwind classes, especially for conditional styling.
    ```tsx
    // Correct
    <div className={cn("base-class", condition && "active-class")} />
    ```

## Code Formatting
-   **Style**: Prefer **C# Style (Allman)** formatting where possible.
-   **Brackets**: Place opening brackets on a new line.
    ```tsx
    // Preferred
    function MyComponent()
    {
        return (
            <div>...</div>
        );
    }

    // Avoid (K&R)
    function MyComponent() {
        return <div>...</div>;
    }
    ```
