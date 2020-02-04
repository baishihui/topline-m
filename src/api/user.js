// 用户请求相关模块
import request from '@/utils/request'

// 登录请求
export const login = data => {
  // 具体的请求代码
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data // Body 请求体参数
  })
}

// 发送验证码
export const getSmsCode = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 获取指定用户信息
export const getUserById = userId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}`
  })
}

// 关注用户
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }

  })
}

// 取消关注用户
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
