"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "blueprint" | "schematic";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        bg: string;
        grid: string;
        primary: string;
        secondary: string;
        accent: string;
    };
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("blueprint");

    // Colors for JS usage (Canvas, etc.)
    // These match globals.css defaults
    const colors = {
        bg: theme === "blueprint" ? "#003366" : "#0a0a0a",
        grid: theme === "blueprint" ? "rgba(255, 255, 255, 0.3)" : "#222222",
        primary: theme === "blueprint" ? "#ffffff" : "#ededed",
        secondary: theme === "blueprint" ? "#b3d9ff" : "#888888",
        accent: theme === "blueprint" ? "#ffffff" : "#00ff9d",
    };

    useEffect(() => {
        // Apply theme classes to body
        document.body.classList.remove("blueprint-mode", "schematic-mode");
        document.body.classList.add(`${theme}-mode`);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "blueprint" ? "schematic" : "blueprint");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
