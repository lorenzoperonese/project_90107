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
      <!-- Grid delle 8 sezioni -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-7xl mx-auto">
        <div
          v-for="(section, index) in sections"
          :key="index"
          @click="activateSection(index)"
          :class="['section-card p-8 h-48 flex flex-col justify-center items-center text-center group', 
                   { 'active': activeSection === index }]"
        >
          <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">
            {{ section.icon }}
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ section.title }}</h3>
          <p class="text-sm text-gray-600">{{ section.description }}</p>
          
          <div v-if="activeSection === index" class="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Single Modal with Operation Tabs -->
      <div v-if="activeSection !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeFormOnBackdrop">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col" @click.stop>
          <!-- Header with Category Info -->
          <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-3xl flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-3xl mr-3">{{ sections[activeSection].icon }}</span>
                <div>
                  <h2 class="text-2xl font-bold text-white">{{ sections[activeSection].title }}</h2>
                  <p class="text-blue-100">{{ sections[activeSection].description }}</p>
                </div>
              </div>
              <button @click="closeForm" class="text-white hover:text-gray-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Operation Buttons -->
          <div class="p-6 border-b border-gray-200 flex-shrink-0">
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="operation in operations"
                :key="operation.id"
                @click="selectOperation(operation.id)"
                :class="[
                  'p-3 rounded-xl text-center transition-all duration-200 border-2',
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

          <!-- Dynamic Form Content -->
          <div v-if="selectedOperation" :class="[
            'flex-1 overflow-y-auto transition-all duration-300',
            selectedOperation === 'create' ? 'bg-green-50' : '',
            selectedOperation === 'read' ? 'bg-blue-50' : '',
            selectedOperation === 'update' ? 'bg-yellow-50' : '',
            selectedOperation === 'delete' ? 'bg-red-50' : ''
          ]">
            <div class="p-6 h-full flex flex-col">
              <!-- Operation Description -->
              <div class="mb-6 flex-shrink-0">
                <h3 :class="[
                  'text-lg font-semibold mb-2',
                  selectedOperation === 'create' ? 'text-green-700' : '',
                  selectedOperation === 'read' ? 'text-blue-700' : '',
                  selectedOperation === 'update' ? 'text-yellow-700' : '',
                  selectedOperation === 'delete' ? 'text-red-700' : ''
                ]">
                  {{ operations.find(op => op.id === selectedOperation)?.description }}
                </h3>
              </div>

              <form @submit.prevent="submitForm" class="flex-1 flex flex-col">
                <!-- Form Content Area -->
                <div class="flex-1 overflow-y-auto pr-2">
                  <!-- READ Operation Form -->
                  <div v-if="selectedOperation === 'read'" class="space-y-4">
                    <div class="bg-blue-100 border border-blue-200 rounded-lg p-4">
                      <p class="text-blue-800 text-sm">
                        🔍 Inserisci i criteri di ricerca (almeno un campo). Lascia vuoto per visualizzare tutti i record.
                      </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="(field, fieldIndex) in sections[activeSection].fields.slice(0, 4)" :key="fieldIndex" class="space-y-2">
                        <label :for="`field-${fieldIndex}`" class="block text-sm font-medium text-blue-700">
                          {{ field.label }} (opzionale)
                        </label>
                        
                        <input
                          v-if="field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date'"
                          :id="`field-${fieldIndex}`"
                          v-model="formData[field.name]"
                          :type="field.type"
                          :placeholder="field.placeholder"
                          class="input-field border-blue-200 focus:border-blue-500"
                        />
                        
                        <select
                          v-else-if="field.type === 'select'"
                          :id="`field-${fieldIndex}`"
                          v-model="formData[field.name]"
                          class="input-field border-blue-200 focus:border-blue-500"
                        >
                          <option value="">Tutti</option>
                          <option v-for="option in field.options" :key="option" :value="option">
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- DELETE Operation Form -->
                  <div v-else-if="selectedOperation === 'delete'" class="space-y-4">
                    <div class="bg-red-100 border border-red-200 rounded-lg p-4">
                      <p class="text-red-800 text-sm">
                        ⚠️ <strong>Attenzione:</strong> Questa operazione eliminerà definitivamente il record. Inserisci l'identificativo esatto.
                      </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label :for="`field-delete`" class="block text-sm font-medium text-red-700">
                          {{ sections[activeSection].fields[0].label }}
                          <span class="text-red-600">*</span>
                        </label>
                        <input
                          :id="`field-delete`"
                          v-model="formData[sections[activeSection].fields[0].name]"
                          :type="sections[activeSection].fields[0].type"
                          :placeholder="sections[activeSection].fields[0].placeholder"
                          required
                          class="input-field border-red-200 focus:border-red-500"
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-red-700">
                          Conferma Operazione
                        </label>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p class="text-red-700 text-sm">
                            ⚠️ Il record verrà eliminato definitivamente
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- CREATE/UPDATE Operation Form -->
                  <div v-else class="space-y-4">
                    <div :class="[
                      'border rounded-lg p-4',
                      selectedOperation === 'create' ? 'bg-green-100 border-green-200' : 'bg-yellow-100 border-yellow-200'
                    ]">
                      <p :class="[
                        'text-sm',
                        selectedOperation === 'create' ? 'text-green-800' : 'text-yellow-800'
                      ]">
                        <span v-if="selectedOperation === 'create'">
                          ➕ Compila tutti i campi obbligatori per creare un nuovo record.
                        </span>
                        <span v-else>
                          ✏️ Compila solo i campi che vuoi modificare. Gli altri rimarranno invariati.
                        </span>
                      </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="(field, fieldIndex) in sections[activeSection].fields.filter(f => !f.showOnlyFor || f.showOnlyFor.includes(selectedOperation))" :key="fieldIndex" 
                           :class="[
                             field.type === 'textarea' ? 'md:col-span-2' : '',
                             'space-y-2',
                             isSimpleVehicle && ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale'].includes(field.name) ? 'relative' : ''
                           ]">
                        <label :for="`field-${fieldIndex}`" :class="[
                          'block text-sm font-medium',
                          selectedOperation === 'create' ? 'text-green-700' : 'text-yellow-700',
                          isSimpleVehicle && ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale'].includes(field.name) ? 'text-gray-500' : ''
                        ]">
                          {{ field.label }}
                          <span v-if="field.required && selectedOperation === 'create'" class="text-red-500">*</span>
                          <span v-if="selectedOperation === 'update'" :class="[
                            'text-xs',
                            selectedOperation === 'update' ? 'text-yellow-600' : ''
                          ]">(opzionale)</span>
                          <span v-if="isSimpleVehicle && ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale'].includes(field.name)" class="text-xs text-red-500 block font-semibold">
                            🚫 Non applicabile per {{ formData.Tipologia?.toLowerCase() }}
                          </span>
                        </label>
                        
                        <input
                          v-if="field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date'"
                          :id="`field-${fieldIndex}`"
                          v-model="formData[field.name]"
                          :type="field.type"
                          :placeholder="field.placeholder"
                          :required="field.required && selectedOperation === 'create'"
                          :disabled="isSimpleVehicle && ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale'].includes(field.name)"
                          :class="[
                            'input-field',
                            selectedOperation === 'create' ? 'border-green-200 focus:border-green-500' : 'border-yellow-200 focus:border-yellow-500',
                            isSimpleVehicle && ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale'].includes(field.name) ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 opacity-60' : ''
                          ]"
                        />
                        
                        <textarea
                          v-else-if="field.type === 'textarea'"
                          :id="`field-${fieldIndex}`"
                          v-model="formData[field.name]"
                          :placeholder="field.placeholder"
                          :required="field.required && selectedOperation === 'create'"
                          rows="3"
                          :class="[
                            'input-field resize-none',
                            selectedOperation === 'create' ? 'border-green-200 focus:border-green-500' : 'border-yellow-200 focus:border-yellow-500'
                          ]"
                        ></textarea>
                        
                        <select
                          v-else-if="field.type === 'select'"
                          :id="`field-${fieldIndex}`"
                          v-model="formData[field.name]"
                          :required="field.required && selectedOperation === 'create'"
                          :class="[
                            'input-field',
                            selectedOperation === 'create' ? 'border-green-200 focus:border-green-500' : 'border-yellow-200 focus:border-yellow-500'
                          ]"
                        >
                          <option value="">Seleziona un'opzione</option>
                          <option v-for="option in field.options" :key="option" :value="option">
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 pt-6 border-t border-gray-200 flex-shrink-0 mt-6">
                  <button 
                    type="submit" 
                    :class="[
                      'flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg',
                      selectedOperation === 'create' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
                      selectedOperation === 'read' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '',
                      selectedOperation === 'update' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : '',
                      selectedOperation === 'delete' ? 'bg-red-600 hover:bg-red-700 text-white' : ''
                    ]"
                  >
                    {{ getOperationButtonText() }}
                  </button>
                  <button type="button" @click="closeForm" class="cancel-btn">
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Placeholder when no operation selected -->
          <div v-else class="flex-1 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <div class="text-6xl mb-4">🎯</div>
              <p class="text-lg">Seleziona un'operazione per iniziare</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Success message -->
      <div v-if="showSuccess" class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Operazione completata con successo!
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// Reactive state
const activeSection = ref(null)
const selectedOperation = ref(null)
const formData = reactive({})
const showSuccess = ref(false)

