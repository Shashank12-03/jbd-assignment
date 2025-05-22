const jwt = require('jsonwebtoken');
dotenv = require('dotenv');

dotenv.config();
const secret = process.env.jwt_secret_key;

const getUser = async (token) => {
    if (!token) {
        return null;
    }
    try {
        console.log(token);
        return jwt.verify(token,secret);
    } catch (error) {
        return null;
    }
};
module.exports = getUser;