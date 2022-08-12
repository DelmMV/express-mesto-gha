const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ users: user }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка при получении списка пользователей.',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: `Пользователь с id: ${req.user._id} не найден.` });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Передан неверный id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка при получении данных пользователя.',
      });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(BAD_REQUEST)
      .send({
        message: 'Переданы некорректные данные для обновления информации о пользователе',
      });
  }
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные для обновления информации о пользователе',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND)
          .send({ message: `Пользователь с id: ${req.user._id} не найден.` });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Передан неверный id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка при обновлении данных пользователя.',
        });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true, runValidators: true,
    })
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные для обновления аватара пользователя',
          });
        }
        if (err.name === 'DocumentNotFoundError') {
          return res.status(NOT_FOUND).send({
            message: `Пользователь с id: ${req.user._id} не найден.`,
          });
        }
        if (err.name === 'CastError') {
          return res
            .status(BAD_REQUEST)
            .send({ message: 'Передан неверный id пользователя' });
        }
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла ошибка при обновлении аватара пользователя.',
        });
      });
  }
};
