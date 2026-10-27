<script setup lang="ts">
import { useRouter } from 'vue-router'

// 图书的简单文本信息（静态演示数据）
// 真实项目：这里通常调用接口获取图书列表
const books = [
  { id: 1, title: 'Vue.js 实战', author: '张三', price: 59.0 },
  { id: 2, title: 'JavaScript 高级程序设计', author: '李四', price: 89.0 },
  { id: 3, title: 'CSS 权威指南', author: '王五', price: 72.5 },
]

const router = useRouter()

// 退出登录：删除本地 token 并跳回登录页
function handleLogout() {
  localStorage.removeItem('library_token')
  router.push('/login')
}
</script>

<template>
  <div class="page">
    <div class="header-row">
      <h2>📖 图书列表</h2>
      <!-- 退出登录按钮 -->
      <button class="logout" @click="handleLogout">退出登录</button>
    </div>

    <!-- v-for 循环渲染每本图书 -->
    <ul class="book-list">
      <li v-for="book in books" :key="book.id" class="book-item">
        <span class="title">{{ book.title }}</span>
        <span class="author">作者：{{ book.author }}</span>
        <span class="price">￥{{ book.price }}</span>
      </li>
    </ul>
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