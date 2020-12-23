const userRouter = require('express').Router();
const { sendUser } = require('../controllers/users');

userRouter.get('/users/me', sendUser);

module.exports = userRouter;
