"use client";

import { useState } from "react";
import { Send, Mail, Box } from "lucide-react";
import { DigitalTwin } from "@/components/visuals/DigitalTwin";

export function DataUplink() {
    const [status, setStatus] = useState<"IDLE" | "TRANSMITTING" | "SENT">("IDLE");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("TRANSMITTING");

        // Get form data
        const form = e.target as HTMLFormElement;
        const name = (form.elements[0] as HTMLInputElement).value;
        const email = (form.elements[1] as HTMLInputElement).value;
        const subject = (form.elements[2] as HTMLInputElement).value;
        const message = (form.elements[3] as HTMLTextAreaElement).value;

        setTimeout(() => {
            setStatus("SENT");
            // Removed "Email: ${email}" from body as requested
            window.location.href = `mailto:alexmit450@gmail.com?subject=${encodeURIComponent(subject)}&body=Name: ${name}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            setTimeout(() => setStatus("IDLE"), 3000);
        }, 1500);
    };

    return (
        <section id="data-uplink" className="py-20 bg-schematic-bg/30">
            <div className="container mx-auto px-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 rounded-lg relative overflow-hidden">

                    <div className="flex items-center space-x-2 mb-6 text-schematic-accent font-mono text-sm">
                        <Mail className="w-4 h-4 animate-pulse" />
                        <span className="font-bold">SECURE_MESSAGE_UPLINK</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-schematic-secondary">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b border-schematic-grid py-2 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors"
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-schematic-secondary">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-transparent border-b border-schematic-grid py-2 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors"
                                placeholder="Enter Email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-schematic-secondary">Subject</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-transparent border-b border-schematic-grid py-2 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors"
                            placeholder="Enter Subject"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-schematic-secondary">Message</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-transparent border border-schematic-grid rounded p-3 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors resize-none"
                            placeholder="Enter Message..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status !== "IDLE"}
                        className="w-full bg-schematic-accent/10 border border-schematic-accent text-schematic-accent py-3 font-mono font-bold hover:bg-schematic-accent hover:text-schematic-bg transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === "IDLE" && (
                            <>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                <span className="text-sm">INITIATE_UPLOAD</span>
                            </>
                        )}
                        {status === "TRANSMITTING" && <span className="text-sm">TRANSMITTING_PACKETS...</span>}
                        {status === "SENT" && <span className="text-sm">UPLOAD_COMPLETE</span>}
                    </button>

                    {/* Target Display */}
                    <div className="text-center pt-4 border-t border-schematic-grid/30">
                        <p className="text-[10px] font-mono text-schematic-grid mb-4">
                            TARGET_UPLINK: <span className="text-schematic-secondary">alexmit450@gmail.com</span>
                        </p>

                        <div className="h-24 w-full border border-schematic-grid/50 rounded overflow-hidden relative bg-black/20 flex items-center justify-center">
                            <DigitalTwin />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
