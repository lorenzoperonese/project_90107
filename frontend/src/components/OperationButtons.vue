<template>
  <div class="p-4 md:p-6 border-b border-gray-200">
    <div class="flex flex-wrap gap-2 md:gap-3">
      <button
        v-for="operation in operations"
        :key="operation.id"
        @click="$emit('operation-selected', operation.id)"
        :class="[
          'p-2 md:p-3 rounded-lg md:rounded-xl text-center transition-all duration-200 border-2 flex-1 min-w-[100px] md:min-w-[120px] touch-manipulation active:scale-95',
          selectedOperation === operation.id 
            ? `${operation.color} text-white border-transparent shadow-lg scale-105` 
            : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
        ]"
      >
        <div class="text-xl md:text-2xl mb-1">{{ operation.icon }}</div>
        <div class="text-xs md:text-sm font-semibold leading-tight">{{ operation.name }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['operations', 'selectedOperation'])
defineEmits(['operation-selected'])
</script> 