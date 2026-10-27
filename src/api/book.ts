import request from '@/utils/request'

// 图书类型
export interface Book {
  id: number
  title: string
  author: string
  price: number
}

// 分页获取图书列表：GET /api/books?page=xx
export function getBooks(page = 1) {
  return request.get('/books', { params: { page } })
}

// 新增图书：POST /api/books
export function addBook(data: Omit<Book, 'id'>) {
  return request.post('/books', data)
}

// 编辑图书：PUT /api/books/:id
export function updateBook(id: number, data: Partial<Book>) {
  return request.put(`/books/${id}`, data)
}

// 删除图书：DELETE /api/books/:id
export function deleteBook(id: number) {
  return request.delete(`/books/${id}`)
}