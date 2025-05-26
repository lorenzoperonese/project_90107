-- ============================================================================
-- INIT.SQL - Dati iniziali per il database del sistema di noleggio veicoli
-- ============================================================================

-- Inserimento delle tariffe per le 4 tipologie di veicoli
INSERT INTO Tariffa (CategoriaVeicolo, CostoAlMinuto) VALUES
('auto', 0.45),
('scooter', 0.25),
('bicicletta', 0.15),
('monopattino', 0.20);

-- Inserimento degli account per gli operatori di ricarica (Dipendente = TRUE)
INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente) VALUES
('operatore1@company.com', 'password123', '+39 320 1234567', 'attivo', TRUE),
('operatore2@company.com', 'password123', '+39 320 1234568', 'attivo', TRUE),
('operatore3@company.com', 'password123', '+39 320 1234569', 'attivo', TRUE),
('operatore4@company.com', 'password123', '+39 320 1234570', 'attivo', TRUE),
('operatore5@company.com', 'password123', '+39 320 1234571', 'attivo', TRUE);

-- Inserimento degli account per gli addetti al call center (Dipendente = TRUE)
INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente) VALUES
('callcenter1@company.com', 'password123', '+39 320 2234567', 'attivo', TRUE),
('callcenter2@company.com', 'password123', '+39 320 2234568', 'attivo', TRUE),
('callcenter3@company.com', 'password123', '+39 320 2234569', 'attivo', TRUE),
('callcenter4@company.com', 'password123', '+39 320 2234570', 'attivo', TRUE),
('callcenter5@company.com', 'password123', '+39 320 2234571', 'attivo', TRUE);

-- Inserimento dei 5 operatori addetti alla ricarica
-- Gli ID degli account saranno 1, 2, 3, 4, 5 (primi 5 inseriti)
INSERT INTO OperatoreRicarica (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio) VALUES
(1, 'Marco', 'Bianchi', '1985-03-15', 'Bologna, BO', 'Via delle Ricariche 10, Bologna', 1800.00),
(2, 'Giulia', 'Verdi', '1990-07-22', 'Milano, MI', 'Via Energia 25, Milano', 1850.00),
(3, 'Alessandro', 'Rossi', '1988-11-08', 'Roma, RM', 'Via Elettrica 5, Roma', 1750.00),
(4, 'Francesca', 'Neri', '1992-01-30', 'Torino, TO', 'Via Voltaggio 15, Torino', 1900.00),
(5, 'Davide', 'Gialli', '1987-09-12', 'Napoli, NA', 'Via Corrente 8, Napoli', 1800.00);

-- Inserimento dei 5 addetti al call center
-- Gli ID degli account saranno 6, 7, 8, 9, 10 (secondi 5 inseriti)
INSERT INTO AddettoCallCenter (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio) VALUES
(6, 'Laura', 'Blu', '1989-05-18', 'Firenze, FI', 'Via Assistenza 12, Firenze', 1600.00),
(7, 'Matteo', 'Viola', '1991-12-03', 'Venezia, VE', 'Via Supporto 20, Venezia', 1650.00),
(8, 'Chiara', 'Rosa', '1986-08-25', 'Palermo, PA', 'Via Aiuto 7, Palermo', 1550.00),
(9, 'Simone', 'Arancio', '1993-04-14', 'Genova, GE', 'Via Servizio 18, Genova', 1700.00),
(10, 'Elena', 'Marrone', '1990-10-07', 'Bari, BA', 'Via Consulenza 3, Bari', 1600.00);

-- Inserimento di alcuni centri di ricarica di esempio
INSERT INTO CentroRicarica (Indirizzo, NumeroStazioniDisponibili) VALUES
('Via Bologna 123, Bologna', 8),
('Piazza Duomo 45, Milano', 12),
('Via del Corso 78, Roma', 10),
('Via Po 56, Torino', 6),
('Via Chiaia 34, Napoli', 9);

