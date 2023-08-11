const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundErrors');

const regularExpression = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+\.[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/;

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regularExpression),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', () => {
  throw new NotFoundError('Неверный путь');
});
module.exports = router;
