export function useApi() {
  const handleVeicoliAPI = async (operation, formData) => {
    const baseUrl = '/api/vehicles'
    
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
        
      case 'read-tipologia':
        if (!formData.Tipologia) throw new Error('Tipologia richiesta per la ricerca')
        return fetch(`${baseUrl}/type/${formData.Tipologia}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-rented':
        if (!formData.Tipologia) throw new Error('Tipologia richiesta per la ricerca')
        return fetch(`${baseUrl}/most-rented/${formData.Tipologia}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-maintenance':
        return fetch(`${baseUrl}/most-maintenance`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleNoleggiAPI = async (operation, formData) => {
    const baseUrl = '/api/rentals'
    
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

      case 'read-avg-duration':
        return fetch(`${baseUrl}/average-duration`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-km-traveled':
        return fetch(`${baseUrl}/most-km-vehicles`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-monthly-trend':
        return fetch(`${baseUrl}/monthly-trend`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleClientiAPI = async (operation, formData) => {
    const baseUrl = '/api/clients'
    
    switch (operation) {
      case 'create':
        return fetch(`${baseUrl}/register`, {
          method: 'POST',
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

      case 'read-frequent':
        return fetch(`${baseUrl}/frequent`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-with-subscription':
        return fetch(`${baseUrl}/subscribers`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-loyal':
        return fetch(`${baseUrl}/loyal`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleManutenzioniAPI = async (operation, formData) => {
    const baseUrl = '/api/maintenances'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'read-clienti-interventi':
        if (!formData.InterventoID) throw new Error('ID Intervento richiesto per la ricerca')
        return fetch(`${baseUrl}/maintenance/${formData.InterventoID}/rentals`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-expensive-interventions':
        return fetch(`${baseUrl}/average-costs`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-monthly-costs':
        return fetch(`${baseUrl}/monthly-trend`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleRicaricheAPI = async (operation, formData) => {
    const baseUrl = '/api/charges'
    
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

      case 'read-most-recharged-vehicles':
        return fetch(`${baseUrl}/most-charged-vehicles`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-active-operators':
        return fetch(`${baseUrl}/most-active-operators`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleCentriRicaricaAPI = async (operation, formData) => {
    const baseUrl = '/api/charging-centers'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

      case 'read-total-energy':
        return fetch(`${baseUrl}/total-energy`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-active-centers':
        return fetch(`${baseUrl}/most-active`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      
      case 'read-by-stations':
        return fetch(`${baseUrl}/by-stations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleStazioniRicaricaAPI = async (operation, formData) => {
    const baseUrl = '/api/charging-stations'
    
    switch (operation) {
      case 'create':
        return fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
      case 'update':
        if (!formData.ID) throw new Error('ID Stazione richiesto per la modifica')
        return fetch(`${baseUrl}/${formData.ID}/state`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

      case 'read-total-energy':
        return fetch(`${baseUrl}/total-energy`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-avg-session-duration':
        return fetch(`${baseUrl}/average-duration`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      default:
        throw new Error('Operazione non supportata')
    }
  }

  const handleTariffeAPI = async (operation, formData) => {
    const baseUrl = '/api/fares'
    
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