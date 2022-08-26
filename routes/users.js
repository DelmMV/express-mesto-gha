const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getMe,
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', celebrate({
  params: {
    userId: Joi.string()
      .alphanum()
      .length(24)
      .hex(),
  },
}), getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
}), updateUserProfile);
userRouter.patch('/me/avatar', celebrate({
  body: {
    avatar: Joi.string()
      .required()
      .regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
  },
}), updateUserAvatar);

module.exports = userRouter;
