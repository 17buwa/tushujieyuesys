<script setup lang="ts">
import { ref } from 'vue'

// 1. 声明本组件可以向外发出的事件叫 "add"
//    子组件自己只管输入框，真正"添加到哪"由父组件决定
const emit = defineEmits<{
  (e: 'add', text: string): void
}>()

// 输入框的内容由本组件自己用 ref 管理
const newItem = ref('')

// 点击添加按钮时触发
function handleAdd() {
  const text = newItem.value.trim() // 去掉首尾空格
  if (text === '') return           // 空内容不发
  emit('add', text)                 // 把内容"喊"给父组件，由父组件真正添加
  newItem.value = ''                // 清空输入框
}
</script>

<template>
  <!-- 输入框 + 添加按钮，@click 绑定事件 -->
  <div class="add-row">
    <input
      v-model="newItem"
      type="text"
      placeholder="输入要买的东西"
      @keyup.enter="handleAdd"
    />
    <button @click="handleAdd">添加</button>
  </div>
</template>

<style scoped>
.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #42b983;
  color: #fff;
}
</style>