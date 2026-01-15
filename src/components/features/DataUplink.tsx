"use client";

import { useState } from "react";
import { Send, Wifi } from "lucide-react";

export function DataUplink() {
    const [status, setStatus] = useState<"IDLE" | "TRANSMITTING" | "SENT">("IDLE");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("TRANSMITTING");

        // Get form data
        const form = e.target as HTMLFormElement;
        const name = (form.elements[0] as HTMLInputElement).value;
        const email = (form.elements[1] as HTMLInputElement).value;
        const message = (form.elements[2] as HTMLTextAreaElement).value;

        setTimeout(() => {
            setStatus("SENT");
            // Removed "Email: ${email}" from body as requested
            window.location.href = `mailto:alexmit450@gmail.com?subject=Portfolio Inquiry: ${name}&body=Name: ${name}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            setTimeout(() => setStatus("IDLE"), 3000);
        }, 1500);
    };

    return (
        <section id="data-uplink" className="py-20 border-t border-schematic-grid bg-schematic-bg/30">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="flex items-center space-x-2 mb-8 text-schematic-accent font-mono text-sm">
                    <Wifi className="w-4 h-4 animate-pulse" />
                    <span>ESTABLISH_DATA_UPLINK</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 rounded-lg relative overflow-hidden">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-schematic-accent" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-schematic-accent" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-schematic-accent" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-schematic-accent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-schematic-secondary">SOURCE_ID</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b border-schematic-grid py-2 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors"
                                placeholder="ENTER_NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-schematic-secondary">RETURN_PATH</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-transparent border-b border-schematic-grid py-2 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors"
                                placeholder="ENTER_EMAIL"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-schematic-secondary">PAYLOAD_DATA</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-transparent border border-schematic-grid rounded p-3 font-mono text-schematic-primary focus:outline-none focus:border-schematic-accent transition-colors resize-none"
                            placeholder="ENTER_MESSAGE_CONTENT..."
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
                                <span>INITIATE_UPLOAD</span>
                            </>
                        )}
                        {status === "TRANSMITTING" && <span>TRANSMITTING_PACKETS...</span>}
                        {status === "SENT" && <span>UPLOAD_COMPLETE</span>}
                    </button>

                    {/* Target Display */}
                    <div className="text-center pt-4 border-t border-schematic-grid/30">
                        <p className="text-[10px] font-mono text-schematic-grid">
                            TARGET_UPLINK: <span className="text-schematic-secondary">alexmit450@gmail.com</span>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}
