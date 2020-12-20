const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(w{3}\.)?(\w+[\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*)+#?$/.test(v);
      },
      message: 'Неверная ссылка',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(w{3}\.)?(\w+[\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*)+#?$/.test(v);
      },
      message: 'Неверная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    select: false,
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
