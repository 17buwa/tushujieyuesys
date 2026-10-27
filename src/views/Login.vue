
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
// 获取 user store：把接口返回的登录信息存入它
const userStore = useUserStore()

// 用户名输入框绑定的值
const username = ref('')
// 登录中标记，防止重复点击
const loading = ref(false)

// 调登录接口，成功后把 token/userInfo 存入 store 再跳转
async function handleLogin() {
  // 空用户名直接返回（可配合前端校验）
  if (!username.value.trim()) return
  loading.value = true
  try {
    // login() 返回 res.data = { token, userInfo }
    const res: any = await login(username.value)
    // 把接口返回的登录信息写入 user store（持久化插件会自动存 localStorage）
    userStore.token = res.token
    userStore.userInfo = res.userInfo
    router.push('/books')
  } catch {
    alert('登录失败，请重试')
  } finally {
    loading.value = false
  }
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
      <button :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
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