const userService = require('../services/user.service');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const normalizedEmail = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        const user = await userService.registerUser({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        console.error('Registration error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    register
};
