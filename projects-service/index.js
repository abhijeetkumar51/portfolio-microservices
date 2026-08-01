const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded projects data based on the original frontend
const projects = [
    {
        id: 'ai-resume-analyzer',
        title: 'AI-Powered ATS Resume Analyzer',
        description: 'Developed an AI-powered ATS Resume Analyzer using Flask and Groq AI for resume-job matching.',
        category: 'ai',
        icon: 'fas fa-file-alt',
        tech: ['Flask', 'Groq AI', 'Docker', 'GitHub Actions', 'HTML', 'CSS'],
        links: {
            github: 'https://github.com/abhijeetkumar51/ai-resume-analyzer',
            live: 'https://ai-resume-analyzer-oe74.onrender.com'
        },
        details: {
            date: 'Mar 2026',
            type: 'AI/ML, DevOps',
            teamStatus: 'Solo Project',
            longDescription: 'Developed an AI-powered ATS Resume Analyzer using Flask and Groq AI for resume-job matching. Engineered PDF text extraction and automated ATS score generation with skill-gap analysis. Containerized the application using Docker and integrated GitHub Actions for CI/CD automation. Optimized deployment scalability through environment-based API management and cloud-ready setup.',
            features: [
                'Developed an AI-powered ATS Resume Analyzer using Flask and Groq AI for resume-job matching.',
                'Engineered PDF text extraction and automated ATS score generation with skill-gap analysis.',
                'Containerized the application using Docker and integrated GitHub Actions for CI/CD automation.',
                'Optimized deployment scalability through environment-based API management and cloud-ready setup.'
            ],
            detailedTech: ['Flask', 'Groq AI', 'Docker', 'GitHub Actions', 'HTML', 'CSS'],
            challenges: [
                { title: 'Implementing accurate ATS scoring algorithm & PDF parsing.', solution: 'Engineered text extraction pipeline and utilized Groq AI for resume-job matching and skill-gap analysis.' },
                { title: 'Optimizing deployment scalability.', solution: 'Containerized application with Docker, integrated GitHub Actions CI/CD automation, and setup environment-based API management.' }
            ]
        }
    },
    {
        id: 'ai-language-partner',
        title: 'AI-Language partner',
        description: 'Designed an AI-driven language learning platform supporting contextual conversations and personalized learning experiences.',
        category: 'ai',
        icon: 'fas fa-robot',
        tech: ['Python', 'HTML', 'CSS', 'Gemini API', 'MySQL'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Ai-Language-partner'
        },
        details: {
            date: 'Jul 2025',
            type: 'AI/ML, Web Development',
            teamStatus: 'Solo Project',
            longDescription: 'Designed an AI-driven language learning platform supporting contextual conversations and personalized learning experiences. Integrated Speech-to-Text and Text-to-Speech functionalities using AI APIs to enhance accessibility and interaction flow. Architected backend services using Python, Flask, and MySQL for efficient session handling and conversation management. Enhanced contextual response accuracy through prompt engineering techniques and Gemini AI-based conversational integration.',
            features: [
                'Designed an AI-driven language learning platform supporting contextual conversations and personalized learning experiences.',
                'Integrated Speech-to-Text and Text-to-Speech functionalities using AI APIs to enhance accessibility and interaction flow.',
                'Architected backend services using Python, Flask, and MySQL for efficient session handling and conversation management.',
                'Enhanced contextual response accuracy through prompt engineering techniques and Gemini AI-based conversational integration.'
            ],
            detailedTech: ['Python', 'Flask', 'HTML', 'CSS', 'Gemini API', 'MySQL'],
            challenges: [
                { title: 'Integrating speech interaction flow seamlessly.', solution: 'Integrated Speech-to-Text and Text-to-Speech functionalities using AI APIs for interactive user flow.' },
                { title: 'Maintaining contextual response accuracy.', solution: 'Utilized prompt engineering techniques alongside Gemini AI conversational integration and MySQL session handling.' }
            ]
        }
    },
    {
        id: 'plastic-waste',
        title: 'Plastic Waste Management',
        description: 'A web application that helps track, manage, and reduce plastic waste through community participation and data visualization.',
        category: 'web',
        icon: 'fas fa-recycle',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        links: {
            github: 'https://github.com/abhijeetkumar51/plastic-Waste'
        },
        details: {
            date: 'Nov 2024',
            type: 'Web Development',
            teamStatus: 'Team Project',
            longDescription: 'The Plastic Waste Management system is a comprehensive web application designed to track, manage, and reduce plastic waste through community participation and data visualization. It empowers users and organizations to monitor their plastic footprint and contribute to a cleaner environment.',
            features: [
                'Waste tracking and reporting system',
                'Interactive data visualization dashboard',
                'Community challenges and rewards',
                'Recycling center locator',
                'Educational resources on plastic waste reduction'
            ],
            detailedTech: ['HTML5', 'CSS3', 'JavaScript'],
            challenges: [
                { title: 'Real-time data synchronization across multiple users.', solution: 'Implemented Firebase Realtime Database for instant data updates and offline support.' },
                { title: 'Creating an intuitive user interface for data visualization.', solution: 'Utilized Chart.js for responsive and interactive data visualizations with a mobile-first approach.' }
            ]
        }
    },
    {
        id: 'grade-calculator',
        title: 'Grade Calculator',
        description: 'Built a dual-mode Grade Calculator — a Java console application and a responsive web application to compute SGPA and CGPA using a credit-based 10-point grading scale.',
        category: 'web',
        icon: 'fas fa-calculator',
        tech: ['Java', 'HTML', 'CSS', 'JS'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Grade-calculator'
        },
        details: {
            date: 'Apr 2024',
            type: 'Java & Web Development',
            teamStatus: 'Solo Project',
            longDescription: 'Built a dual-mode Grade Calculator — a Java console application and a responsive web application to compute SGPA and CGPA using a credit-based 10-point grading scale. Implemented SGPA formula Σ(Grade Point × Credits) / Σ(Credits) and CGPA as average of all semester SGPAs, supporting unlimited students and semesters. Applied a modern web interface using vanilla HTML, CSS, and JavaScript featuring dark glassmorphism UI, animated CGPA ring charts, colour-coded grade badges, and toast notifications. Improved input validation, real-time feedback, and error handling to ensure accurate grade data entry.',
            features: [
                'Built a dual-mode Grade Calculator — a Java console application and a responsive web application to compute SGPA and CGPA using a credit-based 10-point grading scale.',
                'Implemented SGPA formula Σ(Grade Point × Credits) / Σ(Credits) and CGPA as average of all semester SGPAs, supporting unlimited students and semesters.',
                'Applied a modern web interface using vanilla HTML, CSS, and JavaScript featuring dark glassmorphism UI, animated CGPA ring charts, colour-coded grade badges, and toast notifications.',
                'Improved input validation, real-time feedback, and error handling to ensure accurate grade data entry.'
            ],
            detailedTech: ['Java', 'HTML', 'CSS', 'JS'],
            challenges: [
                { title: 'Implementing credit-weighted SGPA & CGPA math across dynamic semester structures.', solution: 'Engineered mathematical formulas in both Java console backend and JS frontend supporting unlimited students and semesters.' },
                { title: 'Building a modern responsive glassmorphism interface with dynamic visualizations.', solution: 'Applied custom CSS dark glassmorphism UI styling, animated CGPA ring charts, colour-coded grade badges, and interactive toast notifications.' }
            ]
        }
    },
    {
        id: 'expense-tracker',
        title: 'Expense Tracker',
        description: 'A full-stack Expense Tracker application for real-time income & expense management, category analytics, and personal budget tracking.',
        category: 'web',
        icon: 'fas fa-wallet',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Expense-Tracker',
            live: 'https://expense-tracker-ten-murex-80.vercel.app/'
        },
        details: {
            date: 'Jan 2025',
            type: 'Full-Stack Web Development',
            teamStatus: 'Solo Project',
            longDescription: 'Developed a full-stack Expense Tracker web application built with React and Node.js. Designed to help users track daily income and expenses, monitor category-wise spending habits, visualize budget analytics, and maintain financial logs securely. Deployed live on Vercel.',
            features: [
                'Real-time income and expense tracking with custom category tagging',
                'Interactive financial breakdown dashboard and budget analytics',
                'Secure user authentication and multi-user session management',
                'Responsive modern interface designed for mobile and desktop screens',
                'Production deployment on Vercel with cloud REST API integration'
            ],
            detailedTech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Vercel'],
            challenges: [
                { title: 'Designing dynamic financial calculation and real-time state management.', solution: 'Engineered modular React components with context API state management for immediate UI reactivity.' },
                { title: 'Ensuring seamless cloud deployment with client-side routing.', solution: 'Configured single-page app redirection rules and deployed frontend to Vercel connected with RESTful API services.' }
            ]
        }
    },
    {
        id: 'digital-clock',
        title: 'Digital Clock App',
        description: 'A feature-rich digital clock application with multiple time zones, alarms, and customizable themes, built with Java Swing.',
        category: 'desktop',
        icon: 'far fa-clock',
        tech: ['Java', 'Swing', 'OOP'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Digital-clock-dark_mode'
        },
        details: {
            date: 'Oct 2022 - Dec 2022',
            type: 'Desktop Application',
            teamStatus: 'Solo Project',
            longDescription: 'A feature-rich digital clock application with multiple time zones, alarms, and customizable themes. Built with Java Swing, this desktop application provides a clean and intuitive interface for time management across different time zones.',
            features: [
                'Multiple time zone display',
                'Customizable alarm system with multiple alarms',
                'Stopwatch and countdown timer',
                'Customizable themes and display formats',
                'Minimal system resource usage'
            ],
            detailedTech: ['Java', 'Java Swing', 'OOP'],
            challenges: [
                { title: 'Implementing accurate timekeeping across different time zones.', solution: 'Utilized Java\'s built-in TimeZone and Calendar classes to handle time zone conversions and DST changes.' },
                { title: 'Creating a responsive and modern UI with Swing.', solution: 'Implemented custom UI components and a theme system to enhance the default Swing look and feel.' }
            ]
        }
    }
];

// Routes
app.get('/api/projects', (req, res) => {
    // Return all projects
    res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
    // Return specific project by ID
    const project = projects.find(p => p.id === req.params.id);
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
    console.log(`Projects Service running on port ${PORT}`);
});
