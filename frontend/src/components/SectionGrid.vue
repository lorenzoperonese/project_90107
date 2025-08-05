<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
    <div
      v-for="(section, index) in sections"
      :key="index"
      @click="$emit('section-selected', index)"
      :class="[
        'p-6 md:p-8 h-40 md:h-48 flex flex-col justify-center items-center text-center cursor-pointer',
        'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
        'border-2 hover:border-blue-300 group relative active:scale-95 touch-manipulation',
        activeSection === index 
          ? 'border-blue-500 bg-blue-50 scale-105 shadow-xl' 
          : 'border-gray-200'
      ]"
    >
      <div class="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
        {{ section.icon }}
      </div>
      
      <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{{ section.title }}</h3>
      <p class="text-xs md:text-sm text-gray-600 leading-tight">{{ section.description }}</p>
      
      <div v-if="activeSection === index" class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sections: Array,
  activeSection: Number
})

defineEmits(['section-selected'])
</script> 