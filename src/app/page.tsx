"use client";

import { useState } from "react";
import { SystemHeader } from "@/components/SystemHeader";
import { SkillMatrix } from "@/components/SkillMatrix";
import { SmartSearch } from "@/components/SmartSearch";
import { GridBackground } from "@/components/GridBackground";
import { MqttStream } from "@/components/MqttStream";
import { ProtocolHandshake } from "@/components/ProtocolHandshake";
import { DigitalTwin } from "@/components/DigitalTwin";
import { SystemFooter } from "@/components/SystemFooter";
import { EncryptedText } from "@/components/EncryptedText";
import { TerminalCLI } from "@/components/TerminalCLI";
import { DataUplink } from "@/components/DataUplink";
import { KonamiCode } from "@/components/KonamiCode";
import { GameOverlay } from "@/components/GameOverlay";
import { SystemModal } from "@/components/SystemModal";
import { Mail, Github, Linkedin, FileText, Activity, Box, ChevronRight } from "lucide-react";

import { BootSequence } from "@/components/BootSequence";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);

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
      <KonamiCode />

      {isLoaded && (
        <div className="animate-in fade-in duration-1000">
          <GridBackground />
          <SystemHeader />
          <MqttStream />

          <div className="container mx-auto px-4 pt-32 pb-20">
            {/* Central Hub Hero */}
            <section className="min-h-[80vh] flex flex-col justify-center relative mb-10">
              <div className="border border-schematic-grid bg-schematic-bg/50 backdrop-blur-[2px] p-8 md:p-12 rounded-lg max-w-6xl mx-auto w-full relative overflow-hidden">
                {/* Grid Line Decoration */}
                <div className="absolute top-0 left-0 w-full h-px bg-schematic-grid" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-schematic-grid" />
                <div className="absolute left-0 top-0 h-full w-px bg-schematic-grid" />
                <div className="absolute right-0 top-0 h-full w-px bg-schematic-grid" />

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-8 relative z-10">
                  {/* Left Column: Text & Socials */}
                  <div className="flex flex-col justify-center space-y-12 md:w-1/2">

                    {/* Intro Text */}
                    <div className="text-left">
                      <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6 text-schematic-primary tracking-tighter">
                        Hello, I'm <br />
                        <span className="text-schematic-accent">Alex Mitelman</span>
                      </h1>
                      <p className="text-xl md:text-2xl text-schematic-secondary max-w-xl font-mono leading-relaxed border-l-4 border-schematic-accent pl-6">
                        Backend DevOps & Embedded Engineer.<br />
                        Building resilient systems that bridge the physical and digital worlds.
                      </p>
                    </div>

                    {/* Social Links (Middle Left) */}
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <a
                        href="mailto:alexmit450@gmail.com"
                        className="flex items-center space-x-3 p-3 rounded border border-schematic-grid text-schematic-secondary hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">EMAIL</span>
                      </a>
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        className="flex items-center space-x-3 p-3 rounded border border-schematic-grid text-schematic-secondary hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">RESUME</span>
                      </a>
                      <a
                        href="https://github.com/alexmitelman"
                        target="_blank"
                        className="flex items-center space-x-3 p-3 rounded border border-schematic-grid text-schematic-secondary hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">GITHUB</span>
                      </a>
                      <a
                        href="https://linkedin.com/in/alexmitelman"
                        target="_blank"
                        className="flex items-center space-x-3 p-3 rounded border border-schematic-grid text-schematic-secondary hover:text-schematic-accent hover:border-schematic-accent hover:bg-schematic-accent/10 transition-all group"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="font-mono text-sm font-bold">LINKEDIN</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Image (Middle Right, Overlapping) */}
                  <div className="md:w-1/2 flex justify-center md:justify-end mt-12 md:mt-0 relative">
                    <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] group">
                      <div className="relative w-full h-full p-2">
                        <img
                          src="/AI-me.png"
                          alt="Alex Mitelman"
                          className="w-full h-full object-contain mix-blend-screen hero-image transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SmartSearch />
            <DataUplink />

            {/* System Modules (Bottom) */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-20">
              <button
                onClick={() => setShowTelemetry(true)}
                className="flex items-center justify-between p-6 border border-schematic-grid rounded-lg bg-schematic-bg/50 hover:border-schematic-accent hover:bg-schematic-accent/5 transition-all group text-left"
              >
                <div className="flex items-center space-x-6">
                  <div className="p-3 bg-schematic-accent/10 rounded-lg text-schematic-accent">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-schematic-primary group-hover:text-schematic-accent transition-colors">SYSTEM_TELEMETRY</h3>
                    <p className="text-sm text-schematic-secondary font-mono mt-1">View Live Skill Matrix & Status</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-schematic-grid group-hover:text-schematic-accent transition-colors" />
              </button>

              <button
                onClick={() => setShowDigitalTwin(true)}
                className="flex items-center justify-between p-6 border border-schematic-grid rounded-lg bg-schematic-bg/50 hover:border-schematic-accent hover:bg-schematic-accent/5 transition-all group text-left"
              >
                <div className="flex items-center space-x-6">
                  <div className="p-3 bg-schematic-accent/10 rounded-lg text-schematic-accent">
                    <Box className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-schematic-primary group-hover:text-schematic-accent transition-colors">DIGITAL_TWIN</h3>
                    <p className="text-sm text-schematic-secondary font-mono mt-1">Interactive 3D System Model</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-schematic-grid group-hover:text-schematic-accent transition-colors" />
              </button>
            </div>
          </div>

          <SystemFooter />
          <TerminalCLI />
          <GameOverlay />

          {/* Modals */}
          <SystemModal
            isOpen={showTelemetry}
            onClose={() => setShowTelemetry(false)}
            title="LIVE_SYSTEM_TELEMETRY"
          >
            <SkillMatrix />
          </SystemModal>

          <SystemModal
            isOpen={showDigitalTwin}
            onClose={() => setShowDigitalTwin(false)}
            title="DIGITAL_TWIN_VISUALIZATION"
          >
            <div className="h-[60vh] w-full border border-schematic-grid/50 rounded-lg overflow-hidden relative bg-black/20">
              <DigitalTwin />
            </div>
            <p className="mt-4 text-sm text-schematic-secondary font-mono text-center">
              Interactive 3D representation of the system architecture. Drag to rotate, scroll to zoom.
            </p>
          </SystemModal>
        </div>
      )}
    </main>
  );
}
