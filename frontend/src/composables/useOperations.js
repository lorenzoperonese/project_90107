const operationDefinitions = {
  'create': { id: 'create', name: 'Inserimento', icon: '➕', color: 'bg-green-500' },
  'update': { id: 'update', name: 'Modifica', icon: '✏️', color: 'bg-yellow-500' },
  'update-payment': { id: 'update-payment', name: 'Modifica Pagamento', icon: '💳', color: 'bg-yellow-500' },
  'update-license': { id: 'update-license', name: 'Modifica Patente', icon: '🪪', color: 'bg-yellow-500' },
  'delete': { id: 'delete', name: 'Cancellazione', icon: '🗑️', color: 'bg-red-500' },
  'read': { id: 'read', name: 'Ricerca', icon: '👁️', color: 'bg-blue-500' },
  'read-targa': { id: 'read-targa', name: 'Ricerca per Targa', icon: '🔍', color: 'bg-blue-500' },
  'read-tipologia': { id: 'read-tipologia', name: 'Ricerca per Tipologia', icon: '🚗', color: 'bg-blue-500' },
  'read-vehicle': { id: 'read-vehicle', name: 'Storico Veicolo', icon: '🚗', color: 'bg-blue-500' },
  'read-operator': { id: 'read-operator', name: 'Storico Operatore', icon: '👤', color: 'bg-blue-500' },
  'read-zona': { id: 'read-zona', name: 'Ricerca per Zona', icon: '🗺️', color: 'bg-blue-500' },
  'read-servizi': { id: 'read-servizi', name: 'Ricerca per Servizi', icon: '🛎️', color: 'bg-blue-500' }
}

const buttonTexts = {
  'create': 'Inserisci Record',
  'update': 'Aggiorna Record',
  'update-payment': 'Aggiorna Pagamento',
  'update-license': 'Aggiorna Patente',
  'delete': 'Elimina Record',
  'read': 'Cerca Records',
  'read-targa': 'Cerca per Targa',
  'read-tipologia': 'Cerca per Tipologia',
  'read-vehicle': 'Storico Veicolo',
  'read-operator': 'Storico Operatore',
  'read-zona': 'Cerca per Zona',
  'read-servizi': 'Cerca per Servizi'
}

export function useOperations() {
  return {
    getAvailableOperations: (section) => section?.operations.map(opId => operationDefinitions[opId]) || [],
    getFormFields: (section, selectedOperation, formData = {}) => {
      if (!section) return []
      
      let fields = section.fields.filter(field => 
        !field.showOnlyFor || field.showOnlyFor.includes(selectedOperation)
      )
      
      return fields
    },
    getReadFields: (selectedOperation) => {
      const readFields = {
        'read-targa': [{ name: 'Targa', label: 'Targa', type: 'text', placeholder: 'AB123CD' }],
        'read-tipologia': [{ 
          name: 'Tipologia', 
          label: 'Tipologia', 
          type: 'select', 
          options: [
            { value: 'auto', label: 'Auto Elettrica' },
            { value: 'scooter', label: 'Scooter Elettrico' },
            { value: 'bicicletta', label: 'Bicicletta Elettrica' },
            { value: 'monopattino', label: 'Monopattino Elettrico' }
          ]
        }],
        'read-vehicle': [{ name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '123' }],
        'read-operator': [{ name: 'OperatoreAccountID', label: 'ID Operatore', type: 'number', placeholder: '456' }],
        'read-zona': [{ name: 'Zona', label: 'Zona Geografica', type: 'text', placeholder: 'Centro' }],
        'read-servizi': [{ name: 'Servizio', label: 'Servizio Accessorio', type: 'text', placeholder: 'Bar' }]
      }
      return readFields[selectedOperation] || [{ name: 'ClienteAccountID', label: 'ID Cliente', type: 'number', placeholder: '123' }]
    },
    getDeleteField: (activeSection) => {
      const deleteFields = [
        { name: 'ID', label: 'ID Veicolo', type: 'number', placeholder: '1' },
        { name: 'ID', label: 'ID', type: 'number', placeholder: '1' },
        { name: 'AccountID', label: 'ID Account Cliente', type: 'number', placeholder: '123' },
        { name: 'ID', label: 'ID', type: 'number', placeholder: '1' },
        { name: 'ID', label: 'ID', type: 'number', placeholder: '1' },
        { name: 'Indirizzo', label: 'Indirizzo Centro', type: 'text', placeholder: 'Via Bologna 123' },
        { name: 'ID', label: 'ID Stazione', type: 'number', placeholder: '1' },
        { name: 'ID', label: 'ID', type: 'number', placeholder: '1' }
      ]
      return deleteFields[activeSection] || deleteFields[0]
    },
    getOperationButtonText: (selectedOperation) => buttonTexts[selectedOperation] || 'Esegui Operazione'
  }
} 