const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { auth, admin } = require('../middleware/auth');

// Public Routes
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Protected Admin Routes
router.post('/', auth, admin, createCar);      // Create
router.put('/:id', auth, admin, updateCar);    // Update
router.delete('/:id', auth, admin, deleteCar); // Delete

module.exports = router;