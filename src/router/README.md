# Vue Router 路由配置

图书借阅管理系统的前端路由配置，基于 **Vue Router 4**。

## 技术栈

- Vue 3 + Vite + `<script setup>`
- Vue Router 4

## 路由表

| 路径 | 页面 | 需登录 (`requiresAuth`) | 说明 |
|------|------|:---:|------|
| `/login` | Login 登录页 | 否 | 登录入口 |
| `/` | Layout 布局（父布局） | 是 | 空路径自动重定向到 `/books` |
| `/books` | BookList 图书列表 | 是 | Layout 的子路由 |
| `/borrow-record` | BorrowRecord 借阅记录 | 是 | Layout 的子路由 |
| `/:pathMatch(.*)*` | —（404 兜底） | 重定向到 `/login` | 匹配所有未定义路径 |

## 6 条核心要求实现说明

| # | 要求 | 实现方式 |
|---|------|----------|
| 1 | 路由懒加载 | `component: () => import('../views/BookList.vue')`，页面被访问时才加载 |
| 2 | 嵌套路由 | `/` → `Layout` 为父，`/books` `/borrow-record` 为子，`Layout` 内用 `<RouterView />` 渲染子页 |
| 3 | `meta.requiresAuth` | 在 Layout 和两个子路由的 `meta` 中标记，标记后该路由及其父路由视为需要登录 |
| 4 | 全局前置守卫 | `router.beforeEach` 读取 `localStorage.getItem('library_token')`，无 token 访问需登录页 → 跳 `/login` |
| 5 | 404 兜底 | `/:pathMatch(.*)*` 重定向到 `/login` |
| 6 | `scrollBehavior` | 带 `savedPosition` 时回到原位置，否则滚动到顶部 `{ top: 0 }` |

## 鉴权流程

```
用户访问 /books（requiresAuth = true）
        │
        ▼
beforeEach 守卫读取 localStorage 的 library_token
        │
   ┌────┴────┐
   │ 有 token  │          │ 无 token  │
   │    ▼       │          │    ▼       │
   │ 放行进 /books │          │ 跳转 /login  │
   └──────────┘          └──────────┘
```

## 目录结构

```
src/
├── router/
│   └── index.ts        # ★ 路由配置（本文件）
├── views/
│   ├── Login.vue       # 登录页
│   ├── Layout.vue      # 布局页（父布局）
│   ├── BookList.vue    # 图书列表
│   └── BorrowRecord.vue# 借阅记录
├── App.vue             # 根组件，仅含 <RouterView />
└── main.ts             # 入口，app.use(router)
```

## 运行

```bash
npm install   # 安装依赖
npm run dev   # 启动开发服务器
```

访问 `http://localhost:5173`，未登录会自动跳转到 `/login`。登录页填写任意非空账号密码即可登录并进入 `/books`。