const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting - max 5 contact requests per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter on startup
transporter.verify()
    .then(() => console.log('📧 Email transporter ready'))
    .catch(err => console.error('❌ Email transporter error:', err.message));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'contact-service', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, phone, subject, message, newsletter } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields (name, email, subject, message).'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // Send email
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #4f46e5, #8b5cf6); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
                    </div>
                    <div style="padding: 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #4f46e5; width: 120px;">Name</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #4f46e5;">Email</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #4f46e5;">Phone</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${phone || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #4f46e5;">Subject</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${subject}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #4f46e5;">Newsletter</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${newsletter ? 'Yes' : 'No'}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #4f46e5;">
                            <h3 style="margin: 0 0 10px; color: #4f46e5;">Message</h3>
                            <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        <p style="margin-top: 20px; color: #9ca3af; font-size: 12px; text-align: center;">
                            Sent from Abhijeet's Portfolio Contact Form
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent from ${name} (${email})`);
        res.json({
            success: true,
            message: "Thank you for your message! I'll get back to you soon."
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`📧 Contact Service running on port ${PORT}`);
});
