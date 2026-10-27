<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 退出登录：清掉本地 token，跳回登录页
function logout() {
  localStorage.removeItem('library_token')
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <span class="brand">📚 图书借阅管理</span>
      <button class="logout" @click="logout">退出登录</button>
    </header>

    <div class="body">
      <!-- 侧边菜单：用 RouterLink 做导航，active-class 给当前项加高亮 -->
      <nav class="menu">
        <RouterLink to="/books" active-class="active">图书列表</RouterLink>
        <RouterLink to="/borrow-record" active-class="active">借阅记录</RouterLink>
      </nav>

      <!-- 主区域：由路由渲染当前子页面 -->
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #2c3e50;
  color: #fff;
}

.brand {
  font-size: 18px;
  font-weight: bold;
}

.logout {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #e74c3c;
  color: #fff;
  cursor: pointer;
}

.body {
  display: flex;
  padding: 20px;
  gap: 20px;
}

/* 侧边菜单 */
.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 160px;
}

.menu a {
  padding: 10px 14px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  background: #f5f5f5;
}

/* 当前激活菜单项高亮 */
.menu a.active {
  background: #42b983;
  color: #fff;
}

/* 主内容区 */
.content {
  flex: 1;
}

/* ===== 手机端适配（宽度 ≤ 700px） ===== */
@media (max-width: 700px) {
  .body {
    /* 改为上下堆叠 */
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }

  /* 侧边菜单改为横向、可滚动 */
  .menu {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
  }

  .menu a {
    /* 不换行，横向填充 */
    flex-shrink: 0;
    white-space: nowrap;
  }

  .content {
    width: 100%;
  }
}
</style>