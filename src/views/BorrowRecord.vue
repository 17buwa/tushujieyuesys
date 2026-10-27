<script setup lang="ts">
// 借阅记录（静态演示数据）
// 真实项目：这里通常调用接口获取当前用户的借阅记录
const records = [
  { id: 1, book: 'Vue.js 实战', borrowDate: '2025-01-10', status: '已借出' },
  { id: 2, book: 'JavaScript 高级程序设计', borrowDate: '2025-01-15', status: '已归还' },
  { id: 3, book: 'CSS 权威指南', borrowDate: '2025-02-01', status: '已借出' },
]
</script>

<template>
  <div class="page">
    <h2>🕘 借阅记录</h2>

    <!-- v-for 循环渲染每条记录 -->
    <ul class="record-list">
      <li v-for="record in records" :key="record.id" class="record-item">
        <span class="book">{{ record.book }}</span>
        <span class="date">借阅：{{ record.borrowDate }}</span>
        <span class="status">{{ record.status }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  font-family: Arial, sans-serif;
}

.record-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

.book {
  font-weight: bold;
}

.date {
  color: #666;
}

.status {
  color: #42b983;
}

/* ===== 手机端适配（宽度 ≤ 700px） ===== */
@media (max-width: 700px) {
  .record-item {
    /* 手机端改竖排 */
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px;
  }
}
</style>