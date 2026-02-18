const Car = require('../models/Car');

// @desc    Get all cars (with Filtering)
// @access  Public
exports.getAllCars = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6; // Cars per page
        const skip = (page - 1) * limit;

        const count = await Car.countDocuments({ status: 'available' });
        const cars = await Car.find({ status: 'available' })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        res.json({
            cars,
            totalPages: Math.ceil(count / limit),
            currentPage: page
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
        res.json(car);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Car not found' });
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new car
// @access  Private (Admin only)
exports.createCar = async (req, res) => {
    try {
        // We assume req.body contains all fields including image URLs array
        const newCar = new Car(req.body);
        const car = await newCar.save();
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

        // Update fields
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
        let car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ msg: 'Car not found' });

        await Car.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Car removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};