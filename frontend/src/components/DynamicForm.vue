<template>
  <div :class="backgroundClass">
    <div class="p-6 h-full flex flex-col">
      <form @submit.prevent="$emit('form-submit')" class="flex-1 flex flex-col">
        <!-- Form Content -->
        <div class="flex-1 overflow-y-auto pr-2">
          <!-- READ Operation -->
          <div v-if="isReadOperation" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                v-for="(field, index) in fields"
                :key="index"
                :field="field"
                :value="formData[field.name]"
                @update="updateField"
                class-prefix="border-blue-200 focus:border-blue-500"
              />
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
              <div class="space-y-2">
                <label class="block text-sm font-medium text-red-800">Conferma Operazione</label>
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p class="text-red-800 text-sm">⚠️ Il record verrà eliminato definitivamente</p>
                </div>
              </div>
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

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-6 border-t border-gray-200 mt-6">
          <button type="submit" :class="submitButtonClass">
            {{ buttonText }}
          </button>
          <button type="button" @click="$emit('cancel')" class="px-6 py-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors">
            Annulla
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FormField from './FormField.vue'
import { useOperations } from '../composables/useOperations.js'

const props = defineProps({
  section: Object,
  operation: String,
  formData: Object
})

const emit = defineEmits(['form-submit', 'cancel', 'update-field'])

const operations = useOperations()

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
  const baseClass = 'flex-1 overflow-y-auto transition-all duration-300'
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
</script> 