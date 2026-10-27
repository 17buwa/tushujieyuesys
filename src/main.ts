import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// ===== MSW mock 已关闭 =====
// 如需重新启用，恢复以下注释代码，并在 app 挂载前 await worker.start()：
//   import { setupWorker } from 'msw/browser'
//   import { handlers } from './mock/handlers'
//   if (import.meta.env.DEV) {
//     const worker = setupWorker(...handlers)
//     await worker.start()
//   }

const app = createApp(App)

// 创建 Pinia 实例（全局状态管理）
const pinia = createPinia()
// 给 Pinia 注册持久化插件：让开启 persist 的 store 自动存 localStorage
pinia.use(piniaPluginPersistedstate)

// 挂载 Pinia：让状态管理在整个应用里生效，
// 之后组件里就能用 useXxxStore() 读取/修改全局状态
app.use(pinia)

// 挂载路由：让 router 在整个应用里生效，
// 之后才能用 <RouterView />、<RouterLink /> 以及 $router / useRouter()
app.use(router)

app.mount('#app')