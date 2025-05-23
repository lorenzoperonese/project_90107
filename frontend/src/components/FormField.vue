<template>
  <div :class="containerClass">
    <label :for="fieldId" :class="labelClass">
      {{ field.label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-if="showOptional" class="text-xs text-yellow-600">(opzionale)</span>
      <span v-if="disabled && field.requiresVehicleType" class="text-xs text-gray-500">(non necessario per biciclette e monopattini)</span>
    </label>
    
    <input
      v-if="isInputField"
      :id="fieldId"
      :type="field.type"
      :placeholder="field.placeholder"
      :required="required"
      :value="value"
      @input="$emit('update', field.name, $event.target.value)"
      :class="inputClass"
      :disabled="disabled"
    />
    
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="fieldId"
      :placeholder="field.placeholder"
      :required="required"
      :value="value"
      @input="$emit('update', field.name, $event.target.value)"
      rows="3"
      :class="inputClass + ' resize-none'"
      :disabled="disabled"
    />
    
    <select
      v-else-if="field.type === 'select'"
      :id="fieldId"
      :required="required"
      :value="value"
      @change="$emit('update', field.name, $event.target.value)"
      :class="inputClass"
      :disabled="disabled"
    >
      <option value="">Seleziona un'opzione</option>
      <option 
        v-for="option in field.options" 
        :key="getOptionValue(option)" 
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  field: Object,
  value: [String, Number],
  required: Boolean,
  classPrefix: String,
  labelClass: String,
  showOptional: Boolean,
  disabled: Boolean
})

defineEmits(['update'])

const fieldId = computed(() => `field-${props.field.name}`)
const isInputField = computed(() => ['text', 'email', 'number', 'date', 'password'].includes(props.field.type))
const containerClass = computed(() => props.field.type === 'textarea' ? 'space-y-2 md:col-span-2' : 'space-y-2')
const labelClass = computed(() => props.labelClass || 'block text-sm font-medium text-gray-700')
const inputClass = computed(() => {
  const baseClass = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500'
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
  const prefixClass = props.classPrefix ? props.classPrefix : 'border-gray-300'
  return `${baseClass} ${prefixClass} ${disabledClass}`.trim()
})

const getOptionValue = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option.value;
  }
  return option;
}

const getOptionLabel = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option.label;
  }
  return option;
}
</script> 