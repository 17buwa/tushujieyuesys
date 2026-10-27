<script setup lang="ts">
// 1. 通过 props（属性）接收父组件传过来的 list 数据
//    父组件给什么，这里就显示什么，自己不直接改数据
const props = defineProps<{
  list: string[]
}>()

// 2. 声明向父组件发出 "remove" 事件，参数是要删除的索引
const emit = defineEmits<{
  (e: 'remove', index: number): void
}>()

// 点击删除按钮时，把索引告诉父组件去删
function handleRemove(index: number) {
  emit('remove', index)
}
</script>

<template>
  <!-- v-for 循环渲染列表 -->
  <ul v-if="props.list.length > 0" class="list">
    <li v-for="(item, index) in props.list" :key="index" class="item">
      <span>{{ item }}</span>
      <!-- 每一行后面的删除按钮 -->
      <button class="del" @click="handleRemove(index)">删除</button>
    </li>
  </ul>

  <!-- 空列表时的提示 -->
  <p v-else class="empty">清单还是空的，添加一样东西吧~</p>
</template>

<style scoped>
/* v-for 渲染的每一行 */
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 6px;
  list-style: none;
}

button.del {
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #e74c3c;
  color: #fff;
}

.empty {
  text-align: center;
  color: #999;
}
</style>