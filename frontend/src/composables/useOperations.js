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
  'read-centro': { id: 'read-centro', name: 'Ricerca', icon: '🗺️', color: 'bg-blue-500' },
  'read-veicoli-caricati': { id: 'read-veicoli-caricati', name: 'Veicoli Caricati', icon: '🚗⚡', color: 'bg-blue-500' },
  'read-clienti-interventi': { id: 'read-clienti-interventi', name: 'Clienti pre Intervento', icon: '👥🔧', color: 'bg-blue-500' },
  'read-veicoli-officina': { id: 'read-veicoli-officina', name: 'Veicoli per Officina', icon: '🚗🔧', color: 'bg-blue-500' },
  'read-servizi': { id: 'read-servizi', name: 'Ricerca per Servizi', icon: '🛎️', color: 'bg-blue-500' },
  'read-most-rented': { id: 'read-most-rented', name: 'Più Noleggiati', icon: '📊', color: 'bg-blue-500' },
  'read-most-maintenance': { id: 'read-most-maintenance', name: 'Più in Manutenzione', icon: '🔧', color: 'bg-blue-500' },
  'read-avg-duration': { id: 'read-avg-duration', name: 'Durata Media', icon: '⏱️', color: 'bg-blue-500' },
  'read-km-traveled': { id: 'read-km-traveled', name: 'Km Percorsi', icon: '🛣️', color: 'bg-blue-500' },
  'read-monthly-trend': { id: 'read-monthly-trend', name: 'Andamento Mensile', icon: '📈', color: 'bg-blue-500' },
  'read-frequent': { id: 'read-frequent', name: 'Clienti Frequenti', icon: '🔄', color: 'bg-blue-500' },
  'read-with-subscription': { id: 'read-with-subscription', name: 'Con Abbonamento', icon: '🔔', color: 'bg-blue-500' },
  'read-loyal': { id: 'read-loyal', name: 'Clienti Fedeli', icon: '🏅', color: 'bg-blue-500' },
  'read-expensive-interventions': { id: 'read-expensive-interventions', name: 'Interventi Costosi', icon: '💸', color: 'bg-blue-500' },
  'read-monthly-costs': { id: 'read-monthly-costs', name: 'Costi Mensili', icon: '💰', color: 'bg-blue-500' },
  'read-most-recharged-vehicles': { id: 'read-most-recharged-vehicles', name: 'Veicoli Più Ricaricati', icon: '🔋', color: 'bg-blue-500' },
  'read-most-active-operators': { id: 'read-most-active-operators', name: 'Operatori Più Attivi', icon: '👨‍🔧', color: 'bg-blue-500' },
  'read-total-energy': { id: 'read-total-energy', name: 'Energia Totale', icon: '⚡', color: 'bg-blue-500' },
  'read-most-active-centers': { id: 'read-most-active-centers', name: 'Centri Più Attivi', icon: '🏢', color: 'bg-blue-500' },
  'read-avg-session-duration': { id: 'read-avg-session-duration', name: 'Durata Media Sessione', icon: '⏱️', color: 'bg-blue-500' }
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
  'read-centro': 'Cerca Centro',
  'read-veicoli-caricati': 'Cerca Veicoli Caricati',
  'read-clienti-interventi': 'Cerca Clienti pre Intervento',
  'read-veicoli-officina': 'Cerca Veicoli per Officina',
  'read-servizi': 'Cerca per Servizi'
}

export function useOperations() {
  return {
    operationDefinitions,
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
        'read-most-rented': [{ name: 'Tipologia', 
          label: 'Tipologia', 
          type: 'select', 
          options: [
            { value: 'auto', label: 'Auto Elettrica' },
            { value: 'scooter', label: 'Scooter Elettrico' },
            { value: 'bicicletta', label: 'Bicicletta Elettrica' },
            { value: 'monopattino', label: 'Monopattino Elettrico' }
          ]
        }],
        'read-most-maintenance': [{}],
        'read-avg-duration': [{ name: 'Tipologia', 
          label: 'Tipologia', 
          type: 'select', 
          options: [
            { value: 'auto', label: 'Auto Elettrica' },
            { value: 'scooter', label: 'Scooter Elettrico' },
            { value: 'bicicletta', label: 'Bicicletta Elettrica' },
            { value: 'monopattino', label: 'Monopattino Elettrico' }
          ]
        }],
        'read-km-traveled': [{}],
        'read-monthly-trend': [{}],
        'read-frequent': [{}],
        'read-with-subscription': [{}],
        'read-loyal': [{}],
        'read-expensive-interventions': [{}],
        'read-monthly-costs': [{}],
        'read-most-recharged-vehicles': [{}],
        'read-most-active-operators': [{}],
        'read-total-energy': [{}],
        'read-most-active-centers': [{}],
        'read-avg-session-duration': [{}],
        'read-vehicle': [{ name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '123' }],
        'read-operator': [{ name: 'OperatoreAccountID', label: 'ID Operatore', type: 'number', placeholder: '456' }],
        'read-centro': [{ }],
        'read-veicoli-caricati': [{ name: 'Indirizzo', label: 'Indirizzo Centro Ricarica', type: 'text', placeholder: 'Via Bologna 123, Bologna' }],
        'read-clienti-interventi': [{ name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '123' }],
        'read-veicoli-officina': [{ name: 'OfficinaID', label: 'ID Officina', type: 'number', placeholder: '1' }],
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