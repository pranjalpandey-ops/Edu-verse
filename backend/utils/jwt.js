const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'eduverse_secret_jwt_hackathon_2026_key';

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '30d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken, JWT_SECRET };
