/**
 * Created by guxin on 2018/09/13.
 * 初始化用户(user)模拟数据
 *
 * Created by guxin on 2018/09/13.
 */
const Users = [];
Users.push({
  id: 1,
  username: 'guxin', //用户名
  name: "孤心独饮", //姓名
  password: '123456', //密码
  email: '1980901451@qq.com', //邮箱
  nickname: '系统管理员', //昵称
  sex: 1, //性别
  addr: '江西省吉安市永丰县'
});

Users.push({
  id: 2,
  username: 'young',
  name: "青春的叹息", //姓名
  password: '123123',
  email: '1277949393@qq.com',
  nickname: '普通管理员',
  sex: 1, //性别
  addr: '江西省吉安市永丰县'
});

Users.push({
  id: 3,
  username: 'Lucy',
  name: "不知火舞", //姓名
  password: '123123',
  email: '1078548311@qq.com',
  nickname: '读者',
  sex: 0, //性别
  addr: '江苏省南京市江宁区'
});

module.exports = Users;
