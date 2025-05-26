<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="handleBackdropClick">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-3xl flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-3xl mr-3">{{ section.icon }}</span>
            <div>
              <h2 class="text-2xl font-bold text-white">{{ section.title }}</h2>
              <p class="text-blue-100">{{ section.description }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Operation Buttons -->
      <div class="flex-shrink-0">
        <OperationButtons
          :operations="operations"
          :selected-operation="selectedOperation"
          @operation-selected="$emit('operation-selected', $event)"
        />
      </div>

      <!-- Dynamic Form Content - Scrollable Area -->
      <div class="flex-1 overflow-hidden flex flex-col min-h-0">
        <DynamicForm
          v-if="selectedOperation"
          :section="section"
          :operation="selectedOperation"
          :form-data="formData"
          @form-submit="$emit('form-submit')"
          @cancel="$emit('close')"
          @update-field="(fieldName, value) => $emit('update-field', fieldName, value)"
        />

        <!-- Placeholder when no operation selected -->
        <div v-else class="flex-1 flex items-center justify-center text-gray-500 rounded-b-3xl">
          <div class="text-center">
            <div class="text-6xl mb-4">🎯</div>
            <p class="text-lg">Seleziona un'operazione per iniziare</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import OperationButtons from './OperationButtons.vue'
import DynamicForm from './DynamicForm.vue'

defineProps({
  section: Object,
  operations: Array,
  selectedOperation: String,
  formData: Object
})

const emit = defineEmits(['close', 'operation-selected', 'form-submit', 'update-field'])

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script> 