import { http, HttpResponse } from 'msw'

// ===== 内存数据（模拟数据库） =====

// 图书类型
interface Book {
  id: number
  title: string
  author: string
  price: number
}

// 初始图书数据
const books: Book[] = [
  { id: 1, title: 'Vue.js 实战', author: '张三', price: 59 },
  { id: 2, title: 'JavaScript 高级程序设计', author: '李四', price: 89 },
  { id: 3, title: 'CSS 权威指南', author: '王五', price: 72.5 },
  { id: 4, title: 'TypeScript 入门', author: '赵六', price: 45 },
  { id: 5, title: 'Node.js 开发指南', author: '孙七', price: 68 },
]

// 自增 id：初始值从已有最大 id 开始
let nextId = 6

// 每页条数
const PAGE_SIZE = 2

// ===== 路由处理器 =====

export const handlers = [
  // 1) 登录：POST /api/login → 返回 token + 用户信息
  // 响应格式对齐 axios 拦截器约定：{ code, data }
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as { username?: string }
    return HttpResponse.json({
      code: 200,
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: { name: body?.username || '游客', role: '管理员' },
      },
    })
  }),

  // 2) 图书列表：GET /api/books → 分页返回
  // 6) 带 page 参数时，超过最大页返回空数据
  http.get('/api/books', ({ request }) => {
    // 读取 URL 里的 page 参数
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)

    // 计算分页片段
    const total = books.length
    const totalPages = Math.ceil(total / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const list = books.slice(start, start + PAGE_SIZE)

    // 超过最大页 → 返回空数据（模拟无更多内容）
    if (page > totalPages) {
      return HttpResponse.json({ code: 200, data: { list: [], page, totalPages } })
    }
    return HttpResponse.json({ code: 200, data: { list, page, totalPages } })
  }),

  // 3) 新增图书：POST /api/books
  http.post('/api/books', async ({ request }) => {
    const body = (await request.json()) as Omit<Book, 'id'>
    const newBook: Book = { id: nextId++, ...body }
    books.push(newBook)
    return HttpResponse.json({ code: 200, data: newBook }, { status: 201 })
  }),

  // 4) 编辑图书：PUT /api/books/:id
  http.put('/api/books/:id', async ({ request, params }) => {
    const id = Number(params.id)
    const body = (await request.json()) as Partial<Book>
    const index = books.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: '未找到该书' }, { status: 404 })
    }
    // 逐字段合并：body 里的值优先，缺省沿用原书，并保留原 id
    const current = books[index]!
    books[index] = {
      id: current.id,
      title: body.title ?? current.title,
      author: body.author ?? current.author,
      price: body.price ?? current.price,
    }
    return HttpResponse.json({ code: 200, data: books[index] })
  }),

  // 5) 删除图书：DELETE /api/books/:id
  http.delete('/api/books/:id', ({ params }) => {
    const id = Number(params.id)
    const index = books.findIndex((b) => b.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: '未找到该书' }, { status: 404 })
    }
    const [removed] = books.splice(index, 1)
    return HttpResponse.json({ code: 200, data: removed })
  }),

  // 测试1) 恒返回 HTTP 500 → 验证响应拦截器“服务器错误”提示
  http.get('/api/server-error', () => {
    return HttpResponse.json({ message: '服务器出错了' }, { status: 500 })
  }),

  // 测试2) 必须带 Authorization，否则返回 401 → 验证拦截器跳登录
  // 请求拦截器会自动带上 token；该接口检测不到就说明未登录
  http.get('/api/protected', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return HttpResponse.json({ message: '未授权' }, { status: 401 })
    }
    // 有 token 就返回成功
    return HttpResponse.json({ code: 200, data: { ok: true, auth } })
  }),
]