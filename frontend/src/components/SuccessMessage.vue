<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition-all duration-200"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div v-if="show" class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Operazione completata con successo!
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps(['show'])
</script> 