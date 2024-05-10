const path = require('path');
const os = require('os');
const express = require('express');
const axios = require('axios');
const app = express();

const SWAPI_BASE_URL = 'https://swapi.dev/api';


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to fetch Star Wars characters
app.get('/characters', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    async function fetchCharacters(url) {
        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.results) {
                res.write(`data: ${JSON.stringify(data.results)}\n\n`);
            }
            if (data.next) {
                await fetchCharacters(data.next);
            }
            res.end();
        } catch (error) {
            console.error('API request failed:', error);
            res.write('data: {"error": "API request failed"}\n\n');
            res.end();
        }
    }

    fetchCharacters(`${SWAPI_BASE_URL}/people`);
});


// Endpoint to fetch a specific Star Wars character
app.get('/character', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Missing character ID' });
    }

    try {
        const response = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);
        const character = response.data;
        res.json(character);
    } catch (error) {
        console.error('Error fetching character details:', error.message);
        res.status(500).json({ error: 'Failed to fetch character details' });
    }
});


app.get('/version', (req, res) => {
    res.json({ version: '1.0.0', containerId: os.hostname() });
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

