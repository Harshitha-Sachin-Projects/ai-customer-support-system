const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const registerUser = async ({ name, email, password }) => {
    // 1. Check whether the email already exists
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Save the user in the database
    const userId = await userModel.createUser({
        name,
        email,
        passwordHash
    });

    return {
        id: userId,
        name,
        email,
        role: 'CUSTOMER'
    };
};

module.exports = {
    registerUser
};