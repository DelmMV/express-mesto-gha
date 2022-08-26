const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.post('/', celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
  },
}), createCard);
cardRouter.get('/', getCard);
cardRouter.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().alphanum().length(24).hex(),
  },
}), dislikeCard);
module.exports = cardRouter;
