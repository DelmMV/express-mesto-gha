const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../utils/unauthorized-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      validate: {
        validator: isEmail,
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByData = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверный email или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
