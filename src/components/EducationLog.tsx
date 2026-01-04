"use client";

import { RESUME } from "@/data/resume";
import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";

export function EducationLog() {
    // Handle both array and object for backward compatibility if needed, but we updated resume.ts to array.
    const educationList = Array.isArray(RESUME.education) ? RESUME.education : [RESUME.education];

    return (
        <section className="mb-20 relative max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="h-px bg-schematic-grid flex-grow" />
                <div className="flex items-center space-x-2 text-schematic-accent">
                    <GraduationCap className="w-5 h-5" />
                    <h2 className="text-2xl font-bold font-mono tracking-wider">ACADEMIC_RECORD</h2>
                </div>
                <div className="h-px bg-schematic-grid flex-grow" />
            </div>

            {/* Main Container (Large Rectangle) */}
            <div className="border border-schematic-grid bg-schematic-bg/50 backdrop-blur-sm p-6 md:p-8 rounded-lg space-y-6">
                {educationList.map((edu, index) => (
                    // Inner Card (Rectangle inside)
                    <div
                        key={index}
                        className="group border border-schematic-grid/50 bg-black/20 p-6 rounded hover:border-schematic-accent/50 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Logo Column */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                    {edu.logo ? (
                                        <img
                                            src={edu.logo}
                                            alt={edu.school}
                                            className={`w-full h-full object-contain ${edu.school.includes("New Albany") ? "scale-[2.0]" : ""}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-2 border-schematic-grid rounded-lg">
                                            <div className="text-3xl font-bold font-mono text-schematic-secondary group-hover:text-schematic-accent">
                                                {edu.school.charAt(0)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-grow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-schematic-primary font-mono group-hover:text-schematic-accent transition-colors">
                                            {edu.school}
                                        </h3>
                                        <div className="text-lg text-schematic-secondary font-mono">
                                            {edu.degree}
                                        </div>
                                        <div className="text-sm text-schematic-accent/80 font-mono mt-1">
                                            {edu.specialization}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end mt-2 md:mt-0 space-y-1 text-sm text-schematic-secondary/70 font-mono">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Graduated: {edu.graduation}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Award className="w-4 h-4" />
                                            <span>GPA: {edu.gpa}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-start space-x-3 text-schematic-secondary/90 text-sm">
                                        <Award className="w-4 h-4 mt-0.5 text-schematic-accent flex-shrink-0" />
                                        <span>{edu.honors}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
