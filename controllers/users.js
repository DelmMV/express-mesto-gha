const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATE } = require('../utils/errors');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error')
const BadRequestError = require('../utils/bad-request-error');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password
  } = req.body;
  User.findOne({ email })
    .then((userFinded) => {
      if (userFinded) {
        throw new ConflictError('Пользователь уже зарегестрирован');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          res.status(CREATE)
            .send({
              data: {
                email: user.email,
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                _id: user._id,
              },
            });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Переданы некорректные данные');
          }
          if (err.code === 11000) {
            throw new ConflictError('Пользователь уже зарегестрирован');
          }
          next(err);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id пользователя');
      }
      next(err);
    }).catch(next);
};

// module.exports.updateUserProfile = (req, res, next) => {
//   const {
//     name,
//     about
//   } = req.body;
//   if (!name || !about) {
//     return res.status(BAD_REQUEST)
//       .send({
//         message: 'Переданы некорректные данные для обновления информации о пользователе',
//       });
//   }
//   return User.findByIdAndUpdate(req.user._id, {
//     name,
//     about
//   }, {
//     new: true,
//     runValidators: true,
//   })
//     .orFail()
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(BAD_REQUEST)
//           .send({
//             message: 'Переданы некорректные данные для обновления информации о пользователе',
//           });
//       }
//       if (err.name === 'DocumentNotFoundError') {
//         return res
//           .status(NOT_FOUND)
//           .send({ message: `Пользователь с id: ${req.user._id} не найден.` });
//       }
//       if (err.name === 'CastError') {
//         return res
//           .status(BAD_REQUEST)
//           .send({ message: 'Передан неверный id пользователя' });
//       }
//       return res.status(INTERNAL_SERVER_ERROR)
//         .send({
//           message: 'Ошибка при обновлении данных пользователя.',
//         });
//     });
// };
// module.exports.updateUserAvatar = (req, res) => {
//   const { avatar } = req.body;
//   if (!avatar) {
//     res.status(BAD_REQUEST)
//       .send({
//         message: 'Переданы некорректные данные для обновления аватара пользователя',
//       });
//     return;
//   }
//   User.findByIdAndUpdate(req.user._id, { avatar }, {
//     new: true,
//     runValidators: true,
//   })
//     .orFail()
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(BAD_REQUEST)
//           .send({
//             message: 'Переданы некорректные данные для обновления аватара пользователя',
//           });
//       }
//       if (err.name === 'DocumentNotFoundError') {
//         return res.status(NOT_FOUND)
//           .send({
//             message: `Пользователь с id: ${req.user._id} не найден.`,
//           });
//       }
//       if (err.name === 'CastError') {
//         return res
//           .status(BAD_REQUEST)
//           .send({ message: 'Передан неверный id пользователя' });
//       }
//       return res.status(INTERNAL_SERVER_ERROR)
//         .send({
//           message: 'Произошла ошибка при обновлении аватара пользователя.',
//         });
//     });
// };

module.exports.login = (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  User.findUserByCredintials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'qwerty', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({
          data: {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          },
        })
        .end();
    })
    .catch(next);
};
