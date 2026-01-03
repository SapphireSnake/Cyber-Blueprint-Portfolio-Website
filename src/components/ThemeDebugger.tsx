"use client";

import { useState, useEffect } from "react";

export function ThemeDebugger() {
    const [themeData, setThemeData] = useState({
        attribute: "null",
        bgColor: "unknown",
        textColor: "unknown"
    });

    useEffect(() => {
        const update = () => {
            const body = document.body;
            const style = getComputedStyle(body);
            const isBlueprint = body.classList.contains("blueprint-mode");

            setThemeData({
                attribute: isBlueprint ? "body.blueprint-mode" : "default",
                bgColor: style.getPropertyValue("--color-schematic-bg").trim(),
                textColor: style.getPropertyValue("--color-schematic-primary").trim()
            });
        };

        update();
        const interval = setInterval(update, 500); // Check more frequently
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-20 right-4 z-50 bg-black/90 border border-red-500 p-4 font-mono text-xs text-red-500 w-64">
            <h3 className="font-bold border-b border-red-500 mb-2">DEBUG_OVERLAY</h3>
            <div className="space-y-1">
                <div>data-theme: <span className="text-white">{themeData.attribute}</span></div>
                <div>bg-color: <span className="text-white">{themeData.bgColor}</span></div>
                <div>text-color: <span className="text-white">{themeData.textColor}</span></div>
            </div>
        </div>
    );
}
