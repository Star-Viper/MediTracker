const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    address_doctor: {
        type: String,
        required: true,
    },
    address_patient: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    prescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'completed'],
    },
    major: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Appointments = mongoose.model("Appointments", appointmentSchema);
module.exports = Appointments;
