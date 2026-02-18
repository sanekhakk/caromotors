const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
// Add this line below:
const { auth, admin } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Don't send passwords [cite: 168]
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

router.put('/wishlist/:carId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const carId = req.params.carId;

        if (user.wishlist.includes(carId)) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== carId);
        } else {
            // Add to wishlist
            user.wishlist.push(carId);
        }

        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
// @desc    Get current user data with populated wishlist
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Find the user and replace the wishlist IDs with full Car documents
        const user = await User.findById(req.user.id)
            .select('-password') // Don't send the password
            .populate('wishlist'); //
            
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;