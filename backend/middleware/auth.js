const jwt = require('jsonwebtoken');

// 1. Verify Token (Authentication)
exports.auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add user payload to request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// 2. Verify Admin Role (Authorization)
exports.admin = (req, res, next) => {
    // Requires 'auth' middleware to run first
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
};