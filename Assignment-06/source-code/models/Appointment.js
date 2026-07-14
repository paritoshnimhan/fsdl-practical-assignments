const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
