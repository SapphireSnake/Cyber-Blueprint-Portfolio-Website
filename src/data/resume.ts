export const RESUME = {
    name: "Alex Mitelman",
    title: "Systems Architect",
    contact: {
        email: "alexmit450@gmail.com",
        phone: "(614) 966-3676",
        linkedin: "linkedin.com/in/alexmitelman",
        location: "New Albany, OH",
    },
    education: [
        {
            school: "The Ohio State University",
            degree: "B.S. in Computer Science Engineering",
            specialization: "Specialized in Information and Computation Assurance",
            gpa: "3.6/4.0",
            honors: "Summa Cum Laude • Dean’s List 2022-2025",
            graduation: "December 2025",
            logo: "/logos/osu.png?v=2",
        },
        {
            school: "New Albany High School",
            degree: "High School Diploma",

            gpa: "4.0/4.0 Weighted",
            honors: "Summa Cum Laude",
            graduation: "May 2022",
            logo: "/logos/na.jpg",
        }
    ],
    experience: [
        {
            company: "QXSOFT - CMM-Manager",
            role: "Computer Science Intern",
            location: "Lewis Center, OH",
            period: "March 2025 – October 2025",
            logo: "/logos/QxSoft logo.png",
            description: "QxSoft develops software for Coordinate Measuring Machines and I was a part of their only software development team which consisted of my senior developer and the president of the company. Because the team was so small, I was expected to manage multiple R&D projects independently while also assisting on time sensitive tasks for the main software of the company. Working in an industry where there is zero margin for error taught me how to be reliable and fulfill tasks with validation logic for task completion.",
            stack: ["IoT", "C#", "C++", "React", "BLE"],
            achievements: [],
        },
        {
            company: "The Ohio State University",
            role: "B.S. Computer Science Engineering",
            location: "Columbus, OH",
            period: "Aug 2022 – Dec 2025",
            logo: "/logos/osu.png?v=2",
            stack: ["Security", "AI", "OS", "Network"],
            achievements: [
                "Relevant Coursework: Information Security Projects, Information Security, Network Security, Operating Systems, Code Breaking, Knowledge Systems Capstone.",
            ],
        },
        {
            company: "JSET Automated Technologies",
            role: "Controls Technician Apprentice",
            location: "Columbus, OH",
            period: "Jul 2022 – Sep 2022",
            logo: "/logos/JSET logo.png",
            description: "My biggest takeaway from this role was how to handle myself in an active engineering environment. I was responsible for installing temperature controls, IP surveillance, and wireless network and server infrastructure, which required following strict engineering protocols at several notable data centers in Columbus Ohio.",
            stack: ["HVAC", "Networking", "Hardware"],
            achievements: [],
        },
    ],
    projects: [
        {
            name: "CMM-Sense IoT Device",
            description: "Real-time acceleration and humiture data broadcast.",
            tech: ["C++", "Python", "C#", "ESP32", "CircuitPython"],
            link: "https://github.com/alexmitelman/cmm-sense",
            date: "Oct 2025",
            details: [
                "Digital Twin of the industrial sensor node",
                "Hardware abstraction layer"
            ]
        },
        {
            name: "Repo Rover",
            tech: ["Next.js", "Flask", "LangChain", "Elasticsearch", "OpenAI"],
            date: "Dec 2025",
            link: "https://github.com/SapphireSnake/Repo.Rover",
            video: "/tell-me-about-repo-rover.mov",
            description: "AI assistant RAG pipeline to provide code explanations and security insights without local cloning.",
            details: [
                "Built an AI assistant RAG pipeline to provide code explanations and security insights without local cloning for public Github repos.",
                "Implemented hybrid semantic and keyword search with vector embeddings to generate contextual, cited answers from GitHub APIs.",
                "Architected data flow from ingestion to language detection, providing users with specific file and line references.",
            ],
        },
        {
            name: "BigBooks DB Explorer",
            tech: ["React", "Next.js", "SQLite", "AI"],
            date: "Jan 2025",
            description: "Database visualizer for SQL/SQLite files with AI-powered query generation.",
            link: "https://github.com/SapphireSnake/BIGBooks-DB-Explorer",
            video: "/BigBooks-Explorer-Video-demo.mov?v=3",
            details: [
                "Developed a web-based database explorer allowing users to upload and visualize SQLite databases.",
                "Integrated AI-driven query generation to assist users in writing complex SQL queries.",
                "Implemented a responsive UI for executing queries and viewing results in real-time.",
            ],
        },
        {
            name: "The Legend of Zelda\nwith Portals",
            tech: ["C#"],
            date: "Jan 2025",
            description: "2D Zelda-inspired game with dynamic rooms and real-time controls.",
            link: "https://github.com/SapphireSnake/The-Legend-of-Zelda-With-Portal-Gun-Final",
            video: "/Legend-Of-Zelda-With-Portals-Boss.mov",
            details: [
                "Collaborated to create a 2D Zelda-inspired game with dynamic rooms, real-time controls, and interactive objectives.",
                "Applied Agile methodologies and SDLC principles throughout the development and debugging phases.",
            ],
        },
        {
            name: "Portfolio Website",
            tech: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion"],
            date: "Jan 2026",
            description: "Interactive resume website featuring glassmorphism and dynamic theming.",
            link: "https://github.com/SapphireSnake/Firefox-Inspired-Portfolio-Website",
            details: [
                "Designed and built a modern, interactive portfolio using Next.js and Tailwind CSS.",
                "Implemented advanced UI effects including glassmorphism, holographic cards, and 3D digital twins.",
                "Optimized for performance and responsiveness across all devices.",
            ],
        },

        {
            name: "Hybrid Language Interpreter",
            tech: ["Java", "JFlex", "CUP", "Make"],
            date: "Dec 2024",
            image: "/quandary_demo_screenshot_1768519349370.png",
            description: "Interpreter for a custom language combining functional and imperative paradigms.",
            details: [
                "Implemented a complete interpreter including lexer (JFlex), parser (CUP), and AST evaluation engine in Java.",
                "Engineered features for static type checking, scope analysis, and concurrent execution with thread synchronization.",
                "Built a custom memory manager supporting explicit allocation and Mark-Sweep garbage collection.",
            ],
        },
        {
            name: "React Smart Lock",
            tech: ["React", "Node.js", "WebSockets", "C++", "Arduino"],
            date: "May 2025",
            description: "IoT smart lock with real-time web interface and hardware actuation.",
            details: [
                "Developed the front-end interface in React, which communicated lock/unlock commands to a Node.js server using WebSockets for live, low latency interaction.",
                "Programmed an Arduino microcontroller in C++ to receive commands to actuate the solenoid locking mechanism.",
            ],
        },
        {
            name: "Autonomous Drone Flight Controller",
            tech: ["MATLAB", "Simulink", "Python", "C++"],
            date: "Pending",
            description: "PID control system simulation for quadcopter stability, validated with real-time telemetry analysis.",
            details: ["In Development"],
        },
        {
            name: "IoT Security & Anomaly Detection",
            tech: ["C#", "OWIN", "SQLite", "WPF", "REST API"],
            date: "Nov 2025",
            description: "IoT security framework featuring self-hosted OWIN APIs, SQL injection honeypots, and real-time anomaly detection.",
            images: ["/iot-anomaly-1.png", "/iot-anomaly-2.png"],
            details: [
                "Engineered a self-hosted OWIN web server within a WPF application to expose RESTful API endpoints for sensor data.",
                "Implemented a dual-endpoint architecture: a vulnerable baseline for SQL injection testing and a hardened secure endpoint with whitelisting.",
                "Developed an anomaly detection engine using SQLite to identify and log irregular sensor patterns (e.g., spoofing attempts).",
            ],
        },
    ],
    skills: {
        languages: ["C++", "C#", "Python", "Java", "SQL", "HTML", "JavaScript", "Assembly"],
        software: ["Visual Studio", "VS Code", "Eclipse", "GitHub", "SVN", "Git", "Office", "MATLAB", "SolidWorks"],
    },
};
