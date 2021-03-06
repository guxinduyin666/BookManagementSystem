/**
 * users 控制器
 *
 * Created by guxin on 2018/09/12.
 */
const Users = require('../data/user');
let userController = {};
let _Users = Users;

/**
 * 检查用户的登录状态
 * @param req
 * @param res
 * @param next
 */
userController.checkLogin = function (req, res, next) {
  //用户已经登录
  if (req.session.userId) {
    next();
  } else {
    res.json({
      "stateCode": 40001,
      "stateMsg": "您还没有登录"
    });
  }
};

/**
 * 登录
 * @param req
 * @param res
 */
userController.login = function (req, res) {
  let username = _.trim(req.query.username || req.body.username || '');
  let pwd = req.body.pwd;
  if (!username || !pwd) {
    return res.json({
      "stateCode": 40002,
      "stateMsg": "不合法的参数"
    });
  }

  // 通过用户名获取到用户信息
  let user = _.find(_Users, function (u) {
    return u.username === username;
  });
  console.log('---_Users----');
  if (!user) {
    return res.json({
      "stateCode": 40003,
      "stateMsg": "用户不存在"
    });
  }
  if (user.password === pwd) {
    //设置session
    req.session.userId = user.id;

    return res.json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      name: user.name,
      email: user.email
    });
  } else {
    return res.json({
      "stateCode": 40004,
      "stateMsg": "密码错误"
    });
  }
};

/**
 * 退出登录
 * @param req
 * @param res
 */
userController.logout = function (req, res) {
  req.session.destroy();
  res.json({
    "stateCode": 0,
    "stateMsg": "退出完成"
  });
};

/**
 * 修改个人部分信息
 * @param req
 * @param res
 */
userController.profile = function (req, res) {
  let nickname = req.body.nickname;
  let email = req.body.email;
  let name = req.body.name;
  let i = _.findIndex(_Users, function (u) {
    return u.id === req.session.userId
  })
  if (i > -1) {
    _Users[i].nickname = nickname;
    _Users[i].email = email;
    _Users[i].name = name;
    res.json({
      "stateCode": 0,
      "stateMsg": "修改成功"
    });
  } else {
    res.json({
      "stateCode": 40009,
      "stateMsg": "处理失败"
    });
  }
};

/**
 * 修改密码
 * @param req
 * @param res
 */
userController.changepwd = function (req, res) {
  //TODO 未开发
};
/**
 * 添加角色
 * @param req
 * @param res
 */
userController.add = function (req, res) {
  let name = req.body.name;
  let userName = req.body.userName;
  let password = req.body.password;
  let role = req.body.role;
  let gender = req.body.gender;
  let email = req.body.email;
  let address = req.body.address;
  let flag = false;
  _Users.some(function (item, index) {
    if (userName == item.username) {
      flag = true;
      return true;
    }
  })
  if (flag) {
    return res.json({
      stateCode: 100,
      stateMsg: '重复的用户名'
    })
  }
  console.log('即将新增');
  _Users.push({
    id: _Users.length + 1,
    username: userName,
    name: name,
    password: password,
    email: email,
    nickname: role,
    sex: gender, //性别
    addr: address
  })
  res.json({
    "stateCode": 0,
    "stateMsg": "新增成功"
  })
};
/**
 * 修改角色信息
 * @param req
 * @param res
 */
userController.put = function (req, res) {
  let name = req.body.name;
  let userName = req.body.userName;
  let password = req.body.password;
  let role = req.body.role;
  let gender = req.body.gender;
  let email = req.body.email;
  let address = req.body.address;
  let id = req.body.id;
  let flag=false;
  _Users.some(function (item, index) {
    if (userName == item.username) {
      flag = true;
      return true;
    }
  })
  if (flag) {
    return res.json({
      stateCode: 100,
      stateMsg: '重复的用户名'
    })
  }
  _Users.forEach(function (item, index) {
    if (item.id == id) {
      _Users[index] = {
        id: id,
        username: userName,
        name: name,
        password: password,
        email: email,
        nickname: role,
        sex: gender, //性别
        addr: address
      }
    }
  })
  res.json({
    "stateCode": 0,
    "stateMsg": "修改成功"
  })
};
/**
 * 删除角色
 * @param req
 * @param res
 */
userController.remove = function (req, res) {
  let id = req.params.id;
  _Users.forEach(function (item, index) {
    if (item.id == id) {
      _Users.splice(index, 1);
    }
  })
  res.json({
    "stateCode": 0,
    "stateMsg": "删除成功"
  })
};

/**
 * 通过关键字查询，获取角色列表
 * @param req
 * @param res
 */
userController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || '';
  let total = 0;
  let rltUsers = [];
  if (name.length > 0) {
    let mockUsers = _Users.filter(user => {
      return (user.username.indexOf(name) > -1 || user.nickname.indexOf(name) > -1 || user.name.indexOf(name) > -1)
    });
    total = mockUsers.length; //总条数
    rltUsers = mockUsers.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  } else {
    total = _Users.length; //总条数
    rltUsers = _Users.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  }
  res.json({
    total: total,
    limit: limit,
    users: rltUsers
  })
};

module.exports = userController;
