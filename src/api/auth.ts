import request from '@/utils/request'

// 登录接口：POST /api/login，传入用户名
// request 的成功响应拦截器会返回 res.data（token + 用户信息）
export function login(username: string) {
  return request.post('/login', { username })
}