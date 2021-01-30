const AccessDeniedError = require('../errors/access-denied-err');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrond-data-err');
const Article = require('../models/article');

module.exports.sendArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Статьи не найдены');
    })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({
      data: {
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      },
    }))
    .catch(() => {
      next(new WrongDataError('Переданы некорректные данные'));
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => {
      throw new NotFoundError('Статья не найдена');
    })
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => res.send({
            data: {
              keyword: article.keyword,
              title: article.title,
              text: article.text,
              date: article.date,
              source: article.source,
              link: article.link,
              image: article.image,
            },
          }));
      } else {
        throw new AccessDeniedError('Ошибка доступа', 'invalid');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new WrongDataError('Неверный Id'));
      }
      next(err);
    });
};
