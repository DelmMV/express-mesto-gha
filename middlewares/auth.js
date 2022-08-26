const jwt = require('jsonwebtoken');
const DeniedAccessError = require('../utils/unauthorized-error');

const extractJwtToken = (header) => header.replace('jwt=', '');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new DeniedAccessError('Необходима авторизация'));
  }

  const token = extractJwtToken(cookie);

  let payload;

  try {
    payload = jwt.verify(token, 'qwerty');
  } catch (err) {
    next(new DeniedAccessError('Необходима авторизация'));
  }
  req.user = payload;

  next();
};
