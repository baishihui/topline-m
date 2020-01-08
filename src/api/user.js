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
