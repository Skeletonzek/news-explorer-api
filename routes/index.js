const indexRouter = require('express').Router();
const userRouter = require('./users');
const articleRouter = require('./articles');

indexRouter.use('/', userRouter);
indexRouter.use('/', articleRouter);

module.exports = indexRouter;
