"use client";

import { useEffect, useState } from "react";

export function ThemeManager() {
    const [isSchematic, setIsSchematic] = useState(true);

    useEffect(() => {
        const styleId = "blueprint-theme-override";
        let styleTag = document.getElementById(styleId);

        if (isSchematic) {
            if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }

            // Inject !important overrides directly
            styleTag.innerHTML = `
                :root, body {
                    --color-schematic-bg: #003366 !important;
                    --color-schematic-primary: #ffffff !important;
                    --color-schematic-secondary: #b3d9ff !important;
                    --color-schematic-accent: #ffffff !important;
                    --color-schematic-grid: rgba(255, 255, 255, 0.3) !important;
                    color-scheme: dark !important;
                }
                
                /* Force background color on body to ensure it takes effect */
                body {
                    background-color: #003366 !important;
                    color: #ffffff !important;
                }
            `;

            document.body.classList.add("blueprint-mode");
        } else {
            if (styleTag) {
                styleTag.remove();
            }
            document.body.classList.remove("blueprint-mode");
        }
    }, [isSchematic]);

    // Listen for global toggle event
    useEffect(() => {
        const handleToggle = () => setIsSchematic(prev => !prev);
        window.addEventListener("toggle-theme", handleToggle);
        return () => window.removeEventListener("toggle-theme", handleToggle);
    }, []);

    return null; // Headless component
}
