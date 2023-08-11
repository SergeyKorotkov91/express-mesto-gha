const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  returnUsers,
  returnUserById,
  updateProfile,
  updateAvatar,
  getUser,
} = require('../controllers/users');

const regularExpression = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+\.[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/;

router.get('/', returnUsers);

router.get('/me', getUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), returnUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regularExpression),
  }),
}), updateAvatar);

module.exports = router;
