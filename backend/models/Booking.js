const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // [cite: 187]
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true // [cite: 188]
    },
    tokenAmount: {
        type: Number,
        required: true // [cite: 189]
    },
    paymentId: {
        type: String, 
        required: true // From Stripe/Razorpay [cite: 191]
    },
    status: {
        type: String,
        enum: ['Pending', 'Token Paid', 'In Discussion', 'Deal Closed', 'Cancelled', 'Refunded'],
        default: 'Token Paid' // Initial state after payment [cite: 97, 119]
    }
}, { timestamps: true }); // Automatically adds createdAt [cite: 193]

module.exports = mongoose.model('Booking', bookingSchema);