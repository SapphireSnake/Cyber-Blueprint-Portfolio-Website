"use client";

import { useState, useEffect } from "react";
import { SystemHeader } from "@/components/layout/SystemHeader";
import { SmartSearch } from "@/components/features/SmartSearch";
import { GridBackground } from "@/components/visuals/GridBackground";
import { MqttStream } from "@/components/visuals/MqttStream";
import { ProtocolHandshake } from "@/components/system/ProtocolHandshake";
import { SystemFooter } from "@/components/layout/SystemFooter";
import { DataUplink } from "@/components/features/DataUplink";
import { GameOverlay } from "@/components/ui/GameOverlay";
import { ExperienceLog } from "@/components/features/ExperienceLog";
import { EducationLog } from "@/components/features/EducationLog";
import { Mail, Github, Linkedin, FileText } from "lucide-react";

import { BootSequence } from "@/components/system/BootSequence";
import { TechStack } from "@/components/features/TechStack";
import { AboutSection } from "@/components/features/AboutSection";
import { SectionReveal } from "@/components/ui/SectionReveal";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [bootComplete, setBootComplete] = useState(true);

  useEffect(() => {
    const handleRestart = () => {
      setIsLoaded(false);
      setBootComplete(false);
    };
    window.addEventListener("restart-intro", handleRestart);
    return () => window.removeEventListener("restart-intro", handleRestart);
  }, []);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [glowRadius, setGlowRadius] = useState(100);

  // Track Filter Changes
  useEffect(() => {
    if (projectFilter) {
      window.dispatchEvent(new CustomEvent("filter-changed", { detail: projectFilter }));
    }
  }, [projectFilter]);

  // 1. Run Handshake (Loading)
  if (!isLoaded) {
    return <ProtocolHandshake onComplete={() => setIsLoaded(true)} />;
  }

  // 2. Run Boot Sequence (Menu)
  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  // 3. Show Content
  return (
    <main className="min-h-screen relative">

      {isLoaded && (
        <div className="animate-in fade-in duration-1000">
          <GridBackground radius={glowRadius} />
          <SystemHeader />
          <MqttStream side="left" />

          <div className="container mx-auto px-4 pt-32 pb-20">
            {/* Central Hub Hero */}
            <section id="hero" className="min-h-[80vh] flex flex-col justify-center relative mb-6">
              <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-6xl mx-auto w-full relative">

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-8 relative z-10">
                  {/* Left Column: Text & Socials */}
                  <div className="flex flex-col justify-center md:w-1/2 space-y-8">

                    {/* Text Container */}
                    <div className="w-fit">
                      <div className="text-left">
                        <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6 text-schematic-primary tracking-tighter">
                          Hello, I'm <br />
                          <span className="text-gradient font-extrabold pr-2">Alex Mitelman</span>
                        </h1>
                        <div className="flex items-stretch gap-6">
                          <div className="w-2 rounded-full bg-gradient-void-vertical shrink-0 shadow-[0_0_12px_rgba(0,83,159,0.6)]" />
                          <p className="text-xl md:text-2xl text-schematic-secondary font-mono leading-relaxed">
                            Software Engineer specializing in<br />
                            Information and Computation Assurance<br />
                            Graduated Dec 2025
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Social Links (Outside Glass) */}
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <a
                        href="mailto:alexmit450@gmail.com"
                        className="glass-panel flex items-center space-x-3 p-3 rounded hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">EMAIL</span>
                      </a>
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        className="glass-panel flex items-center space-x-3 p-3 rounded hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">RESUME</span>
                      </a>
                      <a
                        href="#smart-search"
                        onClick={(e) => {
                          e.preventDefault();
                          setProjectFilter("GITHUB_REPO");
                          document.getElementById("smart-search")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="glass-panel flex items-center space-x-3 p-3 rounded hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group cursor-pointer"
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">GITHUB</span>
                      </a>
                      <a
                        href="https://linkedin.com/in/alexmitelman"
                        target="_blank"
                        className="glass-panel flex items-center space-x-3 p-3 rounded hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">LINKEDIN</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Image (Middle Right, Overlapping) */}
                  <div className="md:w-1/2 flex justify-center md:justify-end mt-12 md:mt-0 relative">
                    <div className="glass-base rounded-2xl p-4 flex items-center justify-center">
                      <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] group">
                        <div className="relative w-full h-full p-2">
                          <img
                            src="/alex-mitelman.png"
                            alt="Alex Mitelman"
                            className="w-full h-full object-contain hero-image transition-all duration-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            <SectionReveal>
              <AboutSection />
            </SectionReveal>

            <SectionReveal>
              <TechStack
                selectedTag={projectFilter}
                onSelectTag={(tag) => setProjectFilter(prev => prev === tag ? null : tag)}
              />
            </SectionReveal>

            <SectionReveal>
              <SmartSearch externalFilter={projectFilter} onFilterChange={setProjectFilter} />
            </SectionReveal>

            <SectionReveal>
              <ExperienceLog />
            </SectionReveal>

            <SectionReveal>
              <EducationLog />
            </SectionReveal>

            <SectionReveal>
              <DataUplink />
            </SectionReveal>
          </div>

          <SystemFooter radius={glowRadius} setRadius={setGlowRadius} />
          <MqttStream side="right" />
          <GameOverlay />
        </div>
      )}
    </main>
  );
}
