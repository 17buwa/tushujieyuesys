import { defineStore } from 'pinia'

// 定义 user store：管理登录状态与用户信息
export const useUserStore = defineStore('user', {
  // 开启持久化：把整个 state 自动存到 localStorage，刷新页面后登录态保持
  persist: {
    key: 'library-user', // localStorage 中存储的键名
  },

  // state：响应式数据
  state: () => ({
    // 登录令牌
    token: '',
    // 用户信息：姓名 + 角色
    userInfo: { name: '', role: '' },
  }),

  // getters：基于 state 的计算属性
  getters: {
    // 是否已登录：只要 token 存在就算已登录
    isLoggedIn: (state) => !!state.token,
    // 当前登录用户名（未登录时为空字符串）
    username: (state) => state.userInfo.name,
  },

  // actions：修改状态的方法
  actions: {
    // 模拟登录：传入用户名，写入 token 和用户信息
    login(username: string) {
      this.token = 'demo-token-' + Date.now()
      this.userInfo = { name: username, role: '管理员' }
      // 同步到 localStorage，让路由守卫也能读取到
      localStorage.setItem('library_token', this.token)
    },

    // 退出登录：清空状态
    logout() {
      this.token = ''
      this.userInfo = { name: '', role: '' }
      // 持久化插件会自动把清空后的 state 同步到 localStorage，无需手动删除
    },
  },
})