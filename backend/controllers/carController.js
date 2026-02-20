const Car = require('../models/Car');

// Fields that are admin-only and must never be sent to the public frontend
const ADMIN_ONLY_FIELDS = ['dealerId', 'dealerName', 'dealerPhone', 'dealerPlace'];

/**
 * Strip dealer fields from a car document before sending to public.
 * Accepts a Mongoose doc or plain object.
 */
const toPublic = (car) => {
  const obj = car.toObject ? car.toObject() : { ...car };
  ADMIN_ONLY_FIELDS.forEach(f => delete obj[f]);
  return obj;
};

// @desc    Get all cars (with filtering + pagination)
// @access  Public
exports.getAllCars = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip  = (page - 1) * limit;

    const query = { status: 'available' };
    if (req.query.brand)    query.brand = req.query.brand;
    if (req.query.maxPrice) query.price = { $lte: Number(req.query.maxPrice) };

    const count = await Car.countDocuments(query);
    const cars  = await Car.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.json({
      cars: cars.map(toPublic),
      totalPages:  Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get single car by ID
// @access  Public
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    res.json(toPublic(car));
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Car not found' });
    res.status(500).send('Server Error');
  }
};

// @desc    Get single car by ID — full data including dealer (admin only)
// @access  Private (Admin)
exports.getCarByIdAdmin = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    res.json(car); // Full document — dealer fields included
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Car not found' });
    res.status(500).send('Server Error');
  }
};

// @desc    Get ALL cars for admin inventory (no pagination, all statuses, dealer included)
// @access  Private (Admin)
exports.getAllCarsAdmin = async (req, res) => {
  try {
    const cars = await Car.find({}).sort({ createdAt: -1 });
    res.json({ cars }); // Full documents — dealer fields included
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new car
// @access  Private (Admin only)
exports.createCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const car    = await newCar.save();
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update car details
// @access  Private (Admin only)
exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    car = await Car.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete car
// @access  Private (Admin only)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    await Car.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Car removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};