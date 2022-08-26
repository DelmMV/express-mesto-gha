const { INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'Ошибка сервера'
        : message,
    });
  next();
};
