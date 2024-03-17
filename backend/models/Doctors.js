const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    license: {
        type: Number,
        required: true,
    },
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
    qualification: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'patients'
    }]
});

const Doctors = mongoose.model("Doctors", doctorSchema);
module.exports = Doctors;
