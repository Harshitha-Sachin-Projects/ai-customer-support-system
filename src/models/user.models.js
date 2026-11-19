const db = require('../config/db');

const createUser = async ({ name, email, passwordHash }) => {
    const [result] = await db.execute(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [name, email, passwordHash]
    );

    return result.insertId;
};

const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
    );

    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};