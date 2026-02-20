const express = require('express');
const router  = express.Router();
const {
  getAllCars, getCarById,
  getAllCarsAdmin, getCarByIdAdmin,
  createCar, updateCar, deleteCar
} = require('../controllers/carController');
const { auth, admin } = require('../middleware/auth');

// ── Public Routes (dealer fields automatically stripped) ──────────────────────
router.get('/',    getAllCars);
router.get('/:id', getCarById);

// ── Admin Routes (full data including dealer info) ────────────────────────────
router.get('/admin/all',     auth, admin, getAllCarsAdmin);   // all statuses, dealer fields included
router.get('/admin/:id',     auth, admin, getCarByIdAdmin);  // single car with dealer fields
router.post('/',             auth, admin, createCar);
router.put('/:id',           auth, admin, updateCar);
router.delete('/:id',        auth, admin, deleteCar);

module.exports = router;