<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getBooks, addBook, updateBook, deleteBook, type Book } from '@/api/book'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

// 图书列表 && 加载中标记
const books = ref<Book[]>([])
const loading = ref(true)

// 拉取图书列表：调用 getBooks 接口（MSW mock 返回分页数据）
async function loadBooks() {
  loading.value = true
  try {
    // getBooks 返回 res.data = { list, page, totalPages }
    const res: any = await getBooks(1)
    books.value = res.list
  } catch {
    alert('加载图书列表失败')
  } finally {
    loading.value = false
  }
}

// ===== 新增 / 编辑弹窗状态 =====
const dialogVisible = ref(false)   // 弹窗是否显示
const editingId = ref<number | null>(null) // null=新增，有值=编辑哪本
const form = ref({ title: '', author: '', price: 0 }) // 表单数据

// 打开“新增”弹窗：清空编辑标记和表单
function openAdd() {
  editingId.value = null
  form.value = { title: '', author: '', price: 0 }
  dialogVisible.value = true
}

// 打开“编辑”弹窗：记住 id 并回填表单
function openEdit(book: Book) {
  editingId.value = book.id
  form.value = { title: book.title, author: book.author, price: book.price }
  dialogVisible.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogVisible.value = false
}

// 提交表单：新增调 addBook，编辑调 updateBook，成功后刷新列表
async function submit() {
  // 简单校验：书名不能为空
  if (!form.value.title) {
    alert('请输入书名')
    return
  }
  const payload = {
    title: form.value.title,
    author: form.value.author,
    price: Number(form.value.price),
  }
  try {
    if (editingId.value === null) {
      await addBook(payload)            // 新增
    } else {
      await updateBook(editingId.value, payload) // 编辑
    }
    closeDialog()
    loadBooks() // 操作后刷新列表
  } catch {
    alert('保存失败')
  }
}

// 删除图书：调 deleteBook，成功后刷新列表
async function removeBook(id: number) {
  if (!confirm('确定删除这本书吗？')) return
  try {
    await deleteBook(id)
    loadBooks()
  } catch {
    alert('删除失败')
  }
}

// 测试 500：请求 /api/server-error（mock 恒返回 500）
// 触发响应拦截器 error 分支 → alert('服务器错误，请稍后重试')
function testServerError() {
  request.get('/server-error').catch(() => {
    /* 拦截器已 alert 提示，这里吞掉 unhandled rejection */
  })
}

// 退出登录：清空 store 登录态并跳回登录页
function handleLogout() {
  userStore.logout()
  router.push('/login')
}

// 组件挂载完成后自动加载图书
onMounted(loadBooks)
</script>

<template>
  <div class="page">
    <div class="header-row">
      <h2>📖 图书列表</h2>
      <div>
        <!-- 触发 500 错误，观察响应拦截器提示 -->
        <button class="test" @click="testServerError">测试500</button>
        <!-- 新增图书按钮 -->
        <button class="add" @click="openAdd">+ 新增</button>
        <!-- 退出登录按钮 -->
        <button class="logout" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <!-- 加载中提示 -->
    <p v-if="loading" class="tip">加载中...</p>
    <!-- 空数据提示 -->
    <p v-else-if="books.length === 0" class="tip">暂无图书</p>
    <!-- v-for 循环渲染每本图书 -->
    <ul v-else class="book-list">
      <li v-for="book in books" :key="book.id" class="book-item">
        <div class="info">
          <span class="title">{{ book.title }}</span>
          <span class="author">作者：{{ book.author }}</span>
          <span class="price">￥{{ book.price }}</span>
        </div>
        <!-- 操作按钮：编辑 / 删除 -->
        <div class="ops">
          <button class="edit" @click="openEdit(book)">编辑</button>
          <button class="del" @click="removeBook(book.id)">删除</button>
        </div>
      </li>
    </ul>

    <!-- 新增 / 编辑弹窗 -->
    <div v-if="dialogVisible" class="mask" @click.self="closeDialog">
      <div class="dialog">
        <h3>{{ editingId === null ? '新增图书' : '编辑图书' }}</h3>
        <label>
          书名
          <input v-model="form.title" type="text" placeholder="请输入书名" />
        </label>
        <label>
          作者
          <input v-model="form.author" type="text" placeholder="请输入作者" />
        </label>
        <label>
          价格
          <input v-model.number="form.price" type="number" placeholder="请输入价格" />
        </label>
        <div class="dialog-btn">
          <button class="cancel" @click="closeDialog">取消</button>
          <button class="save" @click="submit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  font-family: Arial, sans-serif;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 退出登录按钮 */
.logout {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #e74c3c;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

/* 新增按钮 */
.add {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
}

/* 测试 500 按钮 */
.test {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f39c12;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
}

/* 加载中 / 空数据提示 */
.tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
}

.book-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

.info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.ops {
  display: flex;
  gap: 8px;
}

.ops button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.edit {
  background: #3498db;
}

.del {
  background: #e74c3c;
}

/* ===== 弹窗样式 ===== */
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  width: 320px;
}

.dialog h3 {
  margin-top: 0;
}

.dialog label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.dialog input {
  width: 100%;
  box-sizing: border-box;
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dialog-btn {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.dialog-btn button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel {
  background: #ccc;
  color: #333;
}

.save {
  background: #2ecc71;
  color: #fff;
}

.title {
  font-weight: bold;
}

.author {
  color: #666;
}

.price {
  color: #e67e22;
}

/* ===== 手机端适配（宽度 ≤ 700px） ===== */
@media (max-width: 700px) {
  .header-row {
    flex-wrap: wrap;
    gap: 10px;
  }

  .book-item {
    /* 手机端改竖排，便于信息展示 */
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px;
  }
}
</style>