const AV = require('../libs/av-core-min.js');

// 获取所有书籍
function fetchBooks() {
  const query = new AV.Query('book');
  return query.find();
}

module.exports = {
  fetchBooks: fetchBooks,
};