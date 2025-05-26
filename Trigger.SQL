-- vincolo 1
CREATE TRIGGER check_eta_cliente
BEFORE INSERT ON Cliente
FOR EACH ROW
BEGIN
    IF NEW.DataNascita > DATE_SUB(CURDATE(), INTERVAL 18 YEAR) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Età minima 18 anni';
    END IF;
END;


-- vincolo 2
CREATE TRIGGER check_patente_noleggio
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE tipoVeicolo ENUM('auto', 'scooter', 'bicicletta', 'monopattino');
    DECLARE autoAbilitata BOOLEAN;
    DECLARE Scadenza DATE;
    DECLARE p VARCHAR(50);

    SELECT Tipologia INTO tipoVeicolo FROM Veicolo WHERE ID = NEW.VeicoloID;
    SELECT PatenteNumero INTO p FROM Cliente WHERE AccountID = NEW.ClienteAccountID;

    IF tipoVeicolo IN ('auto', 'scooter') THEN
        IF p IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patente mancante';
        ELSE
            SELECT AutoAbilitata, Scadenza INTO autoAbilitata, Scadenza
            FROM Patente
            WHERE Numero = patenteNumero;
            IF Scadenza <= CURDATE() THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patente scaduta';
            END IF;
            IF autoAbilitata = 0 AND tipoVeicolo = 'auto' THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patente non valida per questo veicolo';
            END IF;
        END IF;
    END IF;
END;

-- vincolo 3
CREATE TRIGGER check_stato_account_noleggio
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE stato ENUM('attivo', 'bloccato', 'in_fase_di_verifica', 'eliminato');
    
    SELECT a.Stato INTO stato
    FROM Account a
    WHERE a.ID = NEW.ClienteAccountID;
    
    IF stato <> 'attivo' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Il cliente non è attivo e non può noleggiare';
    END IF;
END;

-- vincolo 4
CREATE TRIGGER check_metodo_pagamento_noleggio
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE metodo VARCHAR(25);
    SELECT a.MetodoPagamento INTO metodo
    FROM Account a JOIN Cliente c ON a.ID = c.AccountID
    WHERE c.AccountID = NEW.ClienteAccountID;
    IF metodo IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Metodo di pagamento mancante';
    END IF;
END;

-- vincolo 5
CREATE TRIGGER check_documenti_validi_noleggio
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE docScad DATE;
    SELECT d.Scadenza INTO docScad
    FROM Cliente c JOIN Documento d ON c.DocumentoNumero = d.Numero
    WHERE c.AccountID = NEW.ClienteAccountID;
    IF docScad <= CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Documento scaduto';
    END IF;
END;

-- vincolo 8
CREATE TRIGGER check_veicolo_disponibile_noleggio
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE statoVeicolo ENUM('disponibile', 'in_uso', 'in_ricarica', 'fuori_servizio', 'eliminato');
    DECLARE batteria INT;
    SELECT Stato, PercentualeBatteria INTO statoVeicolo, batteria FROM Veicolo WHERE ID = NEW.VeicoloID;
    IF statoVeicolo <> 'disponibile' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Veicolo non disponibile';
    END IF;
    IF batteria <= 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Batteria insufficiente per il noleggio';
    END IF;
END;

-- vincolo 9
CREATE TRIGGER check_date_noleggio
BEFORE UPDATE ON Noleggia
FOR EACH ROW
BEGIN
    IF OLD.DataInizio >= NEW.DataFine THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La data di fine deve essere successiva a quella di inizio';
    END IF;
END;

-- vincolo 12

CREATE TRIGGER check_unico_noleggio_attivo
BEFORE INSERT ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE count INT;
    -- Cliente
    SELECT COUNT(*) INTO count FROM Noleggia WHERE ClienteAccountID = NEW.ClienteAccountID AND DataFine IS NULL;
    IF count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Il cliente ha già un noleggio attivo';
    END IF;
    -- Veicolo
    SELECT COUNT(*) INTO count FROM Noleggia WHERE VeicoloID = NEW.VeicoloID AND DataFine IS NULL;
    IF count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Il veicolo è già noleggiato';
    END IF;
END;

-- vincolo 15
CREATE TRIGGER check_unico_abbonamento_attivo
BEFORE INSERT ON Acquisti_Abbonamenti
FOR EACH ROW
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM Acquisti_Abbonamenti
    WHERE ClienteAccountID = NEW.ClienteAccountID
      AND DataFineValidita >= CURDATE();
    IF count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esiste già un abbonamento attivo per questo cliente';
    END IF;
END;

CREATE TRIGGER update_durata_costo_noleggio
BEFORE UPDATE ON Noleggia
FOR EACH ROW
BEGIN
    DECLARE tariffa DECIMAL(3,2);
    DECLARE durata INT;
    DECLARE abbonamenti_attivi INT;

    IF NEW.DataFine IS NOT NULL THEN
        SET durata = TIMESTAMPDIFF(MINUTE, OLD.DataInizio, NEW.DataFine);
        SET NEW.DurataMinuti = durata;

        SELECT COUNT(*) INTO abbonamenti_attivi
        FROM Acquisti_Abbonamenti
        WHERE ClienteAccountID = NEW.ClienteAccountID
          AND DataInizioValidita <= NEW.DataFine
          AND DataFineValidita >= NEW.DataFine;

        IF abbonamenti_attivi = 0 THEN
            SELECT CostoAlMinuto INTO tariffa
            FROM Veicolo v
            JOIN Tariffa t ON v.Tipologia = t.CategoriaVeicolo
            WHERE v.ID = NEW.VeicoloID;
            SET NEW.Costo = durata * tariffa;
        ELSE
            SET NEW.Costo = 0;
        END IF;
    END IF;
END;

CREATE TRIGGER update_num_stazioni_libere_insert
AFTER INSERT ON StazioneRicarica
FOR EACH ROW
BEGIN
    IF NEW.CentroRicarica IS NOT NULL THEN
        UPDATE CentroRicarica cr
        SET cr.NumeroStazioniDisponibili = (
            SELECT COUNT(*) FROM StazioneRicarica sr
            WHERE sr.CentroRicarica = NEW.CentroRicarica AND sr.Stato = 'libera'
        )
        WHERE cr.ID = NEW.CentroRicarica;
    END IF;
END;

CREATE TRIGGER update_num_stazioni_libere_update
AFTER UPDATE ON StazioneRicarica
FOR EACH ROW
BEGIN
    IF NEW.CentroRicarica IS NOT NULL THEN
        UPDATE CentroRicarica cr
        SET cr.NumeroStazioniDisponibili = (
            SELECT COUNT(*) FROM StazioneRicarica sr
            WHERE sr.CentroRicarica = NEW.CentroRicarica AND sr.Stato = 'libera'
        )
        WHERE cr.ID = NEW.CentroRicarica;
    END IF;
END;