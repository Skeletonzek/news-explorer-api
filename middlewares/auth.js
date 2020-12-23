const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');
const config = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.jwtDev);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
