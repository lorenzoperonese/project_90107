<template>
  <div :class="backgroundClass" class="flex flex-col h-full rounded-b-3xl overflow-hidden">
    <form @submit.prevent="$emit('form-submit')" class="flex flex-col h-full">
      <!-- Form Content - Scrollable Area -->
      <div 
        ref="scrollContainer"
        @scroll="handleScroll"
        class="flex-1 overflow-y-auto p-6 pb-0 modal-scroll"
      >
        <div class="space-y-4">
          <!-- READ Operation Form -->
          <div v-if="isReadOperation" class="space-y-6">
            <!-- Form fields section -->
            <div v-if="!searchResults" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                v-for="(field, index) in fields"
                :key="index"
                :field="field"
                :value="formData[field.name]"
                @update="updateField"
                class-prefix="border-blue-200 focus:border-blue-500"
              />
            </div>

            <!-- Search results section -->
            <div v-else class="space-y-6">
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-blue-800">Risultati della ricerca</h3>
                </div>

                <!-- No results message -->
                <div v-if="Array.isArray(searchResults) && searchResults.length === 0" 
                     class="text-center py-8 bg-blue-50 border border-blue-100 rounded-lg">
                  <p class="text-lg font-medium text-gray-700">Nessun risultato trovato</p>
                </div>

                <!-- Array of results -->
                <div v-else-if="Array.isArray(searchResults)" class="overflow-x-auto">
                  <table class="min-w-full bg-white border border-blue-200 rounded-lg overflow-hidden">
                    <thead class="bg-blue-100">
                      <tr>
                        <th v-for="(_, key) in searchResults[0]" :key="key" class="px-4 py-3 text-left text-sm font-semibold text-blue-900 uppercase tracking-wider border-b border-blue-200">
                          {{ formatColumnName(key) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in searchResults" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-blue-50'">
                        <td v-for="(value, key) in item" :key="`${index}-${key}`" class="px-4 py-3 text-sm text-gray-700 border-b border-blue-100">
                          {{ formatValue(value) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Single object result -->
                <div v-else-if="typeof searchResults === 'object'" class="bg-white rounded-lg border border-blue-200 overflow-hidden">
                  <div class="grid grid-cols-1 divide-y divide-blue-100">
                    <div v-for="(value, key) in searchResults" :key="key" class="flex p-4">
                      <div class="w-1/3 font-medium text-blue-800">{{ formatColumnName(key) }}</div>
                      <div class="w-2/3 text-gray-700">{{ formatValue(value) }}</div>
                    </div>
                  </div>
                </div>

                <!-- Other types of results (scalar values) -->
                <div v-else class="bg-white p-4 rounded-lg border border-blue-200">
                  <pre class="text-gray-700 whitespace-pre-wrap">{{ formatValue(searchResults) }}</pre>
                </div>
              </div>

              <!-- New search button -->
              <div class="flex justify-center">
                <button 
                  type="button" 
                  @click="resetSearch" 
                  class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Nuova ricerca
                </button>
              </div>
            </div>
          </div>

          <!-- DELETE Operation -->
          <div v-else-if="operation === 'delete'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                :field="deleteField"
                :value="formData[deleteField.name]"
                @update="updateField"
                :required="true"
                class-prefix="border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          <!-- CREATE/UPDATE Operations -->
          <div v-else class="space-y-4">
            <!-- Campo Tipologia a tutta larghezza per i veicoli -->
            <div v-if="operation === 'create' && section.title === 'Veicoli'" class="space-y-4">
              <div class="w-full">
                <FormField
                  v-for="(field, index) in fields.filter(f => f.name === 'Tipologia')"
                  :key="index"
                  :field="field"
                  :value="formData[field.name]"
                  @update="updateField"
                  :required="field.required"
                  class-prefix="border-green-200 focus:border-green-500"
                  label-class="text-green-800"
                />
              </div>
            </div>

            <!-- Altri campi -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                v-for="(field, index) in fieldsWithState"
                :key="`${index}-${field.name}`"
                :field="field"
                :value="formData[field.name]"
                @update="updateField"
                :required="field.isRequired"
                :class-prefix="operation === 'create' ? 'border-green-200 focus:border-green-500' : 'border-yellow-200 focus:border-yellow-500'"
                :label-class="operation === 'create' ? 'text-green-800' : 'text-yellow-800'"
                :show-optional="operation !== 'create'"
                :disabled="field.isDisabled"
              />
            </div>
          </div>
        </div>
        <!-- Padding bottom per evitare che l'ultimo elemento sia troppo vicino al bordo -->
        <div class="h-4"></div>
      </div>

      <!-- Action Buttons - Always Visible -->
      <div 
        :class="[
          'flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-white transition-shadow duration-200 rounded-b-3xl',
          showTopShadow ? 'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' : ''
        ]"
      >
        <div class="flex gap-4">
          <button v-if="!searchResults || !isReadOperation" type="submit" :class="submitButtonClass">
            {{ buttonText }}
          </button>
          <button type="button" @click="$emit('cancel')" class="px-6 py-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors">
            Annulla
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import FormField from './FormField.vue'
import { useOperations } from '../composables/useOperations.js'

const props = defineProps({
  section: Object,
  operation: String,
  formData: Object,
  searchResults: Object
})

const emit = defineEmits(['form-submit', 'cancel', 'update-field'])

const operations = useOperations()
const scrollContainer = ref(null)
const showTopShadow = ref(false)

// Gestione dello scroll per mostrare l'ombra
const handleScroll = () => {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    showTopShadow.value = scrollTop > 10 && scrollHeight > clientHeight
  }
}

// Controlla se c'è contenuto scrollabile al mount e quando cambia l'operazione
onMounted(() => {
  nextTick(() => {
    handleScroll()
  })
})

// Ricontrolla quando cambia l'operazione
watch(() => props.operation, () => {
  nextTick(() => {
    handleScroll()
  })
})

// Computed properties
const isReadOperation = computed(() => props.operation?.startsWith('read'))

const fields = computed(() => {
  if (isReadOperation.value) {
    return operations.getReadFields(props.operation)
  }
  return operations.getFormFields(props.section, props.operation, props.formData)
})

const deleteField = computed(() => {
  const sectionIndex = [
    'Veicoli', 'Noleggi', 'Clienti', 'Manutenzioni', 'Ricariche', 
    'Centri di Ricarica', 'Stazioni di Ricarica', 'Tariffe'
  ].indexOf(props.section?.title)
  return operations.getDeleteField(sectionIndex)
})

const buttonText = computed(() => operations.getOperationButtonText(props.operation))

const backgroundClass = computed(() => {
  const baseClass = 'transition-all duration-300'
  switch (props.operation) {
    case 'create': return `${baseClass} bg-green-50`
    case 'delete': return `${baseClass} bg-red-50`
    default: return isReadOperation.value ? `${baseClass} bg-blue-50` : `${baseClass} bg-yellow-50`
  }
})

const submitButtonClass = computed(() => {
  const baseClass = 'flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg'
  switch (props.operation) {
    case 'create': return `${baseClass} bg-green-600 hover:bg-green-700 text-white`
    case 'delete': return `${baseClass} bg-red-600 hover:bg-red-700 text-white`
    default: return isReadOperation.value 
      ? `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`
      : `${baseClass} bg-yellow-600 hover:bg-yellow-700 text-white`
  }
})

const updateField = (fieldName, value) => {
  emit('update-field', fieldName, value)
}

const fieldsWithState = computed(() => {
  const tipologia = props.formData.Tipologia
  
  return fields.value.filter(f => f.name !== 'Tipologia').map(field => {
    const isRequired = (() => {
      if (props.operation === 'create' && props.section?.title === 'Veicoli' && field.requiresVehicleType) {
        return field.required && field.requiresVehicleType.includes(tipologia)
      }
      return field.required
    })()
    
    const isDisabled = (() => {
      // Se non è stata selezionata una tipologia, disabilita tutti i campi
      if (props.operation === 'create' && props.section?.title === 'Veicoli' && !tipologia) {
        return true
      }
      
      // Se è stata selezionata una tipologia, applica la logica condizionale
      if (props.operation === 'create' && props.section?.title === 'Veicoli' && field.requiresVehicleType) {
        if (['bicicletta', 'monopattino'].includes(tipologia)) {
          return !field.requiresVehicleType.includes(tipologia)
        }
      }
      return false
    })()
    
    return {
      ...field,
      isRequired,
      isDisabled
    }
  })
})

// Utility per formattare i nomi delle colonne
const formatColumnName = (key) => {
  // Prima lettera maiuscola e sostituisce underscore con spazi
  if (!key) return ''
  const formatted = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
  return formatted
}

// Utility per formattare i valori
const formatValue = (value) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Sì' : 'No'
  if (value instanceof Date) return value.toLocaleString('it-IT')
  
  // Formatta stringhe di date ISO provenienti dalle API
  if (typeof value === 'string') {
    // Verifica se la stringa è una data ISO (più formati supportati)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}:\d{2}(.\d{3}Z?)?$/
    
    // Verifichiamo se è una data ISO standard
    if (isoDateRegex.test(value)) {
      try {
        const date = new Date(value)
        // Verifica che sia una data valida
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      } catch (e) {
        console.error("Errore nel parsing della data:", e)
      }
    }
    
    // Verifica se è una stringa in formato POINT(lon lat)
    if (value.toUpperCase().startsWith('POINT(')) {
      try {
        // Estrai le coordinate da POINT(lon lat)
        const coords = value.substring(6, value.length - 1).split(' ');
        if (coords.length === 2) {
          const lon = parseFloat(coords[0]);
          const lat = parseFloat(coords[1]);
          if (!isNaN(lon) && !isNaN(lat)) {
            return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          }
        }
      } catch (e) {
        console.error("Errore nel parsing del POINT:", e);
      }
    }
  }
  
  // Gestione degli oggetti POINT SQL per le coordinate GPS
  if (typeof value === 'object' && value !== null) {
    // Se l'oggetto ha proprietà x e y (tipiche di un POINT SQL)
    if ('x' in value && 'y' in value) {
      return `${value.y.toFixed(6)}, ${value.x.toFixed(6)}`  // Formato lat, lng
    }
    
    // Se è un oggetto punto in formato GeoJSON
    if (value.type === 'Point' && Array.isArray(value.coordinates)) {
      return `${value.coordinates[1].toFixed(6)}, ${value.coordinates[0].toFixed(6)}`
    }
  }
  
  return value.toString()
}

// Reset della ricerca
const resetSearch = () => {
  emit('update-field', '__reset_search', true)
  // Svuota tutti i campi del form
  fields.value.forEach(field => {
    emit('update-field', field.name, null)
  })
}
</script> 