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
    const [selectedProject, setSelectedProject] = useState<typeof RESUME.projects[0] | null>(null);

    // Sync external filter
    useEffect(() => {
        if (externalFilter !== undefined) {
            setActiveFilter(externalFilter);
        }
    }, [externalFilter]);

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
        <section id="smart-search" className="pt-8 pb-20 border-b border-schematic-grid">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center space-x-2 mb-8 text-schematic-accent font-mono text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>RECENT_BUILDS</span>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                        {filteredProjects.map((project) => {
                            const isExpanded = selectedProject?.name === project.name;
                            const isZelda = project.name.includes("The Legend of Zelda");

                            return (
                                <HolographicCard
                                    key={project.name}
                                    className={cn(
                                        "glass-base rounded-lg p-6 hover:border-schematic-accent/50 transition-all duration-500 ease-out group cursor-pointer flex flex-col",
                                        isExpanded
                                            ? cn("ring-1 ring-schematic-accent shadow-[0_0_30px_rgba(234,88,12,0.1)]", isZelda ? "md:col-span-2 md:row-span-2" : "md:col-span-3")
                                            : "h-full"
                                    )}
                                    onClick={() => setSelectedProject(isExpanded ? null : project)}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col justify-between mb-4 gap-4">
                                        <div className="w-full">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-lg md:text-xl font-bold font-mono text-schematic-primary group-hover:text-schematic-accent transition-colors leading-tight whitespace-pre-line">
                                                    <ChevronRight className={cn("inline-block w-5 h-5 text-schematic-accent mr-2 transition-transform duration-200", isExpanded && "rotate-90")} />
                                                    {project.name.toUpperCase()}
                                                </h3>
                                            </div>

                                            <div className="text-sm text-schematic-secondary font-mono mt-2 ml-7 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="text-schematic-accent whitespace-nowrap">FINISHED: {project.date}</span>
                                                <span className="text-schematic-grid hidden md:inline">|</span>
                                                <span className="break-words">{project.tech.slice(0, isExpanded ? undefined : 3).join(" + ")}
                                                    {!isExpanded && project.tech.length > 3 && ` +${project.tech.length - 3}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 ml-7">
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs font-bold text-schematic-bg bg-schematic-accent px-3 py-1 rounded hover:bg-schematic-accent/80 transition-all z-10 relative whitespace-nowrap"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    REPO
                                                </a>
                                            )}
                                            <span className="inline-block px-2 py-1 text-xs font-mono border border-schematic-accent/30 text-schematic-accent rounded bg-schematic-accent/5 whitespace-nowrap">
                                                {project.date === "Pending" ? "IN_DEV" : "DEPLOYED"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className={cn(
                                        "text-schematic-secondary mb-4 font-mono text-sm leading-relaxed ml-7 transition-all",
                                        !isExpanded && "line-clamp-3"
                                    )}>
                                        {project.description}
                                    </p>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="ml-7 animate-in fade-in slide-in-from-top-2 duration-500">
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
                                                <div className="mb-6 border border-schematic-grid/50 rounded-lg overflow-hidden bg-black/20 max-w-lg w-full">
                                                    <video
                                                        src={project.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-auto object-contain max-h-[400px]"
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
                    </div>

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
        </section>
    );
}
