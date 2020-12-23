const { celebrate, Joi } = require('celebrate');
const articleRouter = require('express').Router();
const {
  sendArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/article');

articleRouter.get('/articles', sendArticles);
articleRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(/^https?:\/\/(w{3}\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*)\/?$/).required(),
    // eslint-disable-next-line no-useless-escape
    image: Joi.string().pattern(/^https?:\/\/(w{3}\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*)\/?$/).required(),

  }),
}), createArticle);
articleRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), deleteArticle);

module.exports = articleRouter;
