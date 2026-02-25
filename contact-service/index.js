const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Handle POST request from contact form
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // In a real application, you would save this to a database
    // or send an email. For now, we will just log it and return success.
    console.log(`Received contact form submission:`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required fields.'
        });
    }

    // Simulate successful processing
    res.status(200).json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
    console.log(`Contact Service running on port ${PORT}`);
});
