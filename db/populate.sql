-- Disattiva temporaneamente i controlli di foreign key per facilitare l'inserimento dei dati
SET FOREIGN_KEY_CHECKS = 0;

-- Inserimento Tariffe
INSERT INTO Tariffa VALUES 
('auto', 0.35),
('scooter', 0.25),
('bicicletta', 0.12),
('monopattino', 0.10);

-- Inserimento Metodi di Pagamento
INSERT INTO MetodoPagamento VALUES
(1, '4111111111111111', 'Mario Rossi', '123', '2025-05-31'),
(2, '5555555555554444', 'Luigi Verdi', '456', '2024-11-30'),
(3, '3700000000000002', 'Anna Bianchi', '789', '2026-02-28'),
(4, '6011000990139424', 'Giovanni Neri', '321', '2024-12-31'),
(5, '3566002020360505', 'Elena Gialli', '654', '2025-08-31');

-- Inserimento Account
INSERT INTO Account VALUES
(1, 'mario.rossi@email.com', 'password123', '3331234567', 'attivo', FALSE, '4111111111111111', '2022-01-10'),
(2, 'luigi.verdi@email.com', 'securepass', '3332345678', 'attivo', FALSE, '5555555555554444', '2022-02-15'),
(3, 'anna.bianchi@email.com', 'annapass', '3333456789', 'attivo', FALSE, '3700000000000002', '2022-03-20'),
(4, 'giovanni.neri@email.com', 'giopass', '3334567890', 'attivo', FALSE, '6011000990139424', '2022-04-25'),
(5, 'elena.gialli@email.com', 'elenapass', '3335678901', 'attivo', FALSE, '3566002020360505', '2022-05-30'),
(6, 'operator1@mobility.com', 'op123pass', '3336789012', 'attivo', TRUE, NULL, '2022-01-05'),
(7, 'operator2@mobility.com', 'op456pass', '3337890123', 'attivo', TRUE, NULL, '2022-01-06'),
(8, 'callcenter1@mobility.com', 'cc123pass', '3338901234', 'attivo', TRUE, NULL, '2022-01-07'),
(9, 'callcenter2@mobility.com', 'cc456pass', '3339012345', 'attivo', TRUE, NULL, '2022-01-08'),
(10, 'blocked.user@email.com', 'blockedpass', '3330123456', 'bloccato', FALSE, NULL, '2022-06-05');

-- Inserimento Documenti
INSERT INTO Documento VALUES
('AB123456', '2030-05-15', 'Comune di Roma'),
('CD789012', '2029-07-20', 'Comune di Milano'),
('EF345678', '2031-03-10', 'Comune di Napoli'),
('GH901234', '2028-09-25', 'Comune di Torino'),
('IJ567890', '2032-11-30', 'Comune di Firenze'),
('KL123456', '2019-12-31', 'Comune di Bologna'); -- Documento scaduto per test

-- Inserimento Patenti
INSERT INTO Patente VALUES
('PAT123456', '2028-08-15', 'Motorizzazione Roma', '2008-08-15', TRUE),
('PAT789012', '2027-10-20', 'Motorizzazione Milano', '2012-10-20', TRUE),
('PAT345678', '2029-04-10', 'Motorizzazione Napoli', '2014-04-10', FALSE), -- Solo scooter
('PAT901234', '2026-06-25', 'Motorizzazione Torino', '2016-06-25', TRUE),
('PAT567890', '2019-02-28', 'Motorizzazione Firenze', '2009-02-28', TRUE); -- Patente scaduta per test

-- Inserimento Clienti (con età > 18 anni)
INSERT INTO Cliente VALUES
(1, 'Mario', 'Rossi', '1990-05-15', 'Roma', 'Via Roma 123, Roma', 'PAT123456', 'AB123456'),
(2, 'Luigi', 'Verdi', '1985-07-20', 'Milano', 'Via Milano 456, Milano', 'PAT789012', 'CD789012'),
(3, 'Anna', 'Bianchi', '1995-03-10', 'Napoli', 'Via Napoli 789, Napoli', 'PAT345678', 'EF345678'),
(4, 'Giovanni', 'Neri', '1980-09-25', 'Torino', 'Via Torino 101, Torino', 'PAT901234', 'GH901234'),
(5, 'Elena', 'Gialli', '1992-11-30', 'Firenze', 'Via Firenze 202, Firenze', NULL, 'IJ567890'),
(10, 'Utente', 'Bloccato', '1988-06-05', 'Bologna', 'Via Bologna 303, Bologna', NULL, 'KL123456');

