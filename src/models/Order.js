const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: 'User',
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('orders', OrderSchema);
