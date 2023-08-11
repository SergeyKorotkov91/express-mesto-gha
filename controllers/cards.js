const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundErrors');
const ForbiddenError = require('../errors/forbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.toString() === id) {
        Card.deleteOne(card)
          .then((data) => {
            res.send({ data, message: 'Удалено' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить карточку');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет карточки с таким id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Нет карточки с таким id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
