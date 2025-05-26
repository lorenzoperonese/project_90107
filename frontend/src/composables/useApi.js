export function useApi() {
  const handleVeicoliAPI = async (operation, formData) => {
    const baseUrl = '/api/veicoli'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update':
        if (!formData.ID) throw new Error('ID Veicolo richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.ID}/state`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'delete':
        if (!formData.ID) throw new Error('ID Veicolo richiesto per la cancellazione')
        return fetch(`${baseUrl}/${formData.ID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-targa':
        if (!formData.Targa) throw new Error('Targa richiesta per la ricerca')
        return fetch(`${baseUrl}/targa/${formData.Targa}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-tipologia':
        if (!formData.Tipologia) throw new Error('Tipologia richiesta per la ricerca')
        return fetch(`${baseUrl}/tipologia/${formData.Tipologia}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleNoleggiAPI = async (operation, formData) => {
    const baseUrl = '/api/noleggi'
    
    switch (operation) {
      case 'create':
        return fetch(`${baseUrl}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update':
        if (!formData.ID) throw new Error('ID Noleggio richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.ID}/end`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'read':
        if (!formData.ClienteAccountID) throw new Error('ID Cliente richiesto per la ricerca')
        return fetch(`${baseUrl}/cliente/${formData.ClienteAccountID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleClientiAPI = async (operation, formData) => {
    const baseUrl = '/api/clienti'
    
    switch (operation) {
      case 'create':
        return fetch(`${baseUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update-payment':
        if (!formData.AccountID) throw new Error('ID Account richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.AccountID}/payment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update-license':
        if (!formData.AccountID) throw new Error('ID Account richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.AccountID}/license`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'delete':
        if (!formData.AccountID) throw new Error('ID Account richiesto per la cancellazione')
        return fetch(`${baseUrl}/${formData.AccountID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read':
        if (!formData.ClienteAccountID) throw new Error('ID Account richiesto per la ricerca')
        return fetch(`${baseUrl}/${formData.ClienteAccountID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleManutenzioniAPI = async (operation, formData) => {
    const baseUrl = '/api/manutenzioni'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'read-clienti-interventi':
        if (!formData.VeicoloID) throw new Error('ID Veicolo richiesto per la ricerca')
        return fetch(`${baseUrl}/veicolo/${formData.VeicoloID}/clienti`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-veicoli-officina':
        if (!formData.OfficinaID) throw new Error('ID Officina richiesto per la ricerca')
        return fetch(`${baseUrl}/officina/${formData.OfficinaID}/veicoli`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleRicaricheAPI = async (operation, formData) => {
    const baseUrl = '/api/ricariche'
    
    switch (operation) {
      case 'create':
        return fetch(`${baseUrl}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update':
        if (!formData.ID) throw new Error('ID Ricarica richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.ID}/end`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'read-vehicle':
        if (!formData.VeicoloID) throw new Error('ID Veicolo richiesto per la ricerca')
        return fetch(`${baseUrl}/veicolo/${formData.VeicoloID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-operator':
        if (!formData.OperatoreAccountID) throw new Error('ID Operatore richiesto per la ricerca')
        return fetch(`${baseUrl}/operatore/${formData.OperatoreAccountID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleCentriRicaricaAPI = async (operation, formData) => {
    const baseUrl = '/api/centri-ricarica'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'delete':
        if (!formData.Indirizzo) throw new Error('Indirizzo richiesto per la cancellazione')
        return fetch(`${baseUrl}/${encodeURIComponent(formData.Indirizzo)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-centro':
        return fetch(`${baseUrl}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-veicoli-caricati':
        if (!formData.Indirizzo) throw new Error('Indirizzo centro richiesto per la ricerca')
        return fetch(`${baseUrl}/${encodeURIComponent(formData.Indirizzo)}/veicoli`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleStazioniRicaricaAPI = async (operation, formData) => {
    const baseUrl = '/api/stazioni-ricarica'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update':
        if (!formData.ID) throw new Error('ID Stazione richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.ID}/stato`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'delete':
        if (!formData.ID) throw new Error('ID Stazione richiesto per la cancellazione')
        return fetch(`${baseUrl}/${formData.ID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read':
        if (!formData.Zona) throw new Error('Zona richiesta per la ricerca')
        return fetch(`${baseUrl}/zona/${formData.Zona}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleTariffeAPI = async (operation, formData) => {
    const baseUrl = '/api/tariffe'
    
    switch (operation) {
      case 'update':
        if (!formData.CategoriaVeicolo) throw new Error('Categoria Veicolo richiesta per la modifica')
        return fetch(`${baseUrl}/${encodeURIComponent(formData.CategoriaVeicolo)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const apiHandlers = [
    handleVeicoliAPI,
    handleNoleggiAPI,
    handleClientiAPI,
    handleManutenzioniAPI,
    handleRicaricheAPI,
    handleCentriRicaricaAPI,
    handleStazioniRicaricaAPI,
    handleTariffeAPI
  ]

  const submitForm = async (activeSection, selectedOperation, formData) => {
    try {
      const handler = apiHandlers[activeSection]
      if (!handler) throw new Error('Sezione non supportata')
      
      const response = await handler(selectedOperation, formData)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Errore HTTP: ${response.status}`)
      }
      
      const responseData = await response.json()
      console.log('Risposta API:', responseData)
      
      return { success: true, data: responseData }
    } catch (error) {
      console.error('Errore API:', error)
      
      let errorMessage = 'Errore nell\'operazione'
      
      if (error.message.includes('ID') && error.message.includes('richiesto')) {
        errorMessage = 'Errore: Inserisci l\'ID richiesto per continuare'
      } else if (error.message.includes('HTTP: 404')) {
        errorMessage = 'Errore: Record non trovato'
      } else if (error.message.includes('HTTP: 409')) {
        errorMessage = 'Errore: Record già esistente'
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Errore di connessione: Impossibile contattare il server'
      } else if (error.message) {
        errorMessage = `Errore: ${error.message}`
      }
      
      return { success: false, error: errorMessage }
    }
  }

  return {
    submitForm
  }
} 