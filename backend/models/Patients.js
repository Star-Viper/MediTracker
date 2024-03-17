const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    houseaddr: {
        type: String,
        required: true,
    },
    bloodgroup: {
        type: String,
        required: true,
    },
    allergies: {
        type: String,
        required: true,
    },
    medication: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        // unique: true,
    },
    report: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,  
    },
    permission: [{
        type: Schema.Types.ObjectId,
        ref: 'doctors',
    }],
});

const Patients = mongoose.model("Patients", patientSchema);
module.exports = Patients;
