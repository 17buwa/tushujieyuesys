import { createRouter, createWebHistory } from 'vue-router'

// 路由表
// 懒加载：用 () => import(...)，页面只在被访问时才加载，减小首屏体积
const routes = [
  // 登录页：无需登录，所以不设 requiresAuth
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' },
  },

  // 嵌套路由：Layout 作父布局，子路由渲染在它内部
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    // meta.requiresAuth = true，标记"需要登录才能访问"
    meta: { requiresAuth: true, title: '图书借阅管理' },
    // children 里的路由 path 不用再写开头的 /
    children: [
      // 访问 / 时自动重定向到 /books
      {
        path: '',
        redirect: '/books',
      },
      {
        path: 'books',
        name: 'BookList',
        component: () => import('../views/BookList.vue'),
        meta: { requiresAuth: true, title: '图书列表' },
      },
      {
        path: 'borrow-record',
        name: 'BorrowRecord',
        component: () => import('../views/BorrowRecord.vue'),
        meta: { requiresAuth: true, title: '借阅记录' },
      },
    ],
  },

  // 404 兜底：匹配所有没定义的路径，重定向到登录页
  // 注意要在最后，前面的具体路由优先匹配
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(), // HTML5 History 模式，地址栏没有 #
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 带 savedPosition 说明用户用过浏览器前进/后退，回到原位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0 }
  },
})

// ===== 全局前置守卫 =====
// 每次路由跳转前都会执行这里
router.beforeEach((to, from, next) => {
  // 读取 localStorage 中的登录令牌
  const token = localStorage.getItem('library_token')

  // 设置页面标题（可选，方便浏览器标签显示）
  document.title = to.meta?.title ? `${to.meta.title} - 图书借阅管理` : '图书借阅管理'

  // 判断该路由是否需要登录：
  // to.matched 是当前命中的所有嵌套路由，只要其中任何一层要求登录，就算需要
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    // 需要登录但没 token → 跳去登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已经登录了还去访问登录页 → 送回图书列表
    next('/books')
  } else {
    // 其他情况正常放行
    next()
  }
})

export default router