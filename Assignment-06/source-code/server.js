const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.post('/api/appointments', async (req, res) => {
  try {
    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Appointment not available for this date and time. Please choose another slot.' });
    }

    const newAppointment = new Appointment({
      customerName: req.body.customerName,
      carModel: req.body.carModel,
      serviceType: req.body.serviceType,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: savedAppointment });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.get('/api/appointments/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    
    // Case-insensitive search using regex
    const appointments = await Appointment.find({
      customerName: new RegExp(name, 'i')
    }).sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search appointments' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
