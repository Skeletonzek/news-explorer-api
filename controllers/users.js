const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrond-data-err');
const User = require('../models/user');
const config = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.sendUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({
      data: {
        email: user.email,
        name: user.name,
      },
    }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new WrongDataError('Неверный Id'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 5)
    .then((pass) => User.create({
      email,
      password: pass,
      name,
    }))
    .then((user) => res.send({
      data: {
        email: user.email,
        name: user.name,
      },
    }))
    .catch(() => {
      next(new ConflictError('Конфликт почты'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : config.jwtDev, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
