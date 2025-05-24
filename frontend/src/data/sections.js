export const sections = [
  {
    title: 'Veicoli',
    description: 'Gestione flotta veicoli',
    icon: '🚗',
    operations: ['create', 'update', 'delete', 'read-targa', 'read-tipologia'],
    fields: [
      { name: 'ID', label: 'ID Veicolo', type: 'number', placeholder: '1', required: false, showOnlyFor: ['update', 'delete'] },
      { 
        name: 'Tipologia', 
        label: 'Tipologia Veicolo', 
        type: 'select', 
        options: [
          { value: 'auto', label: 'Auto Elettrica' },
          { value: 'scooter', label: 'Scooter Elettrico' },
          { value: 'bicicletta', label: 'Bicicletta Elettrica' },
          { value: 'monopattino', label: 'Monopattino Elettrico' }
        ], 
        required: true, 
        showOnlyFor: ['create']
      },
      { name: 'Targa', label: 'Targa', type: 'text', placeholder: 'AB123CD', required: true, showOnlyFor: ['create' ], requiresVehicleType: ['auto', 'scooter'] },
      { name: 'ScadenzaRevisione', label: 'Scadenza Revisione', type: 'date', required: true, showOnlyFor: ['create'], requiresVehicleType: ['auto', 'scooter'] },
      { name: 'NumeroPolizzaAssicurativa', label: 'Numero Polizza Assicurativa', type: 'text', placeholder: 'POL123456789', required: true, showOnlyFor: ['create'], requiresVehicleType: ['auto', 'scooter'] },
      { name: 'Modello', label: 'Modello', type: 'text', placeholder: 'Model S', required: true, showOnlyFor: ['create'] },
      { name: 'Marca', label: 'Marca', type: 'text', placeholder: 'Tesla', required: true, showOnlyFor: ['create'] },
      { name: 'NumeroPosti', label: 'Numero Posti', type: 'number', placeholder: '5', required: true, showOnlyFor: ['create'], requiresVehicleType: ['auto', 'scooter'] },
      { name: 'DataImmatricolazione', label: 'Data Immatricolazione', type: 'date', required: true, showOnlyFor: ['create'], requiresVehicleType: ['auto', 'scooter'] },
      { name: 'PercentualeBatteria', label: 'Percentuale Batteria (%)', type: 'number', placeholder: '85', required: true, showOnlyFor: ['create', 'update'] },
      { name: 'gpsQuery', label: 'Coordinate GPS', type: 'text', placeholder: '44.4949, 11.3426', required: true, showOnlyFor: ['create', 'update'] },
      { name: 'StatoAttuale', label: 'Stato Attuale', type: 'select', options: ['disponibile', 'in_uso', 'in_ricarica', 'fuori_servizio'], required: true, showOnlyFor: ['create', 'update'] },
      { name: 'ChilometraggioTotale', label: 'Chilometraggio Totale (km)', type: 'number', placeholder: '15000', required: true, showOnlyFor: ['create', 'update'], requiresVehicleType: ['auto', 'scooter'] }
    ]
  },
  {
    title: 'Noleggi',
    description: 'Gestione noleggi',
    icon: '📋',
    operations: ['create', 'update', 'read'],
    fields: [
      { name: 'ID', label: 'ID Noleggio', type: 'number', placeholder: '1', required: true, showOnlyFor: ['update'] },
      { name: 'ClienteAccountID', label: 'ID Account Cliente', type: 'number', placeholder: '123', required: true, showOnlyFor: ['create'] },
      { name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '456', required: true, showOnlyFor: ['create'] },
      { name: 'GPSInizio', label: 'GPS Inizio', type: 'text', placeholder: '44.4949, 11.3426', required: true, showOnlyFor: ['create'] },
      { name: 'GPSFine', label: 'GPS Fine', type: 'text', placeholder: '44.4949, 11.3426', required: true, showOnlyFor: ['update'] },
      { name: 'ChilometriPercorsi', label: 'Chilometri Percorsi', type: 'number', placeholder: '25', required: true, showOnlyFor: ['update'] },
      { name: 'EsitoPagamento', label: 'Esito Pagamento', type: 'select', options: ['successo', 'fallito', 'in_attesa'], required: true, showOnlyFor: ['update'] }
    ]
  },
  {
    title: 'Clienti',
    description: 'Gestione clienti',
    icon: '👥',
    operations: ['create', 'update-payment', 'update-license', 'delete', 'read'],
    fields: [
      { name: 'AccountID', label: 'ID Account', type: 'number', placeholder: '123', required: false, showOnlyFor: ['update-payment', 'update-license', 'delete', 'read'] },
      { name: 'Nome', label: 'Nome', type: 'text', placeholder: 'Mario', required: true, showOnlyFor: ['create'] },
      { name: 'Cognome', label: 'Cognome', type: 'text', placeholder: 'Rossi', required: true, showOnlyFor: ['create'] },
      { name: 'DataNascita', label: 'Data di Nascita', type: 'date', required: true, showOnlyFor: ['create'] },
      { name: 'LuogoNascita', label: 'Luogo di Nascita', type: 'text', placeholder: 'Bologna, BO', required: true, showOnlyFor: ['create'] },
      { name: 'IndirizzoResidenza', label: 'Indirizzo Residenza', type: 'text', placeholder: 'Via Roma 123, Bologna', required: true, showOnlyFor: ['create'] },
      { name: 'PatenteNumero', label: 'Numero Patente', type: 'text', placeholder: 'BO1234567A', required: false, showOnlyFor: ['update-license'] },
      { name: 'PatenteScadenza', label: 'Scadenza Patente', type: 'date', required: true, showOnlyFor: ['update-license'] },
      { name: 'PatenteEnteRilascio', label: 'Ente Rilascio Patente', type: 'text', placeholder: 'Comune di Bologna', required: true, showOnlyFor: ['update-license'] },
      { name: 'PatenteDataRilascio', label: 'Data Rilascio Patente', type: 'date', required: true, showOnlyFor: ['update-license'] },
      { name: 'PatenteTipo', label: 'Tipo Patente', type: 'select', options: ['A', 'B'] , required: true, showOnlyFor: ['update-license'] },
      { name: 'DocumentoNumero', label: 'Numero Documento', type: 'text', placeholder: 'CI123456789', required: true, showOnlyFor: ['create'] },
      { name: 'DocumentoScadenza', label: 'Scadenza Documento', type: 'date', required: true, showOnlyFor: ['create'] },
      { name: 'EnteRilascioDocumento', label: 'Ente Rilascio Documento', type: 'text', placeholder: 'Comune di Bologna', required: true, showOnlyFor: ['create'] },
      { name: 'Email', label: 'Email', type: 'email', placeholder: 'mario.rossi@email.com', required: true, showOnlyFor: ['create'] },
      { name: 'Password', label: 'Password', type: 'password', placeholder: '********', required: true, showOnlyFor: ['create'] },
      { name: 'Telefono', label: 'Telefono', type: 'text', placeholder: '+39 123 456 7890', required: false, showOnlyFor: ['create'] },
      { name: 'NumeroCarta', label: 'Numero Carta di Credito', type: 'text', placeholder: '1234 5678 9012 3456', required: false, showOnlyFor: ['update-payment'] },
      { name: 'Scadenza', label: 'Scadenza Carta di Credito', type: 'date', required: false, showOnlyFor: ['update-payment'] },
      { name: 'CVV', label: 'CVV Carta di Credito', type: 'text', placeholder: '123', required: false, showOnlyFor: ['update-payment'] },
      { name: 'Intestatario', label: 'Intestatario Carta di Credito', type: 'text', placeholder: 'Mario Rossi', required: false, showOnlyFor: ['update-payment'] }
    ]
  },
  {
    title: 'Manutenzioni',
    description: 'Gestione manutenzioni',
    icon: '🔧',
    operations: ['create', 'read'],
    fields: [
      { name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '123', required: true },
      { name: 'TipoIntervento', label: 'Tipo Intervento', type: 'text', placeholder: 'Revisione', required: true, showOnlyFor: ['create'] },
      { name: 'DataIntervento', label: 'Data Intervento', type: 'date', required: false, showOnlyFor: ['create'] },
      { name: 'Descrizione', label: 'Descrizione', type: 'textarea', placeholder: 'Descrizione intervento...', required: false, showOnlyFor: ['create'] },
      { name: 'Costo', label: 'Costo (€)', type: 'number', placeholder: '150.00', required: false, showOnlyFor: ['create'] },
      { name: 'OperatoreAccountID', label: 'ID Account Operatore', type: 'number', placeholder: '456', required: false, showOnlyFor: ['create'] }
    ]
  },
  {
    title: 'Ricariche',
    description: 'Gestione ricariche',
    icon: '🔋',
    operations: ['create', 'update', 'read-vehicle', 'read-operator'],
    fields: [
      { name: 'ID', label: 'ID Ricarica', type: 'number', placeholder: '1', required: false, showOnlyFor: ['update'] },
      { name: 'OperatoreAccountID', label: 'ID Account Operatore', type: 'number', placeholder: '456', required: true, showOnlyFor: ['create', 'read-operator'] },
      { name: 'VeicoloID', label: 'ID Veicolo', type: 'number', placeholder: '789', required: true, showOnlyFor: ['create', 'read-vehicle'] },
      { name: 'StazioneRicaricaID', label: 'ID Stazione Ricarica', type: 'number', placeholder: '12', required: true, showOnlyFor: ['create'] },
      { name: 'CostoSessione', label: 'Costo Sessione (€)', type: 'number', placeholder: '12.50', required: false, showOnlyFor: ['update'] },
      { name: 'KWhCaricati', label: 'KWh Caricati', type: 'number', placeholder: '45.5', required: false, showOnlyFor: ['update'] }
    ]
  },
  {
    title: 'Centri di Ricarica',
    description: 'Gestione centri ricarica',
    icon: '🏢',
    operations: ['create', 'delete', 'read-centro'],
    fields: [
      { name: 'Indirizzo', label: 'Indirizzo', type: 'text', placeholder: 'Via Bologna 123, Bologna', required: true },
      
    ]
  },
  {
    title: 'Stazioni di Ricarica',
    description: 'Gestione stazioni ricarica',
    icon: '⚡',
    operations: ['create', 'update', 'delete', 'read'],
    fields: [
      { name: 'ID', label: 'ID Stazione', type: 'number', placeholder: '1', required: false, showOnlyFor: ['update', 'delete'] },
      { name: 'TipologiaPresa', label: 'Tipologia Presa', type: 'text', placeholder: 'Type 2', required: true, showOnlyFor: ['create'] },
      { name: 'GPS', label: 'Coordinate GPS', type: 'text', placeholder: '44.4949, 11.3426', required: true, showOnlyFor: ['create'] },
      { name: 'StatoCorrente', label: 'Stato Corrente', type: 'select', options: ['libera', 'occupata', 'in_manutenzione', 'fuori_servizio'], required: true },
      { name: 'CentroRicaricaIndirizzo', label: 'Indirizzo Centro Ricarica', type: 'text', placeholder: 'Via Bologna 123, Bologna', required: false, showOnlyFor: ['create'] },
      
    ]
  },
  {
    title: 'Tariffe',
    description: 'Gestione tariffe',
    icon: '💰',
    operations: ['update'],
    fields: [
      { name: 'CategoriaVeicolo', label: 'Categoria Veicolo', type: 'select', options: ['auto', 'scooter', 'bicicletta', 'monopattino'], required: true },
      { name: 'CostoAlMinuto', label: 'Costo al Minuto (€)', type: 'number', placeholder: '0.35', required: true }
    ]
  }
] 