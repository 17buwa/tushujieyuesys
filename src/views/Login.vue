
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
// 获取 user store：读取/修改登录状态用 store 里的方法
const userStore = useUserStore()

// 用户名输入框绑定的值
const username = ref('')

// 模拟登录：把用户名写入 user store，再跳转到图书列表
function handleLogin() {
  // 调 store 的 login 方法：内部会写入 token 和用户信息
  userStore.login(username.value || '游客')
  router.push('/books')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>图书系统登录</h2>
      <!-- 用户名输入框：v-model 双向绑定到 username -->
      <input
        v-model="username"
        type="text"
        placeholder="请输入用户名"
        @keyup.enter="handleLogin"
      />
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

.login-card input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.login-card input:focus {
  outline: none;
  border-color: #42b983;
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