

-- Op 1.a: Inserimento di un nuovo veicolo
-- Auto/Scooter
INSERT INTO Veicolo (Targa, ScadenzaRevisione, NumeroPolizzaAssicurativa, Modello, Marca, NumeroPosti, DataImmatricolazione, PercentualeBatteria, GPS, Stato, ChilometraggioTotale, Tipologia)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?), ?, ?, ?);

-- Bicicletta/Monopattino
INSERT INTO Veicolo (NumeroPolizzaAssicurativa, Modello, Marca, NumeroPosti, PercentualeBatteria, GPS, Stato, ChilometraggioTotale, Tipologia)
VALUES (?, ?, ?, ?, ?, ST_PointFromText(?), ?, ?, ?);

-- Op 1.b: Aggiornamento di un veicolo (batteria, GPS, chilometraggio, stato)
UPDATE Veicolo_Attivo
SET 
	PercentualeBatteria = ?,
	GPS = ST_PointFromText(?),
	ChilometraggioTotale = ?,
	Stato = ?
WHERE ID = ?;

-- Op 1.c : Eliminazione di un veicolo (soft-delete)
UPDATE Veicolo_Attivo
SET 
	Stato = 'eliminato'
WHERE ID = ?;

-- Op 1.d: Visualizzazione di tutti i veicoli disponibili per tipologia
SELECT Targa, Modello, Marca, NumeroPosti, PercentualeBatteria, GPS
FROM Veicolo
WHERE Stato = 'disponibile' AND Tipologia = ? AND PercentualeBatteria > 20;

-- Op 1.e: Visualizzazione dei 10 veicolo più noleggiati nell'ultimo anno per tipologia
SELECT 
    v.ID,
    v.Targa,
    v.Modello,
    v.Marca,
    COUNT(n.ID) AS NumeroNoleggi
FROM 
    Veicolo v
JOIN 
    Noleggia n ON v.ID = n.VeicoloID
WHERE 
    v.Tipologia = ?
    AND n.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY 
    v.ID, v.Targa, v.Modello, v.Marca
ORDER BY 
    NumeroNoleggi DESC
LIMIT 10;


-- Op 1.f: Visualizzazione dei 5 veicoli che hanno ricevuto più interventi di manutenzione nell'ultimo anno
SELECT 
	v.ID,
	v.Targa,
	v.Modello,
	v.Marca,
    v.Tipologia,
	COUNT(m.ID) AS NumeroInterventi
FROM
	Veicolo v
JOIN
	EsegueIntervento m ON v.ID = m.VeicoloID
WHERE
	m.Data >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY
	v.ID, v.Targa, v.Modello, v.Marca, v.Tipologia
ORDER BY
	NumeroInterventi DESC
LIMIT 5;

-- Noleggi
-- Op 2.a: Inserimento di un nuovo noleggio
INSERT INTO Noleggia (ClienteAccountID, VeicoloID, GPSInizio) VALUES (?, ?, ST_PointFromText(?))

-- Op 2.b: Aggiornamento di un noleggio
UPDATE Noleggia 
SET DataFine = NOW(), 
	GPSFine = ST_PointFromText(?),
	ChilometriPercorsi = ?, 
	EsitoPagamento = ?
WHERE ID = ?

-- Op 2.c: Visualizzazione della durata media dei noleggi per ogni tipologia
SELECT 
    v.Tipologia,
    AVG(n.DurataMinuti) AS DurataMediaMinuti
FROM Noleggia n
JOIN Veicolo v ON n.VeicoloID = v.ID
WHERE n.DurataMinuti IS NOT NULL
GROUP BY v.Tipologia;

-- Op 2.d: Visualizzazione dei veicoli con più chilometri percorsi
SELECT 
    v.ID,
    v.Modello,
    v.Marca,
    SUM(n.ChilometriPercorsi) AS KmTotaliNoleggi
FROM Noleggia n
JOIN Veicolo v ON n.VeicoloID = v.ID
WHERE n.ChilometriPercorsi IS NOT NULL
GROUP BY v.ID, v.Modello, v.Marca
ORDER BY KmTotaliNoleggi DESC
LIMIT 10;

-- Op 2.f: Visualizzazione andamento mensile dei noleggi
SELECT 
    YEAR(DataInizio) AS Anno,
    MONTH(DataInizio) AS Mese,
    COUNT(*) AS NumeroNoleggi
