#!/usr/bin/env node

const http = require('http');

const checkService = (name, host, port, path) => {
    return new Promise((resolve) => {
        const options = {
            hostname: host,
            port: port,
            path: path,
            method: 'GET',
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${name} is running at localhost:${port} (Status: ${res.statusCode})`);
                    resolve(true);
                } else {
                    console.log(`\x1b[33m[WARNING]\x1b[0m ${name} responded with status code ${res.statusCode} at localhost:${port}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`\x1b[31m[FAILED]\x1b[0m ${name} is NOT running or unreachable at localhost:${port}`);
            if (e.code === 'ECONNREFUSED') {
                console.log(`          -> Connection refused. Did you start the service?`);
            } else {
                console.log(`          -> Error: ${e.message}`);
            }
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`\x1b[31m[FAILED]\x1b[0m ${name} connection timed out at localhost:${port}`);
            resolve(false);
        });

        req.end();
    });
};

async function runHealthChecks() {
    console.log('\n=============================================');
    console.log('    Microservices Health Check Tool');
    console.log('=============================================\n');
    console.log('Checking services...\n');

    // Nginx Gateway Check (needs Docker or local Nginx)
    await checkService('API Gateway / Frontend', 'localhost', 80, '/');

    // Projects Service
    await checkService('Projects Service', 'localhost', 3001, '/health');
    await checkService('Projects Service API Data', 'localhost', 3001, '/api/projects');

    // Contact Service
    await checkService('Contact Service', 'localhost', 3002, '/health');

    console.log('\n=============================================');
    console.log('How to run the services:');
    console.log('1. If using Docker:');
    console.log('   docker compose up -d --build');
    console.log('\n2. If running locally WITHOUT Docker:');
    console.log('   Terminal 1: cd projects-service && npm install && node index.js');
    console.log('   Terminal 2: cd contact-service && npm install && node index.js');
    console.log('   Terminal 3: Use LiveServer or any HTTP server inside the "frontend" folder.');
    console.log('   (Note: without Docker, Nginx proxying will not be available natively)');
    console.log('=============================================\n');
}

runHealthChecks();