// Computed property to check if vehicle type is bike or scooter
const isSimpleVehicle = computed(() => {
  return activeSection.value === 0 && // Veicoli section
         formData.Tipologia && 
         (formData.Tipologia === 'Bicicletta elettrica' || formData.Tipologia === 'Monopattino elettrico')
})

// Watch for changes in vehicle type to clear disabled fields
watch(isSimpleVehicle, (newValue) => {
  if (newValue) {
    // Clear disabled fields when switching to simple vehicle
    const fieldsToDisable = ['Targa', 'DataImmatricolazione', 'NumeroPosti', 'NumeroPolizzaAssicurativa', 'ChilometraggioTotale']
    fieldsToDisable.forEach(fieldName => {
      if (formData[fieldName]) {
        formData[fieldName] = ''
      }
    })
  }
})

// CRUD Operations
const operations = [
  { id: 'create', name: 'Inserimento', icon: '➕', description: 'Aggiungi nuovo record', color: 'bg-green-500' },
  { id: 'read', name: 'Visualizzazione', icon: '👁️', description: 'Visualizza records', color: 'bg-blue-500' },
  { id: 'update', name: 'Modifica', icon: '✏️', description: 'Modifica record esistente', color: 'bg-yellow-500' },
  { id: 'delete', name: 'Cancellazione', icon: '🗑️', description: 'Elimina record', color: 'bg-red-500' }
]