FROM Noleggia
GROUP BY Anno, Mese
ORDER BY Anno DESC, Mese DESC;

-- Clienti
-- Op 3.a: Inserimento di un nuovo cliente
INSERT INTO Account (Email, Password, Telefono, Stato) VALUES (?, ?, ?, 'in_fase_di_verifica')
INSERT INTO Documento (Numero, Scadenza, EnteRilascio) VALUES (?, ?, ?)
INSERT INTO Cliente (
AccountID, Nome, Cognome, DataNascita, LuogoNascita,
IndirizzoResidenza, DocumentoNumero
) VALUES (?, ?, ?, ?, ?, ?, ?)
INSERT INTO MetodoPagamento (Tipo, NumeroCarta, ScadenzaCarta, CVV)
VALUES (?, ?, ?, ?, ?);
UPDATE Account_Attivo SET MetodoPagamento = ? WHERE ID = ?
UPDATE Account_Attivo SET Stato = 'attivo' WHERE ID = ?

-- Op 3.b: Inserimento patente di guida
INSERT INTO Patente (Numero, Scadenza, EnteRilascio, DataRilascio, AutoAbilitata) VALUES (?, ?, ?, ?, ?)
UPDATE Cliente SET PatenteNumero = ? WHERE AccountID = ?


-- Op: 3.c: Visualizzazione dei clienti con più di 50 noleggi nell'ultimo anno
SELECT 
    c.AccountID,
    c.Nome,
    c.Cognome,
    COUNT(n.ID) AS NumeroNoleggi
FROM Cliente c
JOIN Noleggia n ON c.AccountID = n.ClienteAccountID
WHERE n.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY c.AccountID, c.Nome, c.Cognome
HAVING NumeroNoleggi > 50;

-- OP 3.c : Visualizzazione dei clienti con abbonamento attivo
SELECT 
    c.AccountID,
    c.Nome,
    c.Cognome,
    aa.TipoAbbonamento,
    aa.DataFineValidita
FROM Cliente c
JOIN Acquisti_Abbonamenti aa ON c.AccountID = aa.ClienteAccountID
WHERE aa.DataFineValidita >= CURDATE();

-- Op 3.d: Visualizzazione dei clienti più fedeli
SELECT 
    c.AccountID,
    c.Nome,
    c.Cognome,
    a.DataRegistrazione
FROM Cliente c
JOIN Account a ON c.AccountID = a.ID
ORDER BY a.DataRegistrazione ASC
LIMIT 10;

-- Manutenzione
-- Op 4.a: Inserimento di un nuovo intervento di manutenzione
INSERT INTO EsegueIntervento (
            VeicoloID, OfficinaID, Data, Costo, Tipologia, Descrizione
          ) VALUES (?, ?, ?, ?, ?, ?)

INSERT INTO EsegueRevisione (
            VeicoloID, OfficinaID, Data, Costo, Note
          ) VALUES (?, ?, ?, ?, ?)

-- Op 4.c: visualizzazione degli ultimi 5 noleggi (e relativi clienti) di un veicolo soggetto a intervento di riparazione
SELECT DISTINCT
    cai.ID AS AccountID,
    cai.Nome,
    cai.Cognome,
    cai.Email,
    n.DataInizio AS UltimoNoleggio,
    n.DataFine,
    v.Targa,
    v.Modello,
    v.Marca,
    ei.Data AS DataIntervento,
    ei.Tipologia AS DescrizioneIntervento,
    o.Nome AS OfficinaNome
FROM Cliente_Account_Info cai
INNER JOIN Noleggia n ON cai.ID = n.ClienteAccountID
INNER JOIN Veicolo v ON n.VeicoloID = v.ID
INNER JOIN EsegueIntervento ei ON v.ID = ei.VeicoloID
INNER JOIN Officina o ON ei.OfficinaID = o.ID
WHERE ei.ID = ?
ORDER BY UltimoNoleggio DESC
LIMIT 5;

-- Op 4.b: Visualizzazione tipologie di intervento più costose in media
SELECT 
    ei.Tipologia,
    AVG(ei.Costo) AS CostoMedio
FROM EsegueIntervento ei
GROUP BY ei.Tipologia
ORDER BY CostoMedio DESC
LIMIT 5;


