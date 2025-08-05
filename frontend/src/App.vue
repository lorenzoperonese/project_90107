<template>
  <div id="app" class="min-h-screen bg-blue-900">
    <!-- Header -->
    <header class="text-center py-12 md:py-24 px-4">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
        BoloMove
        <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Hub</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300">Interagisci con il nostro database</p>
    </header>

    <!-- Main content -->
    <main class="px-4 md:px-6 pb-12">
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
        :search-results="searchResults"
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
const { operationDefinitions } = useOperations()

// State
const activeSection = ref(null)
const selectedOperation = ref(null)
const formData = reactive({})
const searchResults = ref(null)
const showSuccess = ref(false)

// Computed
const availableOperations = computed(() => {
  if (activeSection.value === null) return []
  
  const sectionOperations = sections[activeSection.value]?.operations || []
  return sectionOperations.map(opId => operationDefinitions[opId]).filter(op => op !== undefined)
})

// Methods
const activateSection = (index) => {
  activeSection.value = index
  selectedOperation.value = null
  clearFormData()
  searchResults.value = null
}

const selectOperation = (operationId) => {
  selectedOperation.value = operationId
  clearFormData()
  searchResults.value = null
}

const closeForm = () => {
  activeSection.value = null
  selectedOperation.value = null
  clearFormData()
  searchResults.value = null
}

const clearFormData = () => {
  Object.keys(formData).forEach(key => delete formData[key])
}

const updateField = (fieldName, value) => {
  if (fieldName === '__reset_search') {
    // Speciale: Reset dei risultati di ricerca
    searchResults.value = null
    return
  }
  formData[fieldName] = value
}

const submitForm = async () => {
  const result = await api.submitForm(activeSection.value, selectedOperation.value, formData)
  
  if (result.success) {
    // Se è un'operazione di ricerca/lettura, salva i risultati
    if (selectedOperation.value?.startsWith('read')) {
      // Usa result.data.data invece di result.data per accedere ai dati effettivi
      searchResults.value = result.data.data
    } else {
      // Per altre operazioni, mostra il messaggio di successo e chiudi il form
      showSuccess.value = true
      setTimeout(() => showSuccess.value = false, 3000)
      closeForm()
    }
  } else {
    alert(result.error)
  }
}
</script>

<style>
@import './assets/main.css';
</style>
