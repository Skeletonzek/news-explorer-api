require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRouter = require('./routes/users.js');
const articleRouter = require('./routes/articles.js');
const { login, createUser } = require('./controllers/users.js');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error.js');
const NotFoundError = require('./errors/not-found-err.js');
const rateLimiterMiddleware = require('./middlewares/rateLimiterMongo');

const { PORT = 3000, MONGO_DB } = process.env;
const app = express();

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

app.use(rateLimiterMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(cors());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().max(200).email().required(),
    password: Joi.string().required().min(2).max(200),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().max(200).email().required(),
    password: Joi.string().required().min(2).max(200),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use('/', auth);

app.use('/', userRouter);
app.use('/', articleRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