-- 4.d: Andamento mensile dei costi di manutenzione
SELECT 
    YEAR(Data) AS Anno,
    MONTH(Data) AS Mese,
    SUM(Costo) AS CostoTotale
FROM EsegueIntervento
GROUP BY Anno, Mese
ORDER BY Anno DESC, Mese DESC;

-- Ricariche
-- Op 5.a: Inserimento di una nuova ricarica
INSERT INTO Ricarica (
          OperatoreAccountID, VeicoloID, StazioneRicaricaID
        ) VALUES (?, ?, ?)

-- Op 5.b: Aggiornamento di una ricarica
UPDATE Ricarica 
        SET DataFine = NOW(), CostoSessione = ?, KWhCaricati = ?
        WHERE ID = ?

-- Veicoli che hanno effettuato più ricariche nell'ultimo mese
SELECT 
    v.ID,
    v.Targa,
    v.Modello,
    v.Marca,
    COUNT(r.ID) AS NumeroRicariche
FROM Veicolo v
JOIN Ricarica r ON v.ID = r.VeicoloID
WHERE r.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
GROUP BY v.ID, v.Targa, v.Modello, v.Marca
ORDER BY NumeroRicariche DESC
LIMIT 10;

-- Operatori che hanno effettuato più ricariche
SELECT 
    o.AccountID,
    a.Email,
    COUNT(r.ID) AS NumeroRicariche
FROM OperatoreRicarica o
JOIN Account a ON o.AccountID = a.ID
JOIN Ricarica r ON o.AccountID = r.OperatoreAccountID
GROUP BY o.AccountID, a.Email
ORDER BY NumeroRicariche DESC
LIMIT 5;

-- Op 6.a: Inserimento centro di ricarica
INSERT INTO CentroRicarica (Indirizzo) VALUES (?)

-- Op 6.b: Visualizzazione energia totale ricaricata per centro di ricarica
SELECT 
    cr.ID,
    SUM(r.KWhCaricati) AS EnergiaTotale
FROM CentroRicarica cr
JOIN StazioneRicarica sr ON cr.ID = sr.CentroRicarica
JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
GROUP BY cr.ID
ORDER BY EnergiaTotale DESC;

-- Op 6.c: Visualizzazione dei 5 centri di ricarica con più ricariche effettuate nell'ultimo anno
SELECT 
    cr.ID,
    cr.NumeroStazioniDisponibili,
    COUNT(r.ID) AS NumeroRicariche
FROM CentroRicarica cr
JOIN StazioneRicarica sr ON cr.ID = sr.CentroRicarica
JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
WHERE r.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY cr.ID, cr.NumeroStazioniDisponibili
ORDER BY NumeroRicariche DESC
LIMIT 5;

-- Op 6.d: Visualizzazione di tutti i centri di ricarica ordinati per numero di colonnine disponibili
SELECT 
    cr.ID,
    cr.Indirizzo,
    cr.NumeroStazioniDisponibili
FROM CentroRicarica cr
ORDER BY cr.NumeroStazioniDisponibili DESC;

-- Op 7.a: Inserimenti di una nuova stazione di ricarica
INSERT INTO StazioneRicarica (
          TipologiaPresa, GPS, Stato, CentroRicarica
        ) VALUES (?, ST_PointFromText(?), ?, ?)

-- Op 7.b: Aggiornamento di una stazione di ricarica
UPDATE StazioneRicarica_Attivo SET Stato = ? WHERE ID = ?

-- Op 7.c: Visualizzazione delle stazioni ordinate per energia totale erogata
SELECT 
    sr.ID,
    SUM(r.KWhCaricati) AS EnergiaTotaleKWh
FROM StazioneRicarica sr
JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
GROUP BY sr.ID
ORDER BY EnergiaTotaleKWh DESC;

-- Op 7.d: Visualizzazione della durata media delle sessioni di ricarica per stazione
SELECT 
    sr.ID,
    AVG(TIMESTAMPDIFF(MINUTE, r.DataInizio, r.DataFine)) AS DurataMediaMinuti
FROM StazioneRicarica sr
JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
WHERE r.DataFine IS NOT NULL
GROUP BY sr.ID
ORDER BY DurataMediaMinuti DESC;

-- Op 8.a: Modifica tariffe di ricarica
UPDATE Tariffa SET CostoAlMinuto = ? WHERE CategoriaVeicolo = ?