-- Inserimento di alcune stazioni di ricarica collegate ai centri
INSERT INTO StazioneRicarica (TipologiaPresa, GPS, StatoCorrente, CentroRicaricaIndirizzo) VALUES
('Type 2', ST_PointFromText('POINT(11.3426 44.4949)'), 'libera', 'Via Bologna 123, Bologna'),
('CCS Combo', ST_PointFromText('POINT(11.3430 44.4955)'), 'libera', 'Via Bologna 123, Bologna'),
('CHAdeMO', ST_PointFromText('POINT(9.1900 45.4642)'), 'libera', 'Piazza Duomo 45, Milano'),
('Type 2', ST_PointFromText('POINT(9.1905 45.4648)'), 'occupata', 'Piazza Duomo 45, Milano'),
('CCS Combo', ST_PointFromText('POINT(12.4964 41.9028)'), 'libera', 'Via del Corso 78, Roma');

-- Inserimento di alcuni veicoli di esempio
INSERT INTO Veicolo (Targa, Tipologia, Modello, Marca, PercentualeBatteria, GPS, StatoAttuale, ScadenzaRevisione, NumeroPolizzaAssicurativa, NumeroPosti, DataImmatricolazione, ChilometraggioTotale) VALUES
('AB123CD', 'auto', 'Model 3', 'Tesla', 85, ST_PointFromText('POINT(11.3426 44.4949)'), 'disponibile', '2025-06-15', 'POL123456789', 5, '2022-03-10', 15000),
('EF456GH', 'scooter', 'Vespa Elettrica', 'Piaggio', 92, ST_PointFromText('POINT(9.1900 45.4642)'), 'disponibile', '2025-08-20', 'POL987654321', 2, '2023-01-15', 8500),
('IJ789KL', 'auto', 'e-Golf', 'Volkswagen', 78, ST_PointFromText('POINT(12.4964 41.9028)'), 'in_ricarica', '2025-12-10', 'POL456789123', 5, '2021-11-05', 22000);

INSERT INTO Veicolo (Tipologia, Modello, Marca, PercentualeBatteria, GPS, StatoAttuale, NumeroPolizzaAssicurativa) VALUES
('bicicletta', 'E-Bike City', 'Bianchi', 65, ST_PointFromText('POINT(7.6869 45.0703)'), 'disponibile', 'POL111222333'),
('monopattino', 'Mi Electric Scooter', 'Xiaomi', 88, ST_PointFromText('POINT(14.2681 40.8518)'), 'disponibile', 'POL444555666');

-- Inserimento di alcune ricariche di esempio per testare la nuova funzionalità
INSERT INTO Ricarica (OperatoreAccountID, VeicoloID, StazioneRicaricaID, DataInizio, DataFine, CostoSessione, KWhCaricati) VALUES
(1, 1, 1, '2024-01-15 10:30:00', '2024-01-15 12:15:00', 15.50, 35.2),
(2, 2, 3, '2024-01-16 14:20:00', '2024-01-16 15:45:00', 8.75, 18.5),
(3, 3, 5, '2024-01-17 09:15:00', '2024-01-17 11:30:00', 22.30, 48.7),
(1, 1, 2, '2024-01-18 16:45:00', '2024-01-18 18:20:00', 18.25, 41.3),
(4, 2, 1, '2024-01-19 11:10:00', '2024-01-19 12:40:00', 9.50, 20.1);

-- Inserimento di alcuni abbonamenti
INSERT INTO Abbonamento (Durata, Costo) VALUES
('giornaliero', 9.99),
('settimanale', 49.99),
('mensile', 149.99);

-- Inserimento di alcune officine
INSERT INTO Officina (Nome, Indirizzo, NumeroTelefono) VALUES
('Officina Elettrica Bologna', 'Via Riparazione 15, Bologna', '+39 051 1234567'),
('Service Point Milano', 'Via Manutenzione 22, Milano', '+39 02 9876543'),
('Centro Assistenza Roma', 'Via Tecnica 8, Roma', '+39 06 5555555');

