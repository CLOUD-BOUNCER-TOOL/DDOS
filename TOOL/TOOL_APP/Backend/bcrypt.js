const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 8);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const checkPassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password, encryptedPassword);
}

module.exports = { encryptPassword, checkPassword }