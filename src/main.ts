import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 挂载路由：让 router 在整个应用里生效，
// 之后才能用 <RouterView />、<RouterLink /> 以及 $router / useRouter()
app.use(router)

app.mount('#app')