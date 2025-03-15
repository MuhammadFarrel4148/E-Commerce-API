const bcrypt = require('bcryptjs');

const isValidEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
};

const isValidPassword = (password) => {
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regexPassword.test(password);
};

const isMatchPassword = async(password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

module.exports = { isValidEmail, isValidPassword, isMatchPassword };
