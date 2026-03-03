const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory analytics store
const analytics = {
    pageViews: {},       // { "/index.html": 150, "/about.html": 89 }
    totalVisits: 0,
    uniqueVisitors: new Set(),
    dailyViews: {},      // { "2025-03-04": 25 }
    referrers: {},       // { "google.com": 10 }
    startTime: new Date().toISOString()
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'analytics-service', timestamp: new Date().toISOString() });
});

// Record a page view
app.post('/api/analytics/pageview', (req, res) => {
    try {
        const { page, referrer, userAgent } = req.body;

        if (!page) {
            return res.status(400).json({ success: false, message: 'Page is required' });
        }

        // Track page views
        analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
        analytics.totalVisits++;

        // Track daily views
        const today = new Date().toISOString().split('T')[0];
        analytics.dailyViews[today] = (analytics.dailyViews[today] || 0) + 1;

        // Track unique visitors by IP
        const visitorIP = req.ip || req.connection.remoteAddress;
        analytics.uniqueVisitors.add(visitorIP);

        // Track referrers
        if (referrer && referrer !== '' && referrer !== 'direct') {
            try {
                const refDomain = new URL(referrer).hostname;
                analytics.referrers[refDomain] = (analytics.referrers[refDomain] || 0) + 1;
            } catch (e) {
                analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;
            }
        }

        res.json({ success: true });

    } catch (error) {
        console.error('❌ Analytics error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to record analytics' });
    }
});

// Get analytics stats
app.get('/api/analytics/stats', (req, res) => {
    // Sort pages by views (most popular first)
    const sortedPages = Object.entries(analytics.pageViews)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    // Sort referrers
    const sortedReferrers = Object.entries(analytics.referrers)
        .sort(([, a], [, b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    res.json({
        success: true,
        data: {
            totalVisits: analytics.totalVisits,
            uniqueVisitors: analytics.uniqueVisitors.size,
            pageViews: sortedPages,
            dailyViews: analytics.dailyViews,
            topReferrers: sortedReferrers,
            uptime: analytics.startTime
        }
    });
});

// Get stats for a specific page
app.get('/api/analytics/page/:pageName', (req, res) => {
    const page = '/' + req.params.pageName;
    const views = analytics.pageViews[page] || 0;

    res.json({
        success: true,
        data: { page, views }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`📊 Analytics Service running on port ${PORT}`);
});