-- Inserimento Operatori Ricarica
INSERT INTO OperatoreRicarica VALUES
(6, 'Marco', 'Operatore', '1991-04-12', 'Pisa', 'Via Pisa 404, Pisa', 2000.00),
(7, 'Laura', 'Tecnico', '1989-08-22', 'Genova', 'Via Genova 505, Genova', 2100.00);

-- Inserimento Addetti Call Center
INSERT INTO AddettoCallCenter VALUES
(8, 'Paolo', 'Supporto', '1993-02-18', 'Venezia', 'Via Venezia 606, Venezia', 1800.00),
(9, 'Giulia', 'Assistenza', '1994-11-05', 'Palermo', 'Via Palermo 707, Palermo', 1850.00);

-- Inserimento Abbonamenti
INSERT INTO Abbonamento VALUES
('giornaliero', 9.99),
('settimanale', 39.99),
('mensile', 99.99);

-- Inserimento Officine
INSERT INTO Officina VALUES
(1, 'Officina Centrale', 'Via Meccanici 10, Roma', '06123456'),
(2, 'Riparazioni Veloci', 'Via Ingranaggi 20, Milano', '02654321'),
(3, 'Autofficina del Sole', 'Corso Motori 30, Napoli', '081123987');

-- Inserimento Centri Ricarica
INSERT INTO CentroRicarica VALUES
(1, 'Via Energia 50, Roma', 5),
(2, 'Via Batteria 60, Milano', 3),
(3, 'Via Elettrica 70, Torino', 4);

-- Inserimento Veicoli
-- Auto
INSERT INTO Veicolo VALUES
(1, 'AB123CD', '2024-12-31', 'POL12345', 'Model 3', 'Tesla', 5, '2022-01-15', 100, POINT(41.9027, 12.4963), 'disponibile', 5000, 'auto'),
(2, 'EF456GH', '2024-10-15', 'POL23456', 'ID.4', 'Volkswagen', 5, '2022-02-20', 80, POINT(45.4642, 9.1900), 'disponibile', 7500, 'auto'),
(3, 'IL789MN', '2025-03-22', 'POL34567', 'Leaf', 'Nissan', 5, '2022-03-10', 50, POINT(40.8518, 14.2681), 'disponibile', 10200, 'auto'),
(4, 'OP012QR', '2024-08-07', 'POL45678', 'Kona Electric', 'Hyundai', 5, '2022-04-05', 15, POINT(45.0703, 7.6869), 'disponibile', 12000, 'auto');

-- Scooter
INSERT INTO Veicolo VALUES
(5, 'ST345UV', '2024-11-18', 'POL56789', 'CE 04', 'BMW', 2, '2022-05-12', 90, POINT(43.7696, 11.2558), 'disponibile', 3000, 'scooter'),
(6, 'WX678YZ', '2025-01-25', 'POL67890', 'S01', 'Silence', 2, '2022-06-18', 75, POINT(41.9027, 12.5000), 'in_ricarica', 4500, 'scooter'),
(7, 'AB901CD', '2024-09-30', 'POL78901', 'eScooter', 'Piaggio', 2, '2022-07-22', 10, POINT(45.4642, 9.2000), 'fuori_servizio', 6800, 'scooter');

-- Biciclette
INSERT INTO Veicolo VALUES
(8, NULL, NULL, 'POL89012', 'City Bike', 'Trek', 1, NULL, 100, POINT(40.8518, 14.2700), 'disponibile', 2000, 'bicicletta'),
(9, NULL, NULL, 'POL90123', 'Urban Rider', 'Specialized', 1, NULL, 85, POINT(45.0703, 7.6900), 'disponibile', 3200, 'bicicletta'),
(10, NULL, NULL, 'POL01234', 'Commuter', 'Cannondale', 1, NULL, 25, POINT(43.7696, 11.2600), 'disponibile', 4100, 'bicicletta');

-- Monopattini
INSERT INTO Veicolo VALUES
(11, NULL, NULL, 'POL12340', 'Pro 2', 'Xiaomi', 1, NULL, 95, POINT(41.9000, 12.4900), 'disponibile', 1500, 'monopattino'),
(12, NULL, NULL, 'POL23401', 'Ninebot Max', 'Segway', 1, NULL, 80, POINT(45.4600, 9.1850), 'disponibile', 2700, 'monopattino'),
(13, NULL, NULL, 'POL34012', 'E-Scooter', 'Ducati', 1, NULL, 30, POINT(40.8500, 14.2650), 'in_ricarica', 3800, 'monopattino');

-- Inserimento Stazioni Ricarica
INSERT INTO StazioneRicarica VALUES
(1, 'Type2', POINT(41.9027, 12.4963), 'libera', 1),
(2, 'CCS2', POINT(41.9030, 12.4970), 'occupata', 1),
(3, 'Schuko', POINT(41.9035, 12.4975), 'libera', 1),
(4, 'Type2', POINT(45.4642, 9.1900), 'libera', 2),
(5, 'CCS2', POINT(45.4645, 9.1910), 'libera', 2),
(6, 'Type2', POINT(45.0703, 7.6869), 'in_manutenzione', 3);

