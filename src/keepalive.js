require('dotenv').config();
const express = require('express');

function keepAlive() {
    const app = express();
    const PORT = process.env.PORT || 8080;

    app.get('/', (req, res) => {
        res.send('Le bot Discord fonctionne correctement !');
    });

    app.get('/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });

    const server = app.listen(PORT, () => {
        console.log(`Keepalive actif sur le port ${PORT}`);
    });

    return server;
}

module.exports = keepAlive;
