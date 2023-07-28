const User = require('../models/users');
const NotFound = require('../errors/notFoundErrors');
const STATUS_CODE = require('../errors/errorCodes');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CODE.successCreate).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь с таким _id не найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Запрашиваемый пользователь не найден.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send({ data: users });
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({
        message: 'Произошла ошибка на сервере.',
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь с указанным _id не найден.',
        });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при обновлении аватара. ',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
};
