// This file contains utility functions that can be reused throughout the application.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to hash passwords
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Function to compare passwords
const comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Function to generate JWT tokens
const generateToken = (user) => {
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    return token;
};

// Function to validate email format
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Exporting utility functions
module.exports = {
    hashPassword,
    comparePasswords,
    generateToken,
    validateEmail,
};