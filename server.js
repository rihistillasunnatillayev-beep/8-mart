const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Greetings file path
const greetingsFile = path.join(__dirname, 'greetings.json');

// Initialize greetings file if it doesn't exist
if (!fs.existsSync(greetingsFile)) {
    fs.writeFileSync(greetingsFile, JSON.stringify([], null, 2));
}

// Get all greetings
app.get('/api/greetings', (req, res) => {
    try {
        const greetings = JSON.parse(fs.readFileSync(greetingsFile, 'utf8'));
        res.json(greetings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read greetings' });
    }
});

// Save a new greeting
app.post('/api/greetings', (req, res) => {
    try {
        const { name, message } = req.body;
        
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }

        const greetings = JSON.parse(fs.readFileSync(greetingsFile, 'utf8'));
        
        const newGreeting = {
            id: Date.now(),
            name: name.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString()
        };

        greetings.unshift(newGreeting);
        
        // Keep only last 50 greetings
        if (greetings.length > 50) {
            greetings.splice(50);
        }

        fs.writeFileSync(greetingsFile, JSON.stringify(greetings, null, 2));
        
        res.json({ success: true, greeting: newGreeting });
    } catch (error) {
        console.error('Error saving greeting:', error);
        res.status(500).json({ error: 'Failed to save greeting' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Greetings will be saved to: ${greetingsFile}`);
});
