"use client";

import { Mail, MapPin, Globe, Phone } from "lucide-react";

export function AboutSection() {
    return (
        <section id="about" className="w-full max-w-6xl mx-auto px-4 pt-20 pb-0 md:pt-32 md:pb-0">
            {/* Outer Glass Box (Layer 1) */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 relative z-10">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-sm font-bold font-mono text-schematic-secondary tracking-widest uppercase mb-2">
                        ABOUT
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="text-4xl md:text-5xl font-bold font-mono text-schematic-primary tracking-tight">
                            <span className="text-gradient">Who I Am</span>
                        </h1>
                        <p className="text-schematic-secondary font-mono text-sm md:text-base max-w-xl text-right md:text-right">
                            I build robust systems, optimize hardware-software integration, and love pairing embedded engineering with modern web tech.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column: Bio (Layer 2) */}
                    <div className="md:col-span-2">
                        <div className="glass-base p-6 md:p-8 rounded-2xl h-full shadow-inner">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg text-schematic-secondary/90 leading-relaxed font-mono mb-6">
                                    I am a Computer Science & Engineering graduate from The Ohio State University (December 2025) specializing in Information and Computation Assurance. I have production experience at QXSOFT and JSET Automated Technologies building scalable applications with a focus on intelligent automation and IoT systems.
                                </p>
                                <p className="text-lg text-schematic-secondary/90 leading-relaxed font-mono">
                                    Information and Computation Assurance is about applying principles of computing and networking to design experiments and systems with an understanding of their potential vulnerabilities. It involves applying relevant ideas of mathematics and statistics to address problems related to information assurance, and designing and conducting experiments on actual systems to analyze results and draw conclusions about potential vulnerabilities.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details Card (Layer 2) */}
                    <div className="md:col-span-1">
                        <div className="glass-base p-6 md:p-8 rounded-2xl h-full flex flex-col justify-between space-y-8 shadow-inner">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-schematic-grid/30 pb-2">
                                    <span className="text-schematic-secondary font-mono text-sm">Name</span>
                                    <span className="text-schematic-primary font-bold font-mono text-right">Alex Mitelman</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-schematic-grid/30 pb-2">
                                    <span className="text-schematic-secondary font-mono text-sm">University</span>
                                    <span className="text-schematic-primary font-bold font-mono text-right">Ohio State University</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-schematic-grid/30 pb-2">
                                    <span className="text-schematic-secondary font-mono text-sm">Email</span>
                                    <a href="mailto:alexmit450@gmail.com" className="text-schematic-primary font-bold font-mono text-right hover:text-schematic-accent transition-colors text-xs md:text-sm">alexmit450@gmail.com</a>
                                </div>
                                <div className="flex justify-between items-center border-b border-schematic-grid/30 pb-2">
                                    <span className="text-schematic-secondary font-mono text-sm">Phone</span>
                                    <span className="text-schematic-primary font-bold font-mono text-right">(614) 966-3676</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-schematic-grid/30 pb-2">
                                    <span className="text-schematic-secondary font-mono text-sm">Location</span>
                                    <div className="flex items-center space-x-2 text-schematic-primary font-bold font-mono">
                                        <MapPin className="w-3 h-3 text-schematic-accent" />
                                        <span>New Albany, OH</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Pills */}
                            <div className="flex flex-wrap gap-2">
                                {["Full-stack", "IoT", "Cloud", "Security", "Embedded"].map((skill) => (
                                    <span key={skill} className="px-3 py-1 rounded-full bg-schematic-accent/10 text-schematic-accent text-xs font-bold font-mono border border-schematic-accent/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Box */}
                            <div className="bg-schematic-accent/5 border border-schematic-accent/20 rounded-xl p-4 flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-schematic-accent flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-schematic-secondary font-mono">
                                    Reach out if you want to build something impactful together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
