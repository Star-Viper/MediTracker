const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: {
        required: true,
        type: String,
    },
    prdName: {
        required: true,
        type: String,
    },
    qrcode: {
        required: true,
        type: String,
    },
    batchNo:{
        required: true,
        type: String,
    },
    manufactureDate:{
        required: true,
        type: Date,
        default: Date.now,
    },
    expirationDate: {
        required: true,
        type: Date,
    },
    distributor:{
        type:String,
        default:false, 
    },
    Retailer:{
        type:String,
        default:false, 
    },
    purchased:{
        type: Number,
        default:0,
    }
});
module.exports = mongoose.model('products', productSchema);