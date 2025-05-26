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

      case 'read-most-rented':
        if (!formData.Tipologia) throw new Error('Tipologia richiesta per la ricerca')
        return fetch(`${baseUrl}/piu-noleggiati/${formData.Tipologia}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-maintenance':
        return fetch(`${baseUrl}/piu-manutenzione`, {
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

      case 'read-avg-duration':
        return fetch(`${baseUrl}/durata-media`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-km-traveled':
        return fetch(`${baseUrl}/veicoli-piu-km`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-monthly-trend':
        return fetch(`${baseUrl}/andamento-mensile`, {
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
        if (!formData.AccountID) throw new Error('ID Account richiesto per la ricerca')
        return fetch(`${baseUrl}/${formData.AccountID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-frequent':
        return fetch(`${baseUrl}/frequenti`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-with-subscription':
        return fetch(`${baseUrl}/abbonati`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-loyal':
        return fetch(`${baseUrl}/fedeli`, {
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
        if (!formData.InterventoID) throw new Error('ID Intervento richiesto per la ricerca')
        return fetch(`${baseUrl}/intervento/${formData.InterventoID}/clienti`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-veicoli-officina':
        if (!formData.OfficinaID) throw new Error('ID Officina richiesto per la ricerca')
        return fetch(`${baseUrl}/officina/${formData.OfficinaID}/veicoli`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-expensive-interventions':
        return fetch(`${baseUrl}/costi-medi`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-monthly-costs':
        return fetch(`${baseUrl}/andamento-mensile`, {
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

      case 'read-most-recharged-vehicles':
        return fetch(`${baseUrl}/veicoli-piu-ricaricati`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-active-operators':
        return fetch(`${baseUrl}/operatori-piu-attivi`, {
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
        if (!formData.ID) throw new Error('ID Centro richiesto per la cancellazione')
        return fetch(`${baseUrl}/${formData.ID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-centro':
        return fetch(`${baseUrl}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
      case 'read-veicoli-caricati':
        if (!formData.ID) throw new Error('ID Centro richiesto per la ricerca')
        return fetch(`${baseUrl}/${formData.ID}/veicoli`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-total-energy':
        return fetch(`${baseUrl}/energia-totale`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-most-active-centers':
        return fetch(`${baseUrl}/piu-attivi`, {
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
        return fetch(`${baseUrl}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-total-energy':
        return fetch(`${baseUrl}/energia-totale`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

      case 'read-avg-session-duration':
        return fetch(`${baseUrl}/durata-media`, {
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