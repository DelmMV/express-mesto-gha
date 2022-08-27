const Card = require('../models/card');
const { CREATE } = require('../utils/errors');
const ForbiddenError = require('../utils/forbidden-error');
const NotFoundError = require('../utils/not-found-error');
const BadRequestError = require('../utils/bad-request-error');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    });
};

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card) {
      if (card.owner._id.valueOf() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardRemoved) => {
            res.send({ data: cardRemoved });
          });
      } else {
        throw new ForbiddenError('Отказано в доступе');
      }
    } else {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Передан некорректный id карточки');
    }
    next(err);
  });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id карточки');
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id карточки');
      }
      next(err);
    });
};
