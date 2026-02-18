const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Create new booking (After payment success)
// @access  Private (User)
exports.createBooking = async (req, res) => {
    try {
        const { carId, tokenAmount, paymentId } = req.body;

        // 1. Check if car is already booked
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ msg: 'Car not found' });
        }
        if (car.status !== 'available') {
            return res.status(400).json({ msg: 'Car is already booked or sold' });
        }

        // 2. Create Booking
        const booking = new Booking({
            user: req.user.id, // From auth middleware
            car: carId,
            tokenAmount,
            paymentId,
            status: 'Token Paid'
        });

        await booking.save();

        // 3. Update Car Status to 'booked'
        car.status = 'booked';
        await car.save();

        res.status(201).json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get logged in user's bookings
// @access  Private (User)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('car', 'title brand price images') // Join with Car data
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all bookings (Admin)
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email') // Join with User data
            .populate('car', 'title brand price') // Join with Car data
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update booking status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'Deal Closed', 'Refunded'
        
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        // If booking is cancelled/refunded, make car available again
        if (status === 'Cancelled' || status === 'Refunded') {
            await Car.findByIdAndUpdate(booking.car, { status: 'available' });
        } 
        // If deal is closed, mark car as sold
        else if (status === 'Deal Closed') {
            await Car.findByIdAndUpdate(booking.car, { status: 'sold' });
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};