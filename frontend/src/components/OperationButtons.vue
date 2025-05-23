<template>
  <div class="p-6 border-b border-gray-200">
    <div class="flex flex-wrap gap-3">
      <button
        v-for="operation in operations"
        :key="operation.id"
        @click="$emit('operation-selected', operation.id)"
        :class="[
          'p-3 rounded-xl text-center transition-all duration-200 border-2 flex-1 min-w-[120px]',
          selectedOperation === operation.id 
            ? `${operation.color} text-white border-transparent shadow-lg scale-105` 
            : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
        ]"
      >
        <div class="text-2xl mb-1">{{ operation.icon }}</div>
        <div class="text-sm font-semibold">{{ operation.name }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['operations', 'selectedOperation'])
defineEmits(['operation-selected'])
</script> 