"use client";

import { useState, useEffect } from "react";
import { Search, Terminal, ChevronRight, ExternalLink } from "lucide-react";
import { RESUME } from "@/data/resume";
import { cn } from "@/lib/utils";
import { ProjectDiagram } from "@/components/visuals/ProjectDiagram";
import { HolographicCard } from "@/components/visuals/HolographicCard";
import { DigitalTwin3D } from "@/components/visuals/DigitalTwin3D";
import { CmmSenseVisual } from "@/components/visuals/CmmSenseVisual";

interface SmartSearchProps {
    externalFilter?: string | null;
    onFilterChange?: (filter: string | null) => void;
}

export function SmartSearch({ externalFilter, onFilterChange }: SmartSearchProps) {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

    // Sync external filter
    useEffect(() => {
        if (externalFilter !== undefined) {
            setActiveFilter(externalFilter);
        }
    }, [externalFilter]);

    const handleFilterClick = (filter: string) => {
        const newFilter = activeFilter === filter ? null : filter;
        setActiveFilter(newFilter);
        onFilterChange?.(newFilter);
    };

    const filters = ["IoT", "AI", "Cloud", "Embedded"];

    const toggleProject = (projectName: string) => {
        setExpandedProjects(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectName)) {
                newSet.delete(projectName);
            } else {
                newSet.add(projectName);
            }
            return newSet;
        });
    };

    const filteredProjects = RESUME.projects.filter((project) => {
        const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase()) ||
            project.description.toLowerCase().includes(query.toLowerCase()) ||
            project.tech.some(t => t.toLowerCase().includes(query.toLowerCase()));

        const matchesFilter = activeFilter
            ? project.tech.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())) ||
            project.description.toLowerCase().includes(activeFilter.toLowerCase())
            : true;

        return matchesQuery && matchesFilter;
    });

    return (
        <section id="smart-search" className="py-20 border-b border-schematic-grid">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-8 text-schematic-accent font-mono text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>RECENT_BUILDS</span>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-schematic-secondary group-focus-within:text-schematic-accent transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-schematic-bg/50 border border-schematic-grid rounded-lg py-4 pl-12 pr-4 font-mono text-lg focus:outline-none focus:border-schematic-accent focus:ring-1 focus:ring-schematic-accent transition-all placeholder:text-schematic-grid"
                            placeholder="SEARCH_PROJECTS [CMD: 'IoT', 'React', 'AI']..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-xs font-mono text-schematic-grid animate-pulse">_</span>
                        </div>
                    </div>

                    {/* Filters Removed - Controlled by TechStack */}
                    <div className="mb-8"></div>

                    {/* Results */}
                    <div className="space-y-6">
                        {filteredProjects.map((project) => {
                            const isExpanded = expandedProjects.has(project.name);
                            return (
                                <HolographicCard
                                    key={project.name}
                                    className="border border-schematic-grid rounded-lg p-6 hover:border-schematic-accent/50 transition-colors group cursor-pointer bg-schematic-bg/50 backdrop-blur-sm mb-8"
                                    onClick={() => toggleProject(project.name)}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold font-mono text-schematic-primary flex items-center group-hover:text-schematic-accent transition-colors">
                                                <ChevronRight className={cn("w-5 h-5 text-schematic-accent mr-2 transition-transform duration-200", isExpanded && "rotate-90")} />
                                                {project.name.toUpperCase()}
                                            </h3>
                                            <div className="text-sm text-schematic-secondary font-mono mt-1 ml-7 flex items-center space-x-2">
                                                <span className="text-schematic-accent">FINISHED: {project.date}</span>
                                                <span className="text-schematic-grid">|</span>
                                                <span>{project.tech.join(" + ")}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 md:mt-0 flex items-center space-x-4 ml-7 md:ml-0">
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs font-bold text-schematic-bg bg-schematic-accent px-3 py-1 rounded hover:bg-schematic-accent/80 transition-all z-10 relative"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    REPO
                                                </a>
                                            )}
                                            <span className="inline-block px-2 py-1 text-xs font-mono border border-schematic-accent/30 text-schematic-accent rounded bg-schematic-accent/5">
                                                DEPLOYED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-schematic-secondary mb-4 font-mono text-sm leading-relaxed ml-7">
                                        {project.description}
                                    </p>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="ml-7 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {project.name === "CMM-Sense IoT Device" ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    {/* Left: 3D Digital Twin */}
                                                    <div
                                                        className="h-96 w-full border border-schematic-grid/50 rounded-lg overflow-hidden relative bg-black/20"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <DigitalTwin3D />
                                                    </div>

                                                    {/* Right: Animation Scene */}
                                                    <div className="h-96 w-full">
                                                        <CmmSenseVisual />
                                                    </div>
                                                </div>
                                            ) : project.video ? (
                                                <div className="mb-6 border border-schematic-grid/50 rounded-lg overflow-hidden bg-black/20 max-w-lg">
                                                    <video
                                                        src={project.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="mb-6">
                                                    <ProjectDiagram project={project.name} />
                                                </div>
                                            )}

                                            <div className="pl-4 border-l-2 border-schematic-accent/30 space-y-2">
                                                {project.details.map((detail, i) => (
                                                    <p key={i} className="text-xs text-schematic-secondary/80 font-mono">
                                                        {">"} {detail}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </HolographicCard>
                            );
                        })}

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-schematic-grid rounded-lg">
                                <p className="text-schematic-secondary font-mono">
                                    NO_MATCHES_FOUND
                                </p>
                                <p className="text-xs text-schematic-grid mt-2 font-mono">
                                    TRY_DIFFERENT_QUERY_PARAMETERS
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
