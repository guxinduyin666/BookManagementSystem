/**
 * Created by guxin on 2018/09/13.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/api/v1/users/login', params)
  },
  //登出
  logout: params => {
    return API.GET('/api/v1/users/logout', params)
  },
  //修改个人信息
  changeProfile: params => {
    return API.PATCH('/api/v1/users/profile', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
  // 新增角色
  add: params=>{
    return API.POST('/api/v1/users/add',params)
  },
  // 修改角色信息
  put: params=>{
    return API.POST('/api/v1/users/put',params)
  },
  // 删除角色
  remove: id=>{
    return API.DELETE(`/api/v1/users/${id}`)
  }
}
