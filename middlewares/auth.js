const jwt = require('jsonwebtoken');
const AuthError = require('../erorrs/authError');

const JWT_SECRET = 'strong-secret-key';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Требуется авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Требуется авторизация');
  }

  req.user = payload;

  next();
};

module.exports = auth;
