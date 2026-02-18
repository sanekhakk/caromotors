const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    updateBookingStatus 
} = require('../controllers/bookingController');
const { auth, admin } = require('../middleware/auth');

// User Routes
router.post('/', auth, createBooking);      // Pay token & book
router.get('/my', auth, getMyBookings);     // View my history

// Admin Routes
router.get('/', auth, admin, getAllBookings);         // View all
router.put('/:id', auth, admin, updateBookingStatus); // Update status

module.exports = router;