// Sections data - BoloMove categories based on E-R model
const sections = ref([
  {
    title: 'Veicoli',
    description: 'Gestione flotta veicoli',
    icon: '🚗',
    fields: [
      { name: 'id_veicolo', label: 'ID Veicolo', type: 'text', placeholder: 'V001', required: false, showOnlyFor: ['update'] },
      { name: 'Tipologia', label: 'Tipologia', type: 'select', options: ['Auto elettrica', 'Scooter elettrico', 'Bicicletta elettrica', 'Monopattino elettrico'], required: true },
      { name: 'Targa', label: 'Targa', type: 'text', placeholder: 'AB123CD', required: true },
      { name: 'Modello', label: 'Modello', type: 'text', placeholder: 'Tesla Model 3', required: true },
      { name: 'Marca', label: 'Marca', type: 'text', placeholder: 'Tesla', required: true },
      { name: 'NumeroPosti', label: 'Numero Posti', type: 'number', placeholder: '5', required: true },
      { name: 'DataImmatricolazione', label: 'Data Immatricolazione', type: 'date', required: true },
      { name: 'ScadenzaRevisione', label: 'Scadenza Revisione', type: 'date', required: true },
      { name: 'NumeroPolizzaAssicurativa', label: 'Numero Polizza Assicurativa', type: 'text', placeholder: 'POL123456', required: true },
      { name: 'PercentualeBatteria', label: 'Percentuale Batteria (%)', type: 'number', placeholder: '85', required: false },
      { name: 'gpsQuery', label: 'Coordinate GPS', type: 'text', placeholder: '44.4949, 11.3426', required: false },
      { name: 'StatoAttuale', label: 'Stato Attuale', type: 'select', options: ['Disponibile', 'In uso', 'In manutenzione', 'Fuori servizio'], required: true },
      { name: 'ChilometraggioTotale', label: 'Chilometraggio Totale (km)', type: 'number', placeholder: '15000', required: false },
      { name: 'TariffaCategoria', label: 'Tariffa Categoria', type: 'select', options: ['Base', 'Premium', 'Luxury'], required: true }
    ]
  },
  {
    title: 'Noleggi',
    description: 'Gestione noleggi attivi',
    icon: '📋',
    fields: [
      { name: 'cliente', label: 'ID Cliente', type: 'text', placeholder: 'CLI001', required: true },
      { name: 'veicolo', label: 'ID Veicolo', type: 'text', placeholder: 'V001', required: true },
      { name: 'data_inizio', label: 'Data Inizio', type: 'date', required: true },
      { name: 'data_fine', label: 'Data Fine', type: 'date', required: false },
      { name: 'chilometri_percorsi', label: 'Chilometri Percorsi', type: 'number', placeholder: '25.5', required: false },
      { name: 'costo', label: 'Costo (€)', type: 'number', placeholder: '15.50', required: false },
      { name: 'durata', label: 'Durata (minuti)', type: 'number', placeholder: '120', required: false },
      { name: 'esito_pagamento', label: 'Esito Pagamento', type: 'select', options: ['Completato', 'In sospeso', 'Fallito', 'Rimborsato'], required: true }
    ]
  },
  {
    title: 'Clienti',
    description: 'Anagrafica clienti',
    icon: '👥',
    fields: [
      { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Mario', required: true },
      { name: 'cognome', label: 'Cognome', type: 'text', placeholder: 'Rossi', required: true },
      { name: 'data_nascita', label: 'Data di Nascita', type: 'date', required: true },
      { name: 'luogo_nascita', label: 'Luogo di Nascita', type: 'text', placeholder: 'Bologna, BO', required: true },
      { name: 'indirizzo', label: 'Indirizzo', type: 'text', placeholder: 'Via Roma 123, Bologna', required: true },
      { name: 'patente', label: 'Numero Patente', type: 'text', placeholder: 'BO1234567A', required: true },
      { name: 'documento', label: 'Numero Documento', type: 'text', placeholder: 'CI123456789', required: true }
    ]
  },
  {
    title: 'Manutenzioni',
    description: 'Gestione manutenzioni',
    icon: '🔧',
    fields: [
      { name: 'veicolo', label: 'ID Veicolo', type: 'text', placeholder: 'V001', required: true },
      { name: 'officina', label: 'ID Officina', type: 'text', placeholder: 'OFF001', required: true },
      { name: 'data', label: 'Data Intervento', type: 'date', required: true },
      { name: 'tipologia', label: 'Tipologia', type: 'select', options: ['Manutenzione ordinaria', 'Riparazione', 'Revisione', 'Sostituzione parti'], required: true },
      { name: 'costo', label: 'Costo (€)', type: 'number', placeholder: '150.00', required: true },
      { name: 'descrizione', label: 'Descrizione', type: 'textarea', placeholder: 'Dettagli dell\'intervento...', required: false }
    ]
  },
  {
    title: 'Ricariche',
    description: 'Sessioni di ricarica',
    icon: '🔋',
    fields: [
      { name: 'operatore', label: 'ID Operatore', type: 'text', placeholder: 'OPR001', required: true },
      { name: 'veicolo', label: 'ID Veicolo', type: 'text', placeholder: 'V001', required: true },
      { name: 'stazione', label: 'ID Stazione', type: 'text', placeholder: 'ST001', required: true },
      { name: 'data_inizio', label: 'Data Inizio', type: 'date', required: true },
      { name: 'data_fine', label: 'Data Fine', type: 'date', required: false },
      { name: 'costo_sessione', label: 'Costo Sessione (€)', type: 'number', placeholder: '12.50', required: false },
      { name: 'kwh_caricati', label: 'KWh Caricati', type: 'number', placeholder: '45.5', required: false }
    ]
  },
  {
    title: 'Centri di Ricarica',
    description: 'Gestione centri ricarica',
    icon: '🏢',
    fields: [
      { name: 'indirizzo', label: 'Indirizzo', type: 'text', placeholder: 'Via Bologna 123, Bologna', required: true },
      { name: 'numero_stazioni', label: 'Numero Stazioni Disponibili', type: 'number', placeholder: '8', required: true },
      { name: 'servizi', label: 'Servizi', type: 'textarea', placeholder: 'Bar, Parcheggio, WiFi, Area relax...', required: false }
    ]
  },
  {
    title: 'Stazioni di Ricarica',
    description: 'Punti di ricarica singoli',
    icon: '⚡',
    fields: [
      { name: 'tipologia_presa', label: 'Tipologia Presa', type: 'select', options: ['Type 2', 'CCS', 'CHAdeMO', 'Tesla Supercharger'], required: true },
      { name: 'gps', label: 'Coordinate GPS', type: 'text', placeholder: '44.4949, 11.3426', required: true },
      { name: 'stato_corrente', label: 'Stato Corrente', type: 'select', options: ['Disponibile', 'Occupata', 'Fuori servizio', 'In manutenzione'], required: true },
      { name: 'centro_ricarica', label: 'Centro di Ricarica', type: 'text', placeholder: 'Via Bologna 123, Bologna', required: true }
    ]
  },
  {
    title: 'Tariffe',
    description: 'Gestione tariffe servizi',
    icon: '💰',
    fields: [
      { name: 'categoria_veicolo', label: 'Categoria Veicolo', type: 'select', options: ['Auto elettrica', 'Scooter elettrico', 'Bicicletta elettrica'], required: true },
      { name: 'costo_al_minuto', label: 'Costo al Minuto (€)', type: 'number', placeholder: '0.35', required: true }
    ]
  }
])

// Methods
const activateSection = (index) => {
  activeSection.value = index
  // Don't reset selectedOperation to allow keeping the same operation across categories
  if (selectedOperation.value) {
    initializeFormData()
  }
}

const selectOperation = (operationId) => {
  selectedOperation.value = operationId
  initializeFormData()
}

const closeForm = () => {
  activeSection.value = null
  selectedOperation.value = null
  Object.keys(formData).forEach(key => delete formData[key])
}

const closeFormOnBackdrop = closeForm

const initializeFormData = () => {
  Object.keys(formData).forEach(key => delete formData[key])
  if (activeSection.value !== null && selectedOperation.value) {
    // For read operation, initialize with first 4 fields for search
    if (selectedOperation.value === 'read') {
      sections.value[activeSection.value].fields.slice(0, 4).forEach(field => {
        formData[field.name] = ''
      })
    } else {
      // For create, update, delete - initialize all fields
      sections.value[activeSection.value].fields.forEach(field => {
        formData[field.name] = ''
      })
    }
  }
}

const submitForm = async () => {
  try {
    let response
    
    // Handle Veicoli API calls
    if (activeSection.value === 0) { // Veicoli section
      response = await handleVeicoliAPI()
      
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Errore HTTP: ${response.status}`)
      }
      
      // Parse response data
      const responseData = await response.json()
      console.log('Risposta API Veicoli:', responseData)
      
    } else {
      // For other sections, use generic API structure (to be implemented later)
      response = await handleGenericAPI()
      console.log('Risposta API generica:', response)
    }
    
    showSuccessMessage()
    closeForm()
  } catch (error) {
    console.error('Errore API:', error)
    
    // Show specific error messages
    let errorMessage = 'Errore nell\'operazione'
    
    if (error.message.includes('Targa richiesta')) {
      errorMessage = 'Errore: Inserisci la targa del veicolo per continuare'
    } else if (error.message.includes('ID Veicolo o Targa richiesto')) {
      errorMessage = 'Errore: Inserisci la targa o ID del veicolo da modificare'
    } else if (error.message.includes('HTTP: 404')) {
      errorMessage = 'Errore: Veicolo non trovato'
    } else if (error.message.includes('HTTP: 409')) {
      errorMessage = 'Errore: Veicolo già esistente'
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Errore di connessione: Impossibile contattare il server'
    } else if (error.message) {
      errorMessage = `Errore: ${error.message}`
    }
    
    alert(errorMessage)
  }
}

const handleVeicoliAPI = async () => {
  const baseUrl = '/api/veicoli'
  
  switch (selectedOperation.value) {
    case 'create':
      // POST /api/veicoli
      return await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
    case 'read':
      // GET /api/veicoli with query parameters
      const params = new URLSearchParams()
      
      // Add search parameters
      if (formData.Targa) {
        params.append('targa', formData.Targa)
      }
      if (formData.Tipologia) {
        params.append('tipologia', formData.Tipologia)
      }
      if (formData.StatoAttuale) {
        params.append('stato', formData.StatoAttuale)
      }
      
      const queryString = params.toString()
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl
      
      return await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
    case 'update':
      // POST /api/veicoli/{id} for update
      if (!formData.id_veicolo && !formData.Targa) {
        throw new Error('ID Veicolo o Targa richiesto per la modifica')
      }
      
      const updateId = formData.id_veicolo || formData.Targa
      return await fetch(`${baseUrl}/${updateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
    case 'delete':
      // DELETE /api/veicoli/{id}
      if (!formData.Targa) {
        throw new Error('Targa richiesta per la cancellazione')
      }
      
      return await fetch(`${baseUrl}/${formData.Targa}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
    default:
      throw new Error('Operazione non supportata')
  }
}

const handleGenericAPI = async () => {
  // Generic API handler for other sections (placeholder)
  const apiData = {
    operation: selectedOperation.value,
    table: sections.value[activeSection.value].title.toLowerCase(),
    data: { ...formData },
    timestamp: new Date().toISOString()
  }
  
  console.log('Operazione generica inviata al backend:', apiData)
  
  // Simula chiamata API
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true, data: apiData }
}

const showSuccessMessage = () => {
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 3000)
}

const getOperationButtonText = () => {
  const operationMap = {
    'create': 'Inserisci Record',
    'read': 'Cerca Records',
    'update': 'Aggiorna Record',
    'delete': 'Elimina Record'
  }
  return operationMap[selectedOperation.value] || 'Esegui Operazione'
}
</script>

<style>
/* Import the main CSS file which includes Tailwind */
@import './assets/main.css';
</style>
