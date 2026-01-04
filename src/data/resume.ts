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
            specialization: "Engineering & Computer Science",
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
            stack: ["IoT", "C#", "C++", "React", "BLE"],
            achievements: [
                "Fully prototyped 3 iterations of a full-stack IoT humiture and collision detection system achieving greater than 120-day battery life through deep sleep and hardware interrupt optimization.",
                "Engineered a C# companion application for real-time sensor visualization, device configuration, TCP-based data streaming, and designed a custom JSON protocol over BLE/TCP.",
                "Implemented custom JSON exports for 16+ different feature types including Cloud-to-Surface and Tolerance reports by refactoring core C++ systems.",
                "Simulated over 1,200 hours of continuous CMM operation using PLC hardware and PowerShell scripts to display real-world usage.",
                "Authored a C++ Smart Cylinder algorithm that calculates measurement boundaries to eliminate 100% of path-planning and out-of-range errors.",
                "Reworked cross-application communication layers using named pipes to sequentially query report status, ensuring data integrity.",
            ],
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
            stack: ["HVAC", "Networking", "Hardware"],
            achievements: [
                "Executed large-scale temperature control installations for AWS and Google data centers focusing on commercial HVAC and cooling efficiency.",
                "Installed surveillance devices and Wi-Fi networks at an industrial scale and learned technical engineering practices.",
            ],
        },
    ],
    projects: [
        {
            name: "CMM-Sense IoT Device",
            description: "Digital Twin of the industrial sensor node.",
            tech: ["IoT", "Three.js", "React", "WebGL"],
            link: "https://github.com/alexmitelman/cmm-sense",
            date: "2024",
            details: [
                "Real-time acceleration and humiture data broadcast",
                "Interactive 3D visualization",
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
            name: "The Legend of Zelda with Portals",
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
    ],
    skills: {
        languages: ["C++", "C#", "Python", "Java", "SQL", "HTML", "JavaScript", "Assembly"],
        software: ["Visual Studio", "VS Code", "Eclipse", "GitHub", "SVN", "Git", "Office", "MATLAB", "SolidWorks"],
    },
};
