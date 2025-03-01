const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        'https://42-ametus.github.io',
        'http://localhost:3000',
        'https://catbuslogi.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Route to proxy requests to Janice API
app.post('/api/calculate', async (req, res) => {
    try {
        const response = await fetch('https://janice.e-351.com/api/rest/v2/appraisal?market=2&designation=appraisal&pricing=sell&pricingVariant=immediate&persist=false&compactize=true&pricePercentage=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'accept': 'application/json',
                'X-ApiKey': `${process.env.REACT_APP_JANICE_API_KEY}`
              },
            body: req.body.data
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});