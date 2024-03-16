const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    userRole:{
        type:Number,
        required: true,
    }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
