# 购物清单（Shopping List）

一个用 Vue 3 + 组合式 API（`<script setup>`）实现的简单购物清单功能。通过组件化重构，把功能拆成了 4 个组件各司其职。

## 组件结构

```
App.vue                       # 根组件（老板）：掌管所有数据 items
├── components/TodoHeader.vue # 页头组件：只负责标题「🛒 购物清单」
├── components/TodoInput.vue  # 输入组件：输入框 + 添加按钮
└── components/TodoList.vue   # 列表组件：v-for 渲染列表 + 删除按钮
```

## 数据流与组件通信

Vue 中父子组件靠两种方式通信，本项目都用到：

```
        App.vue（老板，掌管 items）
        │
        │ ① props 下行：把 items 通过 :list="items" 传给下属
        │   子组件里用 defineProps 接收，用来显示
        │
        ├── TodoInput.vue ──② emit('add', text)──▶ App 调用 addItem()
        └── TodoList.vue  ──② emit('remove', index)─▶ App 调用 removeItem()
```

| 通信方向 | 机制 | 位置 |
|----------|------|------|
| 父 → 子 | `props`（属性，数据向下传） | `App` 的 `:list` / `TodoList` 的 `defineProps` |
| 子 → 父 | `emit`（事件，通知向上发） | `TodoInput` / `TodoList` 的 `defineEmits` |

## 核心知识点

| 知识点 | 说明 | 代码位置 |
|--------|------|----------|
| `ref` | 创建响应式数据，数据变化页面自动更新 | `App.vue` 的 `items` |
| `props` | 父组件把数据传给子组件 | `App.vue` `:list` + `TodoList` `defineProps` |
| `emit` | 子组件通知父组件干活 | `TodoInput`/`TodoList` 的 `defineEmits` |
| `v-model` | 输入框与数据的双向绑定 | `TodoInput.vue` 的 `newItem` |
| `v-for` | 循环渲染列表 | `TodoList.vue` |
| `@click` | 绑定点击事件 | 添加 / 删除按钮 |
| `@keyup.enter` | 输入框按回车触发添加 | `TodoInput.vue` |
| `v-if / v-else` | 条件渲染（有列表 / 空列表） | `TodoList.vue` |

## 组件拆分前后对比

**拆分前**：App.vue 一个文件里堆了模板 + 全部逻辑 + 样式，约 110 行。
**拆分后**：每个组件只做一件事，职责单一。

## 如何运行

```bash
npm install   # 安装依赖（若未安装）
npm run dev   # 启动开发服务器
```

浏览器访问 `http://localhost:5173`。