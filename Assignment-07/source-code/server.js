const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fsdl_a7';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static elements from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up MongoDB Mongoose Connection
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB database');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Import Feedback Model
const Feedback = require('./models/Feedback');

// API Routes
app.post('/api/feedbacks', async (req, res) => {
    try {
        const { name, course, rating, feedback } = req.body;
        if (!name || !course || !rating || !feedback) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newFeedback = new Feedback({ name, course, rating, feedback });
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create feedback', details: error.message });
    }
});

app.get('/api/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedbacks', details: error.message });
    }
});

app.put('/api/feedbacks/:id', async (req, res) => {
    try {
        const { name, course, rating, feedback } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { name, course, rating, feedback },
            { new: true, runValidators: true }
        );
        if (!updatedFeedback) return res.status(404).json({ error: 'Feedback not found' });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update feedback', details: error.message });
    }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) return res.status(404).json({ error: 'Feedback not found' });
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete feedback', details: error.message });
    }
});

// Fallback all routes to index.html to allow client side routing if necessary
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
