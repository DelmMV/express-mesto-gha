const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/unauthorized-error');

const extractJwtToken = (header) => header.replace('jwt=', '');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractJwtToken(cookie);

  let payload;

  try {
    payload = jwt.verify(token, 'qwerty');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;

  next();
};
