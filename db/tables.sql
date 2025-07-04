-- ============================================================================
-- SETUP_DATABASE.SQL - Setup completo del database
-- ============================================================================

-- Disabilita i controlli delle foreign key temporaneamente
SET FOREIGN_KEY_CHECKS = 0;

-- Elimina tutte le tabelle se esistono (in ordine inverso per rispettare le dipendenze)
DROP TABLE IF EXISTS Ricarica;
DROP TABLE IF EXISTS EsegueIntervento;
DROP TABLE IF EXISTS EsegueRevisione;
DROP TABLE IF EXISTS Acquisti_Abbonamenti;
DROP TABLE IF EXISTS Assiste;
DROP TABLE IF EXISTS Noleggia;
DROP TABLE IF EXISTS StazioneRicarica;
DROP TABLE IF EXISTS Veicolo;
DROP TABLE IF EXISTS OperatoreRicarica;
DROP TABLE IF EXISTS AddettoCallCenter;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS CentroRicarica;
DROP TABLE IF EXISTS Abbonamento;
DROP TABLE IF EXISTS Officina;
DROP TABLE IF EXISTS Tariffa;
DROP TABLE IF EXISTS Patente;
DROP TABLE IF EXISTS Documento;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS MetodoPagamento;
DROP VIEW IF EXISTS Veicolo_Attivo;
DROP VIEW IF EXISTS Account_Attivo;
DROP VIEW IF EXISTS Cliente_Account_Info;

-- Riabilita i controlli delle foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- CREAZIONE TABELLE
-- ============================================================================

CREATE TABLE MetodoPagamento (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NumeroCarta VARCHAR(25) NOT NULL UNIQUE,
    Intestatario VARCHAR(255) NOT NULL,
    CVV VARCHAR(4) NOT NULL, 
    Scadenza DATE NOT NULL,  -- Unico per intestatario e numero carta
    CONSTRAINT check_carta CHECK 
    (
        LENGTH(NumeroCarta) BETWEEN 13 AND 19 AND 
        NumeroCarta REGEXP '^[0-9]+$'
    )
);

CREATE TABLE Account (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, 
    Telefono VARCHAR(20) UNIQUE,
    Stato ENUM('attivo', 'bloccato', 'in_fase_di_verifica', 'eliminato') NOT NULL DEFAULT 'in_fase_di_verifica',
    Dipendente BOOLEAN NOT NULL DEFAULT FALSE, -- True se è AddettoCallCenter o OperatoreRicarica
    MetodoPagamento VARCHAR(25) NULL,
    DataRegistrazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MetodoPagamento) REFERENCES MetodoPagamento(NumeroCarta) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Documento (
    Numero VARCHAR(50) PRIMARY KEY,
    Scadenza DATE NOT NULL,
    EnteRilascio VARCHAR(100) NOT NULL
);

CREATE TABLE Patente (
    Numero VARCHAR(50) PRIMARY KEY,
    Scadenza DATE NOT NULL,
    EnteRilascio VARCHAR(100) NOT NULL,
    DataRilascio DATE NOT NULL,
    AutoAbilitata BOOLEAN NOT NULL -- True se abilitato alla guida di auto e scooter, false solo scooter
);

CREATE TABLE Tariffa (
    CategoriaVeicolo ENUM('auto', 'scooter', 'bicicletta', 'monopattino') PRIMARY KEY,
    CostoAlMinuto DECIMAL(3, 2) NOT NULL CHECK (CostoAlMinuto >= 0)
);

CREATE TABLE Officina (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Indirizzo VARCHAR(255) NOT NULL,
    NumeroTelefono VARCHAR(20)
);

CREATE TABLE Abbonamento (
    Durata ENUM('giornaliero', 'settimanale', 'mensile') PRIMARY KEY, 
    Costo DECIMAL(5, 2) NOT NULL CHECK (Costo >= 0)
);

CREATE TABLE CentroRicarica (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Indirizzo VARCHAR(255) NOT NULL UNIQUE,
    NumeroStazioniDisponibili INT NOT NULL DEFAULT 0 CHECK (NumeroStazioniDisponibili >= 0)
);

CREATE TABLE Cliente (
    AccountID INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100) NOT NULL,
    DataNascita DATE NOT NULL, 
    LuogoNascita VARCHAR(100) NOT NULL,
    IndirizzoResidenza VARCHAR(255) NOT NULL, 
    PatenteNumero VARCHAR(50) NULL, 
    DocumentoNumero VARCHAR(50) NOT NULL, 
    FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (PatenteNumero) REFERENCES Patente(Numero) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (DocumentoNumero) REFERENCES Documento(Numero) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE AddettoCallCenter (
    AccountID INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100) NOT NULL,
    DataNascita DATE NOT NULL,
    LuogoNascita VARCHAR(100),
    Indirizzo VARCHAR(255),
    Stipendio DECIMAL(7, 2),
    FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE OperatoreRicarica (
    AccountID INT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Cognome VARCHAR(100) NOT NULL,
    DataNascita DATE NOT NULL,
    LuogoNascita VARCHAR(100),
    Indirizzo VARCHAR(255),
    Stipendio DECIMAL(7, 2),
    FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Veicolo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Targa VARCHAR(10) NULL UNIQUE, -- Unica se presente, obbligatoria per auto/scooter
    ScadenzaRevisione DATE NULL, -- Obbligatoria per auto/scooter
    NumeroPolizzaAssicurativa VARCHAR(100) NOT NULL,
    Modello VARCHAR(100) NOT NULL,
    Marca VARCHAR(100) NOT NULL,
    NumeroPosti INT DEFAULT 1 CHECK (NumeroPosti >= 1),
    DataImmatricolazione DATE NULL,
    PercentualeBatteria INT NOT NULL DEFAULT 100 CHECK (PercentualeBatteria BETWEEN 0 AND 100),
    GPS POINT NOT NULL, 
    Stato ENUM('disponibile', 'in_uso', 'in_ricarica', 'fuori_servizio', 'eliminato') NOT NULL DEFAULT 'disponibile',
    ChilometraggioTotale INT NOT NULL DEFAULT 0 CHECK (ChilometraggioTotale >= 0),
    Tipologia ENUM('auto', 'scooter', 'bicicletta', 'monopattino') NOT NULL,
    FOREIGN KEY (Tipologia) REFERENCES Tariffa(CategoriaVeicolo) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT CHK_tipo CHECK 
    (
        Tipologia = 'monopattino' OR 
        Tipologia = 'bicicletta' OR 
        (
            Tipologia IN ('auto', 'scooter') AND
            Targa IS NOT NULL AND 
            ScadenzaRevisione IS NOT NULL AND
            DataImmatricolazione IS NOT NULL
        )
    )
);

