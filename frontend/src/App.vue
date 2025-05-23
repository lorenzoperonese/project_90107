<template>
  <div id="app" class="min-h-screen bg-blue-900">
    <!-- Header -->
    <header class="text-center py-12">
      <h1 class="text-6xl font-bold text-white mb-4">
        BoloMove
        <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Hub</span>
      </h1>
      <p class="text-xl text-gray-300">Interagisci con il nostro database</p>
    </header>

    <!-- Main content -->
    <main class="px-6 pb-12">
      <!-- Section Grid -->
      <SectionGrid
        :sections="sections"
        :active-section="activeSection"
        @section-selected="activateSection"
      />

      <!-- Operation Modal -->
      <OperationModal
        v-if="activeSection !== null"
        :section="sections[activeSection]"
        :operations="availableOperations"
        :selected-operation="selectedOperation"
        :form-data="formData"
        @close="closeForm"
        @operation-selected="selectOperation"
        @form-submit="submitForm"
        @update-field="updateField"
      />

      <!-- Success Message -->
      <SuccessMessage :show="showSuccess" />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import SectionGrid from './components/SectionGrid.vue'
import OperationModal from './components/OperationModal.vue'
import SuccessMessage from './components/SuccessMessage.vue'
import { sections } from './data/sections.js'
import { useOperations } from './composables/useOperations.js'
import { useApi } from './composables/useApi.js'

// Composables
const operations = useOperations()
const api = useApi()

// State
const activeSection = ref(null)
const selectedOperation = ref(null)
const formData = reactive({})
const showSuccess = ref(false)

// Computed
const availableOperations = computed(() => {
  if (activeSection.value === null) return []
  return operations.getAvailableOperations(sections[activeSection.value])
})

// Methods
const activateSection = (index) => {
  activeSection.value = index
  selectedOperation.value = null
  clearFormData()
}

const selectOperation = (operationId) => {
  selectedOperation.value = operationId
  clearFormData()
}

const closeForm = () => {
  activeSection.value = null
  selectedOperation.value = null
  clearFormData()
}

const clearFormData = () => {
  Object.keys(formData).forEach(key => delete formData[key])
}

const updateField = (fieldName, value) => {
  formData[fieldName] = value
}

const submitForm = async () => {
  const result = await api.submitForm(activeSection.value, selectedOperation.value, formData)
  
  if (result.success) {
    showSuccess.value = true
    setTimeout(() => showSuccess.value = false, 3000)
    closeForm()
  } else {
    alert(result.error)
  }
}
</script>

<style>
@import './assets/main.css';
</style>
