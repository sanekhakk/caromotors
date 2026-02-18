const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { auth } = require('../middleware/auth');

// Initialize Razorpay with your Keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/order
// @desc    Create a Razorpay Order
router.post('/order', auth, async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    const options = {
      amount: amount * 100, // Razorpay works in Paisa (100 Paisa = 1 INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;