CREATE TABLE StazioneRicarica (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    TipologiaPresa ENUM('Type2', 'CCS2', 'Schuko') NOT NULL,
    GPS POINT NOT NULL, 
    Stato ENUM('libera', 'occupata', 'in_manutenzione', 'fuori_servizio', 'eliminata') NOT NULL DEFAULT 'libera',
    CentroRicarica INT NULL,
    FOREIGN KEY (CentroRicarica) REFERENCES CentroRicarica(ID) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Noleggia (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteAccountID INT NOT NULL,
    VeicoloID INT NOT NULL,
    DataInizio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DataFine DATETIME NULL,
    GPSInizio POINT NULL, 
    GPSFine POINT NULL,
    ChilometriPercorsi INT NULL CHECK (ChilometriPercorsi IS NULL OR ChilometriPercorsi >= 0),
    Costo DECIMAL(7, 2) NULL CHECK (Costo IS NULL OR Costo >= 0),
    DurataMinuti INT NULL,
    EsitoPagamento ENUM('successo', 'fallito', 'in_attesa') DEFAULT 'in_attesa',
    FOREIGN KEY (ClienteAccountID) REFERENCES Cliente(AccountID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (VeicoloID) REFERENCES Veicolo(ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Assiste (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    AddettoAccountID INT NOT NULL,
    ClienteAccountID INT NOT NULL,
    DataRichiesta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ProblemaRiscontrato TEXT,
    StatoAssistenza ENUM('aperta', 'in_lavorazione', 'risolta', 'chiusa') DEFAULT 'aperta',
    FOREIGN KEY (AddettoAccountID) REFERENCES AddettoCallCenter(AccountID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ClienteAccountID) REFERENCES Cliente(AccountID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Acquisti_Abbonamenti (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteAccountID INT NOT NULL,
    TipoAbbonamento ENUM('giornaliero', 'settimanale', 'mensile') NOT NULL,
    DataInizioValidita DATE NOT NULL,
    DataFineValidita DATE NOT NULL,
    FOREIGN KEY (ClienteAccountID) REFERENCES Cliente(AccountID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (TipoAbbonamento) REFERENCES Abbonamento(Durata) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE EsegueRevisione (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    VeicoloID INT NOT NULL,
    OfficinaID INT NOT NULL,
    Data DATETIME NOT NULL,
    Costo DECIMAL(6, 2) NOT NULL CHECK (Costo >= 0),
    Note TEXT NULL,
    FOREIGN KEY (VeicoloID) REFERENCES Veicolo(ID) ON DELETE RESTRICT ON UPDATE CASCADE, 
    FOREIGN KEY (OfficinaID) REFERENCES Officina(ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE EsegueIntervento ( 
    ID INT AUTO_INCREMENT PRIMARY KEY,
    VeicoloID INT NOT NULL,
    OfficinaID INT NOT NULL,
    Data DATETIME NOT NULL,
    Costo DECIMAL(8, 2) NOT NULL CHECK (Costo >= 0),
    Tipologia VARCHAR(255) NOT NULL, 
    Descrizione TEXT NULL,
    FOREIGN KEY (VeicoloID) REFERENCES Veicolo(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (OfficinaID) REFERENCES Officina(ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Ricarica (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    OperatoreAccountID INT NULL,
    VeicoloID INT NOT NULL,
    StazioneRicaricaID INT NOT NULL,
    DataInizio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DataFine DATETIME NULL,
    CostoSessione DECIMAL(6, 2) NULL CHECK (CostoSessione IS NULL OR CostoSessione >= 0),
    KWhCaricati DECIMAL(6, 2) NULL CHECK (KWhCaricati IS NULL OR KWhCaricati >= 0),
    FOREIGN KEY (OperatoreAccountID) REFERENCES OperatoreRicarica(AccountID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (VeicoloID) REFERENCES Veicolo(ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (StazioneRicaricaID) REFERENCES StazioneRicarica(ID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE VIEW Veicolo_Attivo AS
SELECT *
From Veicolo
Where Stato <> 'eliminato';

CREATE VIEW Account_Attivo AS
SELECT *
FROM Account
WHERE Stato <> 'eliminato';

CREATE VIEW Cliente_Account_Info AS
SELECT 
    c.Nome, 
    c.Cognome, 
    c.DocumentoNumero,
    a.Email,
    a.Telefono, 
    a.Stato,
    a.ID
FROM Cliente c
JOIN Account a ON c.AccountID = a.ID;

COMMIT; 