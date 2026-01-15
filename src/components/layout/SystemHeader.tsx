"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Download } from "lucide-react";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export function SystemHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [funDropdownOpen, setFunDropdownOpen] = useState(false);
    const { toggleTheme } = useTheme();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            if (timeoutId) return;

            timeoutId = setTimeout(() => {
                if (window.scrollY > 50) {
                    setScrolled(true);
                } else {
                    setScrolled(false);
                }
                timeoutId = undefined as any;
            }, 100);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (funDropdownOpen && !(e.target as Element).closest('.fun-dropdown-container')) {
                setFunDropdownOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("click", handleClickOutside);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [funDropdownOpen]);

    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleFunAction = (action: string) => {
        setFunDropdownOpen(false);
        switch (action) {
            case 'log':
                window.dispatchEvent(new CustomEvent("toggle-log"));
                break;
            case 'snake':
                window.dispatchEvent(new CustomEvent("toggle-snake"));
                break;
            case 'space-run':
                window.dispatchEvent(new CustomEvent("toggle-space-run"));
                break;
            case 'reboot':
                window.dispatchEvent(new CustomEvent("restart-intro"));
                break;
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-base py-2"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Left: Name */}
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-bold font-mono text-schematic-primary tracking-tight">
                                <span className="text-gradient">ALEX_MITELMAN</span> <span className="text-schematic-accent text-sm md:text-base font-normal ml-2 opacity-80">:: Backend DevOps and Embedded Engineer</span>
                            </h1>
                        </div>
                    </div>

                    {/* Right: Navigation & Resume */}
                    <div className="flex items-center space-x-6">
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-mono text-schematic-secondary">
                            <button
                                onClick={() => handleScrollTo("about")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                About
                            </button>
                            <button
                                onClick={() => handleScrollTo("skills")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Skills
                            </button>
                            <button
                                onClick={() => handleScrollTo("experience")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Experience
                            </button>
                            <button
                                onClick={() => handleScrollTo("education")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Education
                            </button>
                            <button
                                onClick={() => handleScrollTo("smart-search")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => handleScrollTo("data-uplink")}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Contact
                            </button>

                            {/* Fun Dropdown */}
                            <div className="relative fun-dropdown-container">
                                <button
                                    onClick={() => setFunDropdownOpen(!funDropdownOpen)}
                                    className={cn(
                                        "hover:text-schematic-accent transition-colors uppercase flex items-center space-x-1",
                                        funDropdownOpen && "text-schematic-accent"
                                    )}
                                >
                                    <span>Fun</span>
                                </button>

                                {funDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-schematic-bg border border-schematic-grid rounded shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => handleFunAction('log')}
                                            className="w-full text-left px-4 py-2 hover:bg-schematic-accent/10 hover:text-schematic-accent transition-colors text-xs font-mono border-b border-schematic-grid/30 last:border-0"
                                        >
                                            SYSTEM_LOG
                                        </button>
                                        <button
                                            onClick={() => handleFunAction('reboot')}
                                            className="w-full text-left px-4 py-2 hover:bg-schematic-accent/10 hover:text-schematic-accent transition-colors text-xs font-mono border-b border-schematic-grid/30 last:border-0"
                                        >
                                            ENTER: FIRST TIME
                                        </button>
                                        <button
                                            onClick={() => handleFunAction('snake')}
                                            className="w-full text-left px-4 py-2 hover:bg-schematic-accent/10 hover:text-schematic-accent transition-colors text-xs font-mono border-b border-schematic-grid/30 last:border-0"
                                        >
                                            PYTHON_SNAKE_GAME
                                        </button>
                                        <button
                                            onClick={() => handleFunAction('space-run')}
                                            className="w-full text-left px-4 py-2 hover:bg-schematic-accent/10 hover:text-schematic-accent transition-colors text-xs font-mono border-b border-schematic-grid/30 last:border-0"
                                        >
                                            SPACE_RUN_3
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="hover:text-schematic-accent transition-colors uppercase"
                            >
                                Theme
                            </button>
                        </nav>

                        <div className="h-6 w-px bg-schematic-grid/50 hidden md:block" />

                        <button
                            onClick={() => window.open("/resume.pdf", "_blank")}
                            className="bg-transparent border border-schematic-accent text-schematic-accent font-bold font-mono text-sm px-4 py-2 rounded hover:bg-schematic-accent/10 transition-colors uppercase tracking-wide flex items-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>RESUME</span>
                        </button>
                    </div>
                </div>
            </div>
            <ScrollProgress />
        </header>
    );
}
