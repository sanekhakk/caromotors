const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "2018 Honda City" [cite: 173]
    brand: { type: String, required: true }, // Filterable field [cite: 174]
    model: { type: String, required: true }, // e.g., "City ZX" [cite: 70]
    price: { type: Number, required: true }, // Filterable field [cite: 175]
    year: { type: Number, required: true },  // [cite: 176]
    fuelType: { type: String, required: true }, // Petrol/Diesel/CNG [cite: 178]
    kmDriven: { type: Number, required: true }, // [cite: 179]
    location: { type: String, required: true }, // [cite: 180]
    description: { type: String, required: true }, // Detailed info [cite: 181]
    
    images: [{
        type: String, // URLs to images stored in cloud/folder [cite: 182]
        required: true
    }],
    
    tokenAmount: { 
        type: Number, 
        required: true, 
        default: 5000 // Admin sets this, but good to have a default [cite: 91, 183]
    },
    
    status: {
        type: String,
        enum: ['available', 'booked', 'sold'], // Tracks inventory state [cite: 184]
        default: 'available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);