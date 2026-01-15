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

            gpa: "4.0/4.0",
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
                "Relevant Coursework: Software Security, Network Security, Operating Systems, Artificial Intelligence.",
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
            tech: ["IoT", "Three.js", "React", "WebGL"],
            link: "https://github.com/alexmitelman/cmm-sense",
            date: "2024",
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
            description: "AI assistant RAG pipeline to provide code explanations and security insights without local cloning.",
            details: [
                "Built an AI assistant RAG pipeline to provide code explanations and security insights without local cloning for public Github repos.",
                "Implemented hybrid semantic and keyword search with vector embeddings to generate contextual, cited answers from GitHub APIs.",
                "Architected data flow from ingestion to language detection, providing users with specific file and line references.",
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
            name: "CLASSIFIED_PROJECT_ALPHA",
            tech: ["Redacted"],
            date: "Est. 2026",
            description: "Advanced neural interface prototype. Access restricted.",
            details: ["Clearance Level 5 Required"],
        },
        {
            name: "SYSTEM_OPTIMIZER_V2",
            tech: ["Rust", "WASM"],
            date: "Pending",
            description: "High-performance system resource allocator.",
            details: ["In Development"],
        },
        {
            name: "NETWORK_SENTINEL",
            tech: ["Go", "eBPF"],
            date: "Pending",
            description: "Real-time packet inspection and anomaly detection.",
            details: ["In Development"],
        },
        {
            name: "QUANTUM_SIM",
            tech: ["Python", "Qiskit"],
            date: "Pending",
            description: "Quantum circuit simulator for educational purposes.",
            details: ["In Development"],
        },
        {
            name: "DATA_VAULT",
            tech: ["Solidity", "IPFS"],
            date: "Pending",
            description: "Decentralized encrypted storage solution.",
            details: ["In Development"],
        },
    ],
    skills: {
        languages: ["C++", "C#", "Python", "Java", "SQL", "HTML", "JavaScript", "Assembly"],
        software: ["Visual Studio", "VS Code", "Eclipse", "GitHub", "SVN", "Git", "Office", "MATLAB", "SolidWorks"],
    },
};
