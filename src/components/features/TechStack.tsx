import React, { useRef, useState, createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import { Filter } from "lucide-react";

// --- Constants ---
type Category = "Languages & Frameworks" | "Tools & Specialties";

interface TechItem {
    name: string;
    icon: string;
    category: Category;
    color: string; // Background color
    textColor: string;
}

// Colors from reference image
const COLORS = {
    blue: { bg: "#dbeafe", text: "#1e40af" },
    purple: { bg: "#f3e8ff", text: "#6b21a8" },
    orange: { bg: "#ffedd5", text: "#9a3412" },
    green: { bg: "#dcfce7", text: "#166534" },
};

const TECH_ITEMS: TechItem[] = [
    // Languages & Frameworks
    { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB", category: "Languages & Frameworks", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "C#", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png", category: "Languages & Frameworks", color: COLORS.purple.bg, textColor: COLORS.purple.text },
    { name: "Java", icon: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg", category: "Languages & Frameworks", color: COLORS.orange.bg, textColor: COLORS.orange.text },
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6", category: "Languages & Frameworks", color: COLORS.green.bg, textColor: COLORS.green.text },
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E", category: "Languages & Frameworks", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "C", icon: "https://cdn.simpleicons.org/c/A8B9CC", category: "Languages & Frameworks", color: COLORS.purple.bg, textColor: COLORS.purple.text },
    { name: "SQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1", category: "Languages & Frameworks", color: COLORS.orange.bg, textColor: COLORS.orange.text },
    { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB", category: "Languages & Frameworks", color: COLORS.green.bg, textColor: COLORS.green.text },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000", category: "Languages & Frameworks", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "Vue.js", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D", category: "Languages & Frameworks", color: COLORS.purple.bg, textColor: COLORS.purple.text },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933", category: "Languages & Frameworks", color: COLORS.orange.bg, textColor: COLORS.orange.text },

    // Tools & Specialties
    { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032", category: "Tools & Specialties", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "GitHub", icon: "https://cdn.simpleicons.org/github/181717", category: "Tools & Specialties", color: COLORS.purple.bg, textColor: COLORS.purple.text },
    { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1", category: "Tools & Specialties", color: COLORS.orange.bg, textColor: COLORS.orange.text },
    { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248", category: "Tools & Specialties", color: COLORS.green.bg, textColor: COLORS.green.text },
    { name: "Visual Studio", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Visual_Studio_Icon_2022.svg", category: "Tools & Specialties", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "VS Code", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg", category: "Tools & Specialties", color: COLORS.purple.bg, textColor: COLORS.purple.text },
    { name: "Machine Learning", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00", category: "Tools & Specialties", color: COLORS.orange.bg, textColor: COLORS.orange.text },
    { name: "Computer Vision", icon: "https://cdn.simpleicons.org/opencv/5C3EE8", category: "Tools & Specialties", color: COLORS.green.bg, textColor: COLORS.green.text },
    { name: "CI/CD", icon: "https://cdn.simpleicons.org/githubactions/2088FF", category: "Tools & Specialties", color: COLORS.blue.bg, textColor: COLORS.blue.text },
    { name: "Technical Docs", icon: "https://cdn.simpleicons.org/markdown/000000", category: "Tools & Specialties", color: COLORS.purple.bg, textColor: COLORS.purple.text },
];

// --- Context ---
interface TechStackContextType {
    dragX: MotionValue<number>;
    dragY: MotionValue<number>;
    draggingItem: string | null;
    setDraggingItem: (name: string | null) => void;
    activeCard: string | null;
    setActiveCard: (card: string | null) => void;
    registerPill: (name: string, element: HTMLElement) => void;
    itemRects: React.MutableRefObject<Record<string, DOMRect>>;
}

const TechStackContext = createContext<TechStackContextType | null>(null);

// --- Tech Pill Component ---
function TechPill({ item, index, isSelected, onSelect }: {
    item: TechItem;
    index: number;
    isSelected: boolean;
    onSelect?: (tag: string) => void;
}) {
    const context = useContext(TechStackContext);
    const ref = useRef<HTMLDivElement>(null);

    // Register pill position on mount/update
    useEffect(() => {
        if (ref.current && context) {
            context.registerPill(item.name, ref.current);
        }
    }, [context, item.name]);

    if (!context) return null;
    const { dragX, dragY, draggingItem, setDraggingItem, setActiveCard, itemRects } = context;

    const isDragging = draggingItem === item.name;
    const isOtherDragging = draggingItem !== null && !isDragging;

    // Use refs to access latest state in event handlers without re-binding
    const stateRef = useRef({ isOtherDragging, item });
    useEffect(() => {
        stateRef.current = { isOtherDragging, item };
    }, [isOtherDragging, item]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const calculateRepulsion = (latestX: number, latestY: number) => {
        const { isOtherDragging, item } = stateRef.current;
        if (!isOtherDragging || !ref.current) return { x: 0, y: 0 };

        const rect = itemRects.current[item.name];
        if (!rect) return { x: 0, y: 0 };

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = latestX - centerX;
        const dy = latestY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = 250; // BOOSTED Radius

        if (dist < threshold) {
            const force = (1 - dist / threshold) * 60; // Reduced Force from 120
            return {
                x: -(dx / dist) * force,
                y: -(dy / dist) * force
            };
        }
        return { x: 0, y: 0 };
    };

    useMotionValueEvent(dragX, "change", (latestDragX: number) => {
        const repulsion = calculateRepulsion(latestDragX, dragY.get());
        x.set(repulsion.x);
    });

    useMotionValueEvent(dragY, "change", (latestDragY: number) => {
        const repulsion = calculateRepulsion(dragX.get(), latestDragY);
        y.set(repulsion.y);
    });

    // Smooth out the repulsion
    const springX = useSpring(x, { stiffness: 150, damping: 20 });
    const springY = useSpring(y, { stiffness: 150, damping: 20 });

    return (
        <div ref={ref} className="relative z-0" data-tech-pill={item.name}> {/* Static Anchor */}
            <motion.div
                style={{ x: springX, y: springY }} // 1. Repel Wrapper
                className="relative z-0"
            >
                <motion.div
                    drag
                    dragSnapToOrigin={true}
                    dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
                    onDragStart={(e) => {
                        // Capture all positions on start
                        const allPills = document.querySelectorAll('[data-tech-pill]');
                        allPills.forEach((el) => {
                            const name = el.getAttribute('data-tech-pill');
                            if (name && context.itemRects.current) {
                                context.itemRects.current[name] = el.getBoundingClientRect();
                            }
                        });
                        setDraggingItem(item.name);
                        setActiveCard(item.category === "Languages & Frameworks" ? "languages" : "tools");
                    }}
                    onDrag={(e) => {
                        const clientX = 'clientX' in e ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX;
                        const clientY = 'clientY' in e ? (e as MouseEvent).clientY : (e as TouchEvent).touches[0].clientY;
                        dragX.set(clientX);
                        dragY.set(clientY);
                    }}
                    onDragEnd={() => {
                        setDraggingItem(null);
                        setActiveCard(null);
                        dragX.set(-9999); // Move "cursor" away
                        dragY.set(-9999);
                        // Reset repulsion
                        x.set(0);
                        y.set(0);
                    }}
                    whileHover={{ scale: 1.1, cursor: "pointer", zIndex: 50 }}
                    whileDrag={{ scale: 1.2, cursor: "grabbing", zIndex: 50 }}
                    onClick={() => onSelect?.(item.name)}
                    className="relative" // 2. Drag Wrapper (Invisible Handle)
                >
                    <motion.div
                        animate={{
                            y: [0, -15, 0], // Increased float range
                            transition: {
                                duration: 4 + (index % 4), // Slower, more organic duration
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.3
                            }
                        }}
                        className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm border transition-all duration-300",
                            isSelected
                                ? "ring-2 ring-schematic-accent ring-offset-2 ring-offset-schematic-bg shadow-[0_0_15px_var(--color-schematic-accent)] scale-110"
                                : "border-schematic-grid/30 hover:border-schematic-accent/50"
                        )}
                        style={{ backgroundColor: item.color }} // 3. Float Wrapper (Visuals)
                    >
                        <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                        <span className="font-semibold text-sm" style={{ color: item.textColor }}>{item.name}</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function TechStack({ onSelectTag, selectedTag }: { onSelectTag?: (tag: string) => void, selectedTag?: string | null }) {
    const languages = TECH_ITEMS.filter(item => item.category === "Languages & Frameworks");
    const tools = TECH_ITEMS.filter(item => item.category === "Tools & Specialties");

    // Shared State
    const dragX = useMotionValue(-9999);
    const dragY = useMotionValue(-9999);
    const [draggingItem, setDraggingItem] = useState<string | null>(null);
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const itemRects = useRef<Record<string, DOMRect>>({});

    const registerPill = (name: string, element: HTMLElement) => {
        // Initial registration if needed, but mainly handled onDragStart
    };

    return (
        <TechStackContext.Provider value={{ dragX, dragY, draggingItem, setDraggingItem, activeCard, setActiveCard, registerPill, itemRects }}>
            <div id="skills" className="w-full max-w-6xl mx-auto px-4 pt-4 pb-0 md:pt-8 md:pb-2">
                {/* Outer Glass Box */}
                <div
                    className="glass-panel rounded-3xl p-4 md:p-6 relative z-10"
                >
                    <h2 className="font-mono text-xl md:text-2xl text-schematic-accent mb-2 block tracking-wider uppercase font-bold ml-1">
                        Stacks I Build With
                    </h2>
                    <p className="font-mono text-sm text-schematic-secondary mb-6 ml-1 max-w-2xl">
                        Frameworks and tools I have used to ship projects. <span className="text-schematic-accent opacity-80 inline-flex items-center ml-2">Click to <Filter className="w-4 h-4 ml-1" /></span>
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-center">
                        {/* Card 1: Languages & Frameworks */}
                        <div
                            className={cn(
                                "flex-1 w-full glass-base rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg hover:border-schematic-accent/30 relative",
                                activeCard === "languages" ? "z-20" : "z-0"
                            )}
                        >
                            <h3 className="text-2xl font-bold mb-8 text-schematic-primary text-center tracking-tight font-mono">Languages & Frameworks</h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {languages.map((item, index) => (
                                    <TechPill
                                        key={item.name}
                                        item={item}
                                        index={index}
                                        isSelected={selectedTag === item.name}
                                        onSelect={onSelectTag}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card 2: Tools & Specialties */}
                        <div
                            className={cn(
                                "flex-1 w-full glass-base rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg hover:border-schematic-accent/30 relative",
                                activeCard === "tools" ? "z-20" : "z-0"
                            )}
                        >
                            <h3 className="text-2xl font-bold mb-8 text-schematic-primary text-center tracking-tight font-mono">Tools & Specialties</h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {tools.map((item, index) => (
                                    <TechPill
                                        key={item.name}
                                        item={item}
                                        index={index + 10} // Offset index for different animation timing
                                        isSelected={selectedTag === item.name}
                                        onSelect={onSelectTag}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TechStackContext.Provider >
    );
}
