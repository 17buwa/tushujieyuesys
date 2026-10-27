import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// ===== 创建 axios 实例 =====
// baseURL = /api：之后请求写路径即可，如 /books 自动拼成 /api/books
// 正好对上 MSW mock 的接口（/api/login、/api/books 等）
const request = axios.create({
  baseURL: '/api',
  timeout: 10000, // 请求超时 10s
})

// ===== 请求拦截器：每次发请求前执行 =====
request.interceptors.request.use((config) => {
  // 从 user store 读取登录 token
  const userStore = useUserStore()
  if (userStore.token) {
    // 把 token 放进 Authorization 请求头，后端靠它鉴权
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// ===== 响应拦截器：每次收到响应时执行 =====
request.interceptors.response.use(
  // 成功时：按业务 code 处理
  (response) => {
    const res = response.data
    // 业务 code 为 200 → 直接返回 data 给调用方
    if (res && res.code === 200) {
      return res.data
    }
    // code 2000 表示未登录/登录过期
    if (res.code === 2000) {
      const userStore = useUserStore()
      userStore.logout()          // 清空登录态 + 持久化
      router.push('/login')       // 跳回登录页
      return Promise.reject(new Error('未登录或登录已过期'))
    }
    return Promise.reject(new Error(res?.message || '请求失败'))
  },
  // 失败时：按 HTTP 状态码处理
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      // 401：未授权 → 清空登录态并跳登录页
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    } else if (status === 500) {
      // 500：服务器错误 → 提示用户
      alert('服务器错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request