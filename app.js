require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users.js');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error.js');
const NotFoundError = require('./errors/not-found-err.js');
const rateLimiterMiddleware = require('./middlewares/rateLimiterMongo');
const config = require('./utils/config');
const indexRouter = require('./routes/index.js');

const { PORT = 3000, NODE_ENV, MONGO_DB } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : config.mongoDev, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
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
    // eslint-disable-next-line no-useless-escape
    password: Joi.string().pattern(/^[\wа-яёА-ЯЁ\!\@\#\$\%\^\&\*\(\)\-\_\+\=\;\:\,\.\/\?\\\|\`\~\[\]\{\}]{4,18}$/).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().max(200).email().required(),
    // eslint-disable-next-line no-useless-escape
    password: Joi.string().pattern(/^[\wа-яёА-ЯЁ\!\@\#\$\%\^\&\*\(\)\-\_\+\=\;\:\,\.\/\?\\\|\`\~\[\]\{\}]{4,18}$/).required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use('/', auth);

app.use('/', indexRouter);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
