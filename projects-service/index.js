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
        id: 'ai-language-partner',
        title: 'AI Language Partner',
        description: 'An intelligent language learning platform that helps users practice and improve their language skills through AI-powered conversations.',
        category: 'ai',
        icon: 'fas fa-robot',
        tech: ['Flask', 'Python', 'Gemini API', 'JavaScript'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Ai-Language-partner/blob/main/Ai%20Language%20partner.py'
        },
        details: {
            date: 'Jan 2023 - Present',
            type: 'AI/ML, Web Development',
            teamStatus: 'Solo Project',
            longDescription: 'The AI Language Partner is an innovative platform designed to help language learners practice and improve their skills through natural conversations with an AI. The system uses advanced NLP to provide contextual responses, correct grammar, and suggest improvements in real-time.',
            features: [
                'Real-time AI-powered conversations in multiple languages',
                'Grammar correction and vocabulary suggestions',
                'Progress tracking and personalized learning paths',
                'Speech recognition for pronunciation practice',
                'Interactive exercises and quizzes'
            ],
            detailedTech: ['Python', 'Flask', 'Gemini API', 'Docker'],
            challenges: [
                { title: 'Implementing real-time conversation with low latency.', solution: 'Used WebSocket for bidirectional communication and implemented message queuing for handling multiple concurrent users.' },
                { title: 'Providing accurate grammar corrections.', solution: 'Integrated a combination of rule-based and ML-based grammar checking systems.' }
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
            github: 'https://github.com/abhijeetkumar51/plastic-Waste/blob/main/plastic_waste.html'
        },
        details: {
            date: 'Mar 2023 - Jun 2023',
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
        id: 'digital-clock',
        title: 'Digital Clock App',
        description: 'A feature-rich digital clock application with multiple time zones, alarms, and customizable themes, built with Java Swing.',
        category: 'desktop',
        icon: 'far fa-clock',
        tech: ['Java', 'Swing', 'OOP'],
        links: {
            github: 'https://github.com/abhijeetkumar51/Digital-clock-dark_mode-/blob/main/DigitalClock'
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
