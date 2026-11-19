const bcrypt = require('bcrypt');
const userModel = require('../models/user.models');

const registerUser = async ({ name, email, password }) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Check first for a friendly duplicate-email response.
    const existingUser = await userModel.findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const userId = await userModel.createUser({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash
        });

        return {
            id: userId,
            name: normalizedName,
            email: normalizedEmail,
            role: 'CUSTOMER'
        };
    } catch (error) {
        // The database unique constraint is the final protection against
        // two concurrent registration requests using the same email.
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }

        throw error;
    }
};

module.exports = {
    registerUser
};
