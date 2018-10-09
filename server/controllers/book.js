/**
 * books 控制器
 * Created by guxin on 2018/09/12.
 */
const Mock = require('mockjs');
const Books = require('../data/book');
const Users = require('../data/user');
let bookController = {};
let _Books = Books;
let _Users = Users;

/**
 * 通过书名查询，获取图书列表
 * @param req
 * @param res
 */
bookController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || ''; //图书名称
  let total = 0;
  let rltBooks = [];
  if (name.length > 0) {
    let mockBooks = _Books.filter(book => {
      return book.name.indexOf(name) > -1;
    });
    total = mockBooks.length; //总条数
    rltBooks = mockBooks.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  } else {
    total = _Books.length; //总条数
    rltBooks = _Books.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  }
  res.json({
    total: total,
    limit: limit,
    books: rltBooks
  })
};

/**
 * 通过id获取某一条图书新
 * @param req
 * @param res
 */
bookController.findById = function (req, res) {
  let id = _.trim(req.params.id || '');
  if (!id) {
    return res.json({
      "errcode": 40002,
      "errmsg": "不合法的参数"
    });
  }
  let book = _.find(_Books, function (b) {
    return b.id === id;
  });
  res.json(book || null)
};

/**
 * 添加一条图书信息
 * @param req
 * @param res
 */
bookController.create = function (req, res) {
  let name = req.body.name;
  let author = req.body.author;
  let description = req.body.description;
  let publishAt = req.body.publishAt;
  _Books.push({
    id: Mock.Random.guid(),
    name: name,
    author: author,
    description: description,
    publishAt: publishAt
  });
  res.json({
    "errcode": 0,
    "errmsg": "新增成功"
  })
};

/***
 * 更新一条图书记录
 * @param req
 * @param res
 */
bookController.update = function (req, res) {
  let id = _.trim(req.params.id || '');
  if (!id) {
    return res.json({
      "errcode": 40002,
      "errmsg": "不合法的参数"
    });
  }
  let name = req.body.name;
  let author = req.body.author;
  let description = req.body.description;
  let publishAt = req.body.publishAt;

  let i = _.findIndex(_Books, function (u) {
    return u.id === id
  })
  if (i > -1) {
    _Books[i].name = name;
    _Books[i].author = author;
    _Books[i].description = description;
    _Books[i].publishAt = publishAt;
    res.json({
      "errcode": 0,
      "errmsg": "修改成功"
    });
  } else {
    res.json({
      "errcode": 40009,
      "errmsg": "处理失败"
    });
  }
};

/**
 * 更新一条图书记录的部分信息
 * @param req
 * @param res
 */
bookController.patch = function (req, res) {

};

/**
 * 批量删除
 * @param req
 * @param res
 */
bookController.deleteBatch = function (req, res) {
  let ids = req.params.ids;
  ids = ids.split(',');
  _Books = _Books.filter(b => !ids.includes(b.id))
  res.json({
    "errcode": 0,
    "errmsg": "删除成功"
  });
};

/**
 * 单条删除
 * @param req
 * @param res
 */
bookController.delete = function (req, res) {
  let id = _.trim(req.params.id || '');
  if (!id) {
    return res.json({
      "errcode": 40002,
      "errmsg": "不合法的参数"
    });
  }
  let i = _.findIndex(_Books, function (u) {
    return u.id === id
  })
  if (i > -1) {
    _Books.splice(i, 1);
    res.json({
      "errcode": 0,
      "errmsg": "修改成功"
    });
  } else {
    res.json({
      "errcode": 40009,
      "errmsg": "处理失败"
    });
  }
};
/**
 * 借书
 * @param req
 * @param res
 */
bookController.lend = function (req, res) {
  let username = req.body.username;
  let book = req.body.book;
  let user = null;
  let today=new Date();
  let returnDate=new Date(today);
  returnDate=new Date(returnDate.setDate(today.getDate()+30));
  returnDate=returnDate.getFullYear()+'-'+(returnDate.getMonth()+1)+'-'+returnDate.getDate();
  book.returnDate=returnDate;
  // 根据username查询出借书的user
  _Users.forEach(function (item, index) {
    if (item.username == username) {
      user = _Users[index];
    }
  })
  // 根据bookID查找所借书籍,将其标记为已借
  _Books.forEach(function(item,index){
    if(item.id==book.id){
      item.isLended=true;
    }
  })
  if (user === null) {
    res.json({
      "errcode": 40009,
      "errmsg": "不存在的用户"
    })
  } else {
    user.books.push(book);
    res.json({
      "errcode": 0,
      "errmsg": "借书成功"
    })
  }
  console.log(user);
};
/**
 * 查询已借书籍
 * @param req
 * @param res
 */
bookController.queryLendBooks = function (req, res) {
  let username = req.body.username;
  let user=null;
  // 根据username查询出借书的user
  _Users.forEach(function (item, index) {
    if (item.username == username) {
      user = _Users[index];
    }
  })
  res.json({
	  stateCode:0,
	  books:user.books
  })
}
/**
 * 还书
 * @param req
 * @param res
 */
bookController.returnBook = function (req, res) {
  let username = req.body.username;
  let bookId=req.body.book.id;
  let user=null;
  console.log(req.body);
  // 根据username查询出借书的user
  _Users.forEach(function (item, index) {
    if (item.username == username) {
      user = _Users[index];
    }
  })
  console.log(user);
  // 根据id查找需要还书的书籍，并将其从已借阅书籍中删除
  user.books.forEach(function(item,index){
    if(item.id==bookId){
      user.books.splice(index,1);
    }
  })
  // 在图书列表中将已借标记删除
  _Books.forEach(function(item,index){
    if(item.id==bookId){
      item.isLended=false;
    }
  })
  res.json({
	  stateCode:0,
	  books:user.books
  })
  console.log(user.books);
}
/**
 * 续借
 * @param req
 * @param res
 */
bookController.renew = function (req, res) {
  let username = req.body.username;
  let bookId=req.body.book.id;
  let user=null;
  let returnDate;
  console.log(req.body);
  // 根据username查询出借书的user
  _Users.forEach(function (item, index) {
    if (item.username == username) {
      user = _Users[index];
    }
  })
  console.log(user);
  // 根据id查找需要还书的书籍，并修改其应还日期
  user.books.forEach(function(item,index){
    if(item.id==bookId){
      returnDate=new Date(item.returnDate);
      returnDate=new Date(returnDate.setDate(returnDate.getDate()+30));
      returnDate=returnDate.getFullYear()+'-'+(returnDate.getMonth()+1)+'-'+returnDate.getDate();
      item.returnDate=returnDate;
    }
  })
  res.json({
	  stateCode:0,
	  books:user.books
  })
  console.log(user.books);
}

module.exports = bookController;
