const { pool } = require('../config/db');

const createUser = async ({ name, email, passwordHash }) => {
    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [name, email, passwordHash]
    );

    return result.insertId;
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.execute(
        'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
        [email]
    );

    return rows[0] || null;
};

module.exports = {
    createUser,
    findUserByEmail
};