-- Inserimento Noleggi Completati
INSERT INTO Noleggia VALUES
(1, 1, 1, '2023-09-01 10:00:00', '2023-09-01 11:30:00', POINT(41.9027, 12.4963), POINT(41.9100, 12.5000), 15, 31.50, 90, 'successo'),
(2, 2, 5, '2023-09-02 14:00:00', '2023-09-02 15:15:00', POINT(43.7696, 11.2558), POINT(43.7750, 11.2600), 8, 18.75, 75, 'successo'),
(3, 3, 8, '2023-09-03 16:30:00', '2023-09-03 17:30:00', POINT(40.8518, 14.2700), POINT(40.8550, 14.2750), 5, 7.20, 60, 'successo'),
(4, 1, 12, '2023-09-04 09:00:00', '2023-09-04 09:45:00', POINT(45.4600, 9.1850), POINT(45.4650, 9.1900), 3, 4.50, 45, 'successo'),
(5, 4, 2, '2023-09-05 11:00:00', '2023-09-05 13:00:00', POINT(45.4642, 9.1900), POINT(45.4700, 9.2000), 25, 42.00, 120, 'successo');

-- Inserimento Noleggio Attivo
INSERT INTO Noleggia VALUES
(6, 2, 3, '2023-09-10 14:00:00', NULL, POINT(40.8518, 14.2681), NULL, NULL, NULL, NULL, 'in_attesa');

-- Inserimento Assistenze
INSERT INTO Assiste VALUES
(1, 8, 1, '2023-08-15 10:30:00', 'Problemi con l\'app', 'risolta'),
(2, 9, 3, '2023-08-20 14:45:00', 'Veicolo non trovato', 'chiusa'),
(3, 8, 2, '2023-09-05 09:15:00', 'Pagamento non riuscito', 'in_lavorazione'),
(4, 9, 5, '2023-09-08 16:30:00', 'Account bloccato erroneamente', 'aperta');

-- Inserimento Abbonamenti Acquistati
INSERT INTO Acquisti_Abbonamenti VALUES
(1, 1, 'mensile', '2023-09-01', '2023-10-01'),
(2, 2, 'settimanale', '2023-09-05', '2023-09-12'),
(3, 4, 'giornaliero', '2023-09-10', '2023-09-11');

-- Inserimento Revisioni
INSERT INTO EsegueRevisione VALUES
(1, 1, 1, '2023-06-15 10:00:00', 150.00, 'Revisione standard annuale'),
(2, 5, 2, '2023-07-20 11:30:00', 120.00, 'Revisione post-intervento'),
(3, 2, 3, '2023-08-10 14:15:00', 180.00, 'Revisione completa con controllo batteria');

-- Inserimento Interventi
INSERT INTO EsegueIntervento VALUES
(1, 3, 1, '2023-05-10 09:30:00', 350.00, 'Sostituzione batteria', 'Sostituzione completa del pacco batteria'),
(2, 7, 2, '2023-07-05 13:45:00', 220.00, 'Riparazione freni', 'Sostituzione pastiglie e controllo impianto'),
(3, 4, 3, '2023-08-22 10:15:00', 180.00, 'Sostituzione pneumatici', 'Montaggio pneumatici invernali'),
(4, 1, 1, '2023-09-01 11:00:00', 290.00, 'Manutenzione elettronica', 'Aggiornamento firmware e controllo centraline');

-- Inserimento Ricariche
INSERT INTO Ricarica(ID, OperatoreAccountID, VeicoloID, StazioneRicaricaID) VALUES
(1, 6, 1, 1),
(2, 7, 6, 3),
(3, 6, 13, 2),
(4, NULL, 7, 4),
(5, 7, 4, 5);

-- Update Ricariche
UPDATE Ricarica SET CostoSessione = 25.00, KWhCaricati = 40.5, DataFine = NOW() WHERE ID = 1;
UPDATE Ricarica SET CostoSessione = 30.50, KWhCaricati = 55.2, DataFine = NOW() WHERE ID = 2;
UPDATE Ricarica SET CostoSessione = 22.75, KWhCaricati = 38.1, DataFine = NOW() WHERE ID = 4;
UPDATE Ricarica SET CostoSessione = 28.90, KWhCaricati = 45.7, DataFine = NOW() WHERE ID = 5;




-- Riabilita i controlli di foreign key
SET FOREIGN_KEY_CHECKS = 1;