-- Inserimento di alcuni clienti di esempio per testare la nuova funzionalità
INSERT INTO Documento (Numero, Scadenza, EnteRilascio) VALUES
('CI123456789', '2030-12-31', 'Comune di Bologna'),
('CI987654321', '2029-06-15', 'Comune di Milano'),
('CI456789123', '2031-03-20', 'Comune di Roma');

INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente) VALUES
('cliente1@email.com', 'password123', '+39 320 3334567', 'attivo', FALSE),
('cliente2@email.com', 'password123', '+39 320 3334568', 'attivo', FALSE),
('cliente3@email.com', 'password123', '+39 320 3334569', 'attivo', FALSE);

INSERT INTO Cliente (AccountID, Nome, Cognome, DataNascita, LuogoNascita, IndirizzoResidenza, DocumentoNumero) VALUES
(11, 'Mario', 'Rossi', '1985-05-15', 'Bologna, BO', 'Via Cliente 10, Bologna', 'CI123456789'),
(12, 'Giulia', 'Bianchi', '1990-08-22', 'Milano, MI', 'Via Cliente 20, Milano', 'CI987654321'),
(13, 'Luca', 'Verdi', '1988-12-03', 'Roma, RM', 'Via Cliente 30, Roma', 'CI456789123');

-- Inserimento di alcuni noleggi di esempio
INSERT INTO Noleggia (ClienteAccountID, VeicoloID, DataInizio, DataFine, GPSInizio, GPSFine, ChilometriPercorsi, Costo, DurataMinuti, EsitoPagamento) VALUES
(11, 1, '2024-01-10 09:00:00', '2024-01-10 11:30:00', ST_PointFromText('POINT(11.3426 44.4949)'), ST_PointFromText('POINT(11.3500 44.5000)'), 15, 67.50, 150, 'successo'),
(12, 1, '2024-01-12 14:00:00', '2024-01-12 16:45:00', ST_PointFromText('POINT(11.3426 44.4949)'), ST_PointFromText('POINT(11.3300 44.4900)'), 22, 123.75, 165, 'successo'),
(13, 2, '2024-01-14 10:30:00', '2024-01-14 12:00:00', ST_PointFromText('POINT(9.1900 45.4642)'), ST_PointFromText('POINT(9.2000 45.4700)'), 8, 22.50, 90, 'successo'),
(11, 2, '2024-01-16 15:15:00', '2024-01-16 17:30:00', ST_PointFromText('POINT(9.1900 45.4642)'), ST_PointFromText('POINT(9.1800 45.4600)'), 12, 33.75, 135, 'successo'),
(12, 3, '2024-01-18 08:45:00', '2024-01-18 10:15:00', ST_PointFromText('POINT(12.4964 41.9028)'), ST_PointFromText('POINT(12.5000 41.9100)'), 18, 81.00, 90, 'successo');

-- Inserimento di alcuni interventi di manutenzione di esempio
INSERT INTO EsegueIntervento (VeicoloID, OfficinaID, Data, Costo, Tipologia, Descrizione) VALUES
(1, 1, '2024-01-20 09:00:00', 150.00, 'Manutenzione', 'Controllo batteria e sistema elettrico'),
(2, 2, '2024-01-22 14:30:00', 85.00, 'Manutenzione', 'Sostituzione pneumatici'),
(3, 3, '2024-01-25 11:15:00', 220.00, 'Manutenzione', 'Aggiornamento software e controllo freni');

-- Inserimento di alcune revisioni di esempio
INSERT INTO EsegueRevisione (VeicoloID, OfficinaID, Data, Costo, Note) VALUES
(1, 1, '2024-01-28 10:00:00', 75.00, 'Revisione periodica - tutto regolare'),
(2, 2, '2024-01-30 15:45:00', 80.00, 'Revisione con piccole correzioni necessarie');

COMMIT; 