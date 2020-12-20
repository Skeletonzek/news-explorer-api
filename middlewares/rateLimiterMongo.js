const mongoose = require('mongoose');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const RequestsError = require('../errors/requests-err');

const { MONGO_DB } = process.env;

const mongoOpts = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 100, // Reconnect every 100ms
};

const mongoConn = mongoose.createConnection(MONGO_DB, mongoOpts);

const rateLimiter = new RateLimiterMongo({
  storeClient: mongoConn,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      next(new RequestsError('Слишком много запросов'));
    });
};

module.exports = rateLimiterMiddleware;
