<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟登录：直接写入 token 并跳转到图书列表
// 真实项目：这里应调用后端接口验证
function handleLogin() {
  localStorage.setItem('library_token', 'demo-token')
  router.push('/books')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>图书系统登录</h2>
      <button @click="handleLogin">登 录</button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  font-family: Arial, sans-serif;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 300px;
  padding: 40px 32px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-card h2 {
  margin: 0;
}

.login-card button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #42b983;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

/* ===== 手机端适配（宽度 ≤ 700px） ===== */
@media (max-width: 700px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    /* 卡片占满可用宽度，但留少量边距 */
    width: 100%;
    max-width: 320px;
    padding: 32px 24px;
    box-sizing: border-box;
  }
}
</style>