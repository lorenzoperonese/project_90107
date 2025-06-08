import json
import os
import random
import time
from datetime import date, datetime, timedelta
from random import randint
import mysql.connector
import requests
from mysql.connector import Error

BASE_URL = "http://localhost:30000/api"

DATABASE_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "rootpassword",
    "database": "project_90107_db",
    "port": 3307
}

CAR_MODELS = [
    ("Fiat", "500e", 4), ("Renault", "Zoe", 5), ("Nissan", "Leaf", 5),
    ("BMW", "i3", 4), ("Smart", "EQfortwo", 2), ("Volkswagen", "ID.3", 5),
    ("Peugeot", "e-208", 5), ("Mini", "Cooper SE", 4), ("Citroën", "ë-C4", 5)
]

BIKE_MODELS = [
    ("Bianchi", "E-Spillo"), ("Piaggio", "Wi-Bike"), ("Atala", "B-Easy"),
    ("Bottecchia", "BE32"), ("Lombardo", "Sestriere E"), ("Trek", "Verve+"),
    ("Specialized", "Turbo Vado"), ("Giant", "Explore E+"), ("Cannondale", "Quick Neo")
]

SCOOTER_MODELS = [
    ("Piaggio", "Vespa Elettrica"), ("NIU", "NGT"), ("Yamaha", "EC-05"),
    ("Honda", "PCX Electric"), ("BMW", "CE 04"), ("Gogoro", "Viva"),
    ("Silence", "S01"), ("Kymco", "iONEX"), ("SYM", "E-Virid")
]

ESCOOTER_MODELS = [
    ("Xiaomi", "Mi Electric"), ("Segway", "Ninebot Max"), ("Lime", "Gen4"),
    ("Bird", "Zero"), ("Tier", "Tier-3"), ("Voi", "Voiager 4"), 
    ("Spin", "S-200"), ("Dott", "Dott-3"), ("Wind", "Mobility 3")
]

BOLOGNA_LOCATIONS = [
    (44.4949, 11.3426), (44.4938, 11.3387), (44.4968, 11.3548),
    (44.4889, 11.3394), (44.5075, 11.3514), (44.4827, 11.3317),
    (44.4731, 11.3159), (44.5149, 11.3665), (44.4706, 11.3539)
]

CLIENT_DATA = [
    ("Marco", "Rossi", "marco.rossi1990@gmail.com", "Bologna", "Via Irnerio 15"),
    ("Giulia", "Bianchi", "giulia.bianchi@libero.it", "Milano", "Via Ugo Bassi 22"),
    ("Alessandro", "Ferrari", "alex.ferrari@yahoo.it", "Roma", "Via Santo Stefano 45"),
    ("Francesca", "Romano", "f.romano@hotmail.com", "Napoli", "Via Zamboni 18"),
    ("Luca", "Galli", "luca.galli91@outlook.it", "Torino", "Via Rizzoli 33"),
    ("Chiara", "Conti", "chiara.conti@tiscali.it", "Firenze", "Via Mascarella 67"),
    ("Matteo", "Ricci", "matteo.ricci88@virgilio.it", "Bologna", "Via Saragozza 89"),
    ("Sofia", "Moretti", "sofia.moretti@alice.it", "Venezia", "Via San Felice 12"),
    ("Andrea", "Barbieri", "a.barbieri@gmail.com", "Padova", "Via Portanova 56"),
    ("Valentina", "De Luca", "vale.deluca@libero.it", "Bari", "Via Castiglione 78"),
    ("Davide", "Santoro", "d.santoro92@gmail.com", "Bologna", "Via del Pratello 23"),
    ("Elena", "Martini", "elena.martini@hotmail.it", "Verona", "Via delle Belle Arti 34"),
    ("Simone", "Greco", "simone.greco@yahoo.com", "Palermo", "Via Fondazza 45"),
    ("Federica", "Costa", "federica.costa89@outlook.com", "Genova", "Via San Vitale 67"),
    ("Roberto", "Mancini", "roberto.mancini@tiscali.it", "Bologna", "Via Galliera 12")
]

CHARGING_CENTERS = [
    "Via Stalingrado 61, Bologna",
    "Piazza VIII Agosto 20, Bologna", 
    "Via dell'Università 15, Bologna",
    "Via Emilia Ponente 125, Bologna",
    "Via San Donato 145, Bologna",
    "Piazza dei Martiri 8, Bologna",
    "Via Zanardi 242, Bologna"
]

CHARGING_LOCATIONS = [
    (44.4949, 11.3426, "Type2"), (44.4938, 11.3387, "CCS2"), (44.4968, 11.3548, "Schuko"),
    (44.4889, 11.3394, "Type2"), (44.5075, 11.3514, "CCS2"), (44.4827, 11.3317, "Type2"),
    (44.4731, 11.3159, "Schuko"), (44.5149, 11.3665, "CCS2"), (44.4706, 11.3539, "Type2"),
    (44.4983, 11.3548, "Schuko"), (44.4915, 11.3511, "Type2"), (44.4854, 11.3321, "CCS2"),
    (44.5023, 11.3645, "Type2"), (44.4798, 11.3298, "Schuko"), (44.4723, 11.3498, "CCS2")
]

MAINTENANCE_TYPES = [
    ('Cambio pneumatici', 120, 200),
    ('Revisione freni', 150, 250),
    ('Controllo batteria', 50, 80),
    ('Sostituzione catena', 60, 100),
    ('Riparazione carrozzeria', 200, 500),
    ('Tagliando', 100, 180),
    ('Sostituzione filtri', 40, 70),
    ('Manutenzione ordinaria', 80, 150)
]

def connect_to_database():
    """Connect to the MySQL database"""
    try:
        connection = mysql.connector.connect(**DATABASE_CONFIG)
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        raise

def populate_tariffe(connection):
    """Populate the Tariffa table with realistic pricing"""
    try:
        cursor = connection.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM Tariffa")
        count = cursor.fetchone()[0]
        
        if count > 0:
            print("Tariffa table already populated, skipping...")
            cursor.close()
            return
        
        tariffe = [
            ('auto', 0.25),
            ('scooter', 0.18),
            ('bicicletta', 0.05),
            ('monopattino', 0.15)
        ]
        
        query = "INSERT INTO Tariffa (CategoriaVeicolo, CostoAlMinuto) VALUES (%s, %s)"
        cursor.executemany(query, tariffe)
        
        connection.commit()
        print(f"Inserted {cursor.rowcount} records into Tariffa table")
        cursor.close()
    except Error as e:
        print(f"Error populating Tariffa table: {e}")
        raise

def populate_officine(connection):
    try:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM Officina")

        officine = [
            ('Autofficina Centrale Bologna', 'Via Stalingrado 45, Bologna', '0516330244'),
            ('Carrozzeria Europa', 'Via dell\'Indipendenza 12, Bologna', '051247856'),
            ('Officina Meccanica San Donato', 'Via San Donato 78, Bologna', '0516494521'),
            ('Centro Assistenza Auto', 'Via Emilia Ponente 156, Bologna', '0516131047'),
            ('Autorimessa Moderna', 'Via Massarenti 34, Bologna', '051345671')
        ]

        query = "INSERT INTO Officina (Nome, Indirizzo, NumeroTelefono) VALUES (%s, %s, %s)"
        cursor.executemany(query, officine)

        connection.commit()
        print(f"Inserted {cursor.rowcount} records into Officina table")
        cursor.close()
    except Error as e:
        print(f"Error populating Officina table: {e}")
        raise

def populate_abbonamenti(connection):
    try:
        cursor = connection.cursor()
        
        cursor.execute("DELETE FROM Abbonamento")
        
        abbonamenti = [
            ('giornaliero', 39.90),
            ('settimanale', 119.90),
            ('mensile', 299.90)
        ]
        
        query = "INSERT INTO Abbonamento (Durata, Costo) VALUES (%s, %s)"
        cursor.executemany(query, abbonamenti)
        
        connection.commit()
        print(f"Inserted {cursor.rowcount} records into Abbonamento table")
        cursor.close()
    except Error as e:
        print(f"Error populating Abbonamento table: {e}")
        raise

def populate_operatore_ricarica(connection):
    try:
        cursor = connection.cursor()
        
        account_query = """
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
        VALUES (%s, %s, %s, %s, %s)
        """
        
        account_data = [
            ('marco.rossi@vehicleshare.it', 'VehShare2024!', '3357123456', 'attivo', True),
            ('laura.bianchi@vehicleshare.it', 'VehShare2024!', '3389654321', 'attivo', True),
            ('giovanni.verdi@vehicleshare.it', 'VehShare2024!', '3401234567', 'attivo', True),
            ('sofia.conti@vehicleshare.it', 'VehShare2024!', '3478765432', 'attivo', True),
            ('alessandro.neri@vehicleshare.it', 'VehShare2024!', '3425678901', 'attivo', True)
        ]
        
        cursor.executemany(account_query, account_data)
        connection.commit()
        
        cursor.execute("SELECT ID FROM Account WHERE Email LIKE '%@vehicleshare.it' AND Dipendente = TRUE ORDER BY ID LIMIT 5")
        account_ids = [row[0] for row in cursor.fetchall()]
        
        operatori_data = [
            (account_ids[0], 'Marco', 'Rossi', date(1985, 3, 15), 'Bologna', 'Via Irnerio 42, Bologna', 1850.00),
            (account_ids[1], 'Laura', 'Bianchi', date(1990, 7, 22), 'Modena', 'Via Ugo Bassi 18, Bologna', 1920.00),
            (account_ids[2], 'Giovanni', 'Verdi', date(1988, 11, 8), 'Bologna', 'Via Santo Stefano 67, Bologna', 1880.00),
            (account_ids[3], 'Sofia', 'Conti', date(1992, 5, 18), 'Ravenna', 'Via Zamboni 33, Bologna', 1850.00),
            (account_ids[4], 'Alessandro', 'Neri', date(1987, 9, 12), 'Bologna', 'Via Rizzoli 15, Bologna', 1950.00)
        ]
        
        operatori_query = """
        INSERT INTO OperatoreRicarica (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.executemany(operatori_query, operatori_data)
        connection.commit()
        
        print(f"Inserted {len(operatori_data)} records into OperatoreRicarica table")
        cursor.close()
    except Error as e:
        print(f"Error populating OperatoreRicarica table: {e}")
        raise

def populate_addetto_call_center(connection):
    try:
        cursor = connection.cursor()
        
        account_query = """
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
        VALUES (%s, %s, %s, %s, %s)
        """
        
        account_data = [
            ('giulia.martinez@vehicleshare.it', 'CallCenter2024!', '3287654321', 'attivo', True),
            ('antonio.russo@vehicleshare.it', 'CallCenter2024!', '3331472583', 'attivo', True),
            ('marta.gallo@vehicleshare.it', 'CallCenter2024!', '3399876543', 'attivo', True),
            ('luca.bruno@vehicleshare.it', 'CallCenter2024!', '3465432109', 'attivo', True),
            ('elena.costa@vehicleshare.it', 'CallCenter2024!', '3517890123', 'attivo', True)
        ]
        
        cursor.executemany(account_query, account_data)
        connection.commit()
        
        cursor.execute("SELECT ID FROM Account WHERE Email LIKE '%@vehicleshare.it' AND Dipendente = TRUE ORDER BY ID DESC LIMIT 5")
        account_ids = [row[0] for row in cursor.fetchall()]
        
        addetti_data = [
            (account_ids[0], 'Giulia', 'Martinez', date(1993, 6, 12), 'Bologna', 'Via Portanova 28, Bologna', 1650.00),
            (account_ids[1], 'Antonio', 'Russo', date(1989, 10, 5), 'Napoli', 'Via San Felice 45, Bologna', 1720.00),
            (account_ids[2], 'Marta', 'Gallo', date(1994, 1, 30), 'Milano', 'Via dei Mille 12, Bologna', 1680.00),
            (account_ids[3], 'Luca', 'Bruno', date(1990, 8, 17), 'Roma', 'Via Saragozza 89, Bologna', 1700.00),
            (account_ids[4], 'Elena', 'Costa', date(1992, 4, 3), 'Firenze', 'Via Castiglione 56, Bologna', 1670.00)
        ]
        
        addetti_query = """
        INSERT INTO AddettoCallCenter (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.executemany(addetti_query, addetti_data)
        connection.commit()
        
        print(f"Inserted {len(addetti_data)} records into AddettoCallCenter table")
        cursor.close()
    except Error as e:
        print(f"Error populating AddettoCallCenter table: {e}")
        raise

def add_vehicle_via_api(marca, modello, numeroPosti, percentualeBatteria, stato, 
                       chilometraggioTotale, tipologia, numeroPolizzaAssicurativa,
                       lat, lng, targa=None, scadenzaRevisione=None, dataImmatricolazione=None):
    
    vehicle_data = {
        "Marca": marca,
        "Modello": modello,
        "NumeroPosti": numeroPosti,
        "PercentualeBatteria": percentualeBatteria,
        "Stato": stato,
        "ChilometraggioTotale": chilometraggioTotale,
        "Tipologia": tipologia,
        "NumeroPolizzaAssicurativa": numeroPolizzaAssicurativa,
        "gpsQuery": str(lat) + ',' + str(lng)
    }
    
    if tipologia in ['auto', 'scooter']:
        if not all([targa, scadenzaRevisione, dataImmatricolazione]):
            raise ValueError("targa, scadenzaRevisione, and dataImmatricolazione are required for auto/scooter")
        
        vehicle_data.update({
            "Targa": targa,
            "ScadenzaRevisione": scadenzaRevisione,
            "DataImmatricolazione": dataImmatricolazione
        })
    
    try:
        response = requests.post(f"{BASE_URL}/vehicles", json=vehicle_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to add vehicle. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error adding vehicle via API: {e}")
        raise

def add_account_and_client_via_api(email, password, telefono, nome, cognome, dataNascita,
                                  luogoNascita, indirizzoResidenza, documento_numero, documento_scadenza,
                                  documento_enteRilascio, PatenteNumero, PatenteDataRilascio, PatenteEnteRilascio, 
                                  PatenteScadenza, AB, numeroCarta=None, cvv=None, scadenza=None, intestatario=None):
    
    client_data = {
        "Email": email,
        "Password": password,
        "Telefono": telefono,
        "Nome": nome,
        "Cognome": cognome,
        "DataNascita": dataNascita,
        "LuogoNascita": luogoNascita,
        "IndirizzoResidenza": indirizzoResidenza,
        "DocumentoNumero": documento_numero,
        "DocumentoScadenza": documento_scadenza,
        "EnteRilascioDocumento": documento_enteRilascio,
        "NumeroCarta": numeroCarta,
        "CVV": cvv,
        "Scadenza": scadenza,
        "Intestatario": intestatario
    }
    
    try:
        response = requests.post(f"{BASE_URL}/clients/register", json=client_data)
        if response.status_code == 200 or response.status_code == 201:
            res = response.json()
        else:
            print(f"Failed to register client. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error registering client via API: {e}")
        raise

    client_data = {
        "PatenteNumero": PatenteNumero,
        "PatenteDataRilascio": PatenteDataRilascio,
        "PatenteEnteRilascio": PatenteEnteRilascio,
        "PatenteScadenza": PatenteScadenza,
        "AB": AB
    }

    try:
        response = requests.put(f"{BASE_URL}/clients/{res['data']['AccountID']}/license", json=client_data)
        if response.status_code == 200 or response.status_code == 201:
            return res['data']['AccountID']
        else:
            print(f"Failed to update client. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error updating client via API: {e}")
        raise

def add_charging_station_via_api(tipologiaPresa, stato, lat, lng, centroRicarica=None):
    station_data = {
        "TipologiaPresa": tipologiaPresa,
        "Stato": stato,
        "GPS": str(lat) + ',' + str(lng)
    }
    
    if centroRicarica:
        station_data["CentroRicaricaID"] = centroRicarica
    
    try:
        response = requests.post(f"{BASE_URL}/charging-stations", json=station_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to add charging station. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error adding charging station via API: {e}")
        raise

def add_charging_center_via_api(indirizzo):
    center_data = {"Indirizzo": indirizzo}
    
    try:
        response = requests.post(f"{BASE_URL}/charging-centers", json=center_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to add charging center. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error adding charging center via API: {e}")
        raise
    
def add_rental_via_api(cliente, veicolo, dataInizio, dataFine, ChilometriPercorsi, 
                      EsitoPagamento, GPSInizio=None, GPSFine=None):
    
    rental_data = {
        "ClienteAccountID": cliente,
        "VeicoloID": veicolo,
        "GPSInizio": GPSInizio,
        "DataInizio": dataInizio,
    }
    
    try:
        response = requests.post(f"{BASE_URL}/rentals/start", json=rental_data)
        if response.status_code == 200 or response.status_code == 201:
            res = response.json()
        else:
            print(f"Failed to start rental. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error starting rental via API: {e}")
        raise
    
    rental_data = {
        "GPSFine": GPSFine,
        "ChilometriPercorsi": ChilometriPercorsi,
        "EsitoPagamento": EsitoPagamento,
        "DataFine": dataFine,
    }

    time.sleep(0.1)
    
    try:
        response = requests.put(f"{BASE_URL}/rentals/{res['data']['id']}/end", json=rental_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to end rental. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error ending rental via API: {e}")
        raise
    
def add_maintenance_via_api(veicoloID, officinaID, dataIntervento, TipoIntervento, 
                           Costo, descrizione=None, note=None):
    maintenance_data = {
        "VeicoloID": veicoloID,
        "OfficinaID": officinaID,
        "DataIntervento": dataIntervento,
        "TipoIntervento": TipoIntervento,
        "Costo": Costo,
        "Descrizione": descrizione,
        "Note": note
    }
    
    try:
        response = requests.post(f"{BASE_URL}/maintenances", json=maintenance_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to add maintenance. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error adding maintenance via API: {e}")
        raise

def add_charging_via_api(operatoreID, stazioneID, veicoloID, dataInizio, dataFine,
                        costoSessione=None, KWhCaricati=None):  
    charging_data = {
        "OperatoreAccountID": operatoreID,
        "StazioneRicaricaID": stazioneID,
        "VeicoloID": veicoloID,
        "DataInizio": dataInizio,
    }
    
    try:
        response = requests.post(f"{BASE_URL}/charges/start", json=charging_data)
        if response.status_code == 200 or response.status_code == 201:
            res = response.json()
        else:
            print(f"Failed to start charging. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error starting charging via API: {e}")
        raise
    
    charging_data = {
        "CostoSessione": costoSessione,
        "KWhCaricati": KWhCaricati,
        "DataFine": dataFine,
    }

    try:
        response = requests.put(f"{BASE_URL}/charges/{res['data']['id']}/end", json=charging_data)
        if response.status_code == 200 or response.status_code == 201:
            return response.json()
        else:
            print(f"Failed to end charging. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            raise Exception(f"API call failed with status {response.status_code}")
    except Exception as e:
        print(f"Error ending charging via API: {e}")
        raise

def random_date(start, end):
    delta = end - start
    random_days = randint(0, delta.days)
    return (start + timedelta(days=random_days)).strftime('%Y-%m-%d')

def random_birth_date():
    start_year = date.today().year - 65
    end_year = date.today().year - 19
    year = random.randint(start_year, end_year)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return date(year, month, day).strftime('%Y-%m-%d')

def populate_vehicles():
    print("Adding vehicles...")
    
    start_date = date(2025, 9, 9)
    end_date = date(2030, 1, 1)
    start_date2 = date(2015, 1, 1)
    end_date2 = date(2025, 1, 1)

    for i, (marca, modello, posti) in enumerate(CAR_MODELS):
        scadenza = random_date(start_date, end_date)
        data_immatricolazione = random_date(start_date2, end_date2)
        lat, lng = BOLOGNA_LOCATIONS[i % len(BOLOGNA_LOCATIONS)]
        add_vehicle_via_api(
            modello=modello, marca=marca, numeroPosti=posti,
            percentualeBatteria=randint(30, 95), stato="disponibile",
            chilometraggioTotale=randint(5000, 45000), tipologia="auto",
            numeroPolizzaAssicurativa=f"POL{1000000 + i:07d}", 
            lat=lat + randint(-50, 50) * 0.0001,
            lng=lng + randint(-50, 50) * 0.0001, 
            targa=f"BO{randint(100, 999):03d}{chr(65 + i % 26)}{chr(65 + (i+1) % 26)}",
            scadenzaRevisione=scadenza, dataImmatricolazione=data_immatricolazione
        )

    for i, (marca, modello) in enumerate(BIKE_MODELS):
        lat, lng = BOLOGNA_LOCATIONS[i % len(BOLOGNA_LOCATIONS)]
        add_vehicle_via_api(
            modello=modello, marca=marca, numeroPosti=1,
            percentualeBatteria=randint(40, 100), stato="disponibile",
            chilometraggioTotale=randint(100, 2500), tipologia="bicicletta",
            numeroPolizzaAssicurativa=f"BIKE{1000000 + i:06d}", 
            lat=lat + randint(-30, 30) * 0.0001,
            lng=lng + randint(-30, 30) * 0.0001
        )

    for i, (marca, modello) in enumerate(SCOOTER_MODELS):
        scadenza_scooter = random_date(start_date, end_date)
        lat, lng = BOLOGNA_LOCATIONS[i % len(BOLOGNA_LOCATIONS)]
        add_vehicle_via_api(
            modello=modello, marca=marca, numeroPosti=2,
            percentualeBatteria=randint(25, 90), stato="disponibile",
            chilometraggioTotale=randint(2000, 15000), tipologia="scooter",
            numeroPolizzaAssicurativa=f"SCT{1000000 + i:06d}", 
            lat=lat + randint(-40, 40) * 0.0001,
            lng=lng + randint(-40, 40) * 0.0001, 
            targa=f"BO{randint(10000, 99999):05d}",
            scadenzaRevisione=scadenza_scooter, dataImmatricolazione='2023-06-01'
        )

    for i, (marca, modello) in enumerate(ESCOOTER_MODELS):
        lat, lng = BOLOGNA_LOCATIONS[i % len(BOLOGNA_LOCATIONS)]
        add_vehicle_via_api(
            modello=modello, marca=marca, numeroPosti=1,
            percentualeBatteria=randint(35, 100), stato="disponibile",
            chilometraggioTotale=randint(50, 800), tipologia="monopattino",
            numeroPolizzaAssicurativa=f"ESC{1000000 + i:06d}", 
            lat=lat + randint(-25, 25) * 0.0001,
            lng=lng + randint(-25, 25) * 0.0001
        )

def populate_charging_infrastructure():
    print("Adding charging infrastructure...")
    
    for address in CHARGING_CENTERS:
        add_charging_center_via_api(address)

    for i, (lat, lng, tipo) in enumerate(CHARGING_LOCATIONS):
        add_charging_station_via_api(tipo, "libera", lat, lng, centroRicarica=(i % len(CHARGING_CENTERS)) + 1)
        
        add_charging_station_via_api(tipo, "libera", 
                                   lat + randint(-20, 20) * 0.0001, 
                                   lng + randint(-20, 20) * 0.0001)

def populate_clients(): 
    print("Adding clients...")
    
    start_date = date(2025, 9, 9)
    end_date = date(2030, 1, 1)
    
    ids = []
    for i, (nome, cognome, email, luogo_nascita, indirizzo) in enumerate(CLIENT_DATA):
        data_nascita = random_birth_date()
        scadenza_documento = random_date(start_date, end_date)
        scadenza_patente = random_date(start_date, end_date)
        
        doc_number = f"{''.join([chr(random.randint(65, 90)) for _ in range(2)])}" + \
                    f"{''.join([str(random.randint(0, 9)) for _ in range(7)])}"
        
        patente_number = f"BO{''.join([str(random.randint(0, 9)) for _ in range(7)])}"
        
        carta_number = f"{random.randint(4000, 4999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)} {random.randint(1000, 9999)}"
        
        account_id = add_account_and_client_via_api(
            email=email, 
            password="SecurePass2024!", 
            telefono=f"{random.randint(320, 399)} {random.randint(1000000, 9999999)}", 
            nome=nome, 
            cognome=cognome, 
            dataNascita=data_nascita, 
            luogoNascita=luogo_nascita, 
            indirizzoResidenza=f"{indirizzo}, {luogo_nascita if luogo_nascita != 'Bologna' else 'Bologna'}", 
            documento_numero=doc_number, 
            documento_scadenza=scadenza_documento, 
            documento_enteRilascio=f"Comune di {luogo_nascita}", 
            PatenteNumero=patente_number, 
            PatenteDataRilascio=random_date(date(2010, 1, 1), date(2024, 12, 31)), 
            PatenteEnteRilascio="Motorizzazione Civile di Bologna", 
            PatenteScadenza=scadenza_patente, 
            AB='B', 
            numeroCarta=carta_number.replace(" ", ""), 
            cvv=f"{random.randint(100, 999)}", 
            scadenza=scadenza_patente, 
            intestatario=f"{nome} {cognome}"
        )
        if account_id:
            ids.append(account_id)
    
    return ids

def populate_rentals(client_ids):
    print("Adding rentals...")
    
    total_vehicles = len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS) + len(ESCOOTER_MODELS)
    
    total_rentals = 600
    
    for rental in range(total_rentals):
        cliente = random.choices(client_ids, weights=[3]+[1]*6+[3]+[1]*2+[2]*2+[1]*2+[3])[0]
        veicolo = random.randint(1, total_vehicles)
        
        day = random.randint(1, 28)
        hour = random.choices(
            range(24), 
            weights=[1,1,1,1,1,2,4,8,12,15,18,20,20,18,18,20,22,20,15,12,8,6,4,2]
        )[0]
        
        data_inizio = f"2025-{random.randint(1, 6):02d}-{day:02d}T{hour:02d}:{random.randint(0, 59):02d}:00"
        
        if veicolo <= len(CAR_MODELS):
            duration = random.randint(45, 240)
        elif veicolo <= len(CAR_MODELS) + len(BIKE_MODELS):
            duration = random.randint(10, 60)
        elif veicolo <= len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS):
            duration = random.randint(15, 120)
        else:
            duration = random.randint(10, 60)
        
        data_fine = datetime.strptime(data_inizio, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=duration)
        data_fine = data_fine.strftime('%Y-%m-%dT%H:%M:%S')
        
        if veicolo <= len(CAR_MODELS):
            km_per_minute = random.uniform(0.3, 0.8)
        elif veicolo <= len(CAR_MODELS) + len(BIKE_MODELS):
            km_per_minute = random.uniform(0.1, 0.3)
        elif veicolo <= len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS):
            km_per_minute = random.uniform(0.2, 0.5)
        else:
            km_per_minute = random.uniform(0.1, 0.3)
        
        chilometri_percorsi = round(duration * km_per_minute, 1)
        
        esito_pagamento = 'successo'
        
        start_location = random.choice(BOLOGNA_LOCATIONS)
        end_location = random.choice(BOLOGNA_LOCATIONS)
        
        gps_inizio = f"{start_location[0] + random.uniform(-0.01, 0.01):.6f},{start_location[1] + random.uniform(-0.01, 0.01):.6f}"
        gps_fine = f"{end_location[0] + random.uniform(-0.01, 0.01):.6f},{end_location[1] + random.uniform(-0.01, 0.01):.6f}"
        
        add_rental_via_api(
            cliente=cliente, 
            veicolo=veicolo, 
            dataInizio=data_inizio, 
            dataFine=data_fine, 
            ChilometriPercorsi=chilometri_percorsi, 
            EsitoPagamento=esito_pagamento, 
            GPSInizio=gps_inizio, 
            GPSFine=gps_fine
        )

def populate_maintenances():
    print("Adding maintenance records...")
    
    total_vehicles = len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS) + len(ESCOOTER_MODELS)
    
    for month in range(1, 6):
        monthly_maintenances = random.randint(8, 15)
        
        for maintenance in range(monthly_maintenances):
            veicolo_id = random.randint(1, total_vehicles)
            officina_id = random.randint(1, 5)
            data_intervento = f"2025-{month:02d}-{random.randint(1, 28):02d}"
            tipo_intervento = 'manutenzione'
            descrizione, min_cost, max_cost = random.choice(MAINTENANCE_TYPES)
            costo = round(random.uniform(min_cost, max_cost), 2)
            
            add_maintenance_via_api(
                veicolo_id, officina_id, data_intervento, 
                tipo_intervento, costo, descrizione=descrizione
            )

def populate_charging_sessions():
    print("Adding charging sessions...")
    
    total_vehicles = len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS) + len(ESCOOTER_MODELS)
    total_charging_stations = len(CHARGING_LOCATIONS) * 2
    
    for month in range(1, 6):
        monthly_charges = random.randint(30, 60)
        
        for charge in range(monthly_charges):
            operatore_id = random.randint(1, 5)
            stazione_id = random.randint(1, total_charging_stations)
            veicolo_id = random.randint(1, total_vehicles)
            
            day = random.randint(1, 28)
            hour = random.choices(
                range(6, 22),
                weights=[2,4,6,8,10,12,15,18,20,18,15,12,10,8,6,4]
            )[0]
            
            data_inizio = f"2025-{month:02d}-{day:02d}T{hour:02d}:{random.randint(0, 59):02d}:00"
            
            if veicolo_id <= len(CAR_MODELS):
                charge_duration = random.randint(45, 180)
                kwh_caricati = random.uniform(15.0, 60.0)
            elif veicolo_id <= len(CAR_MODELS) + len(BIKE_MODELS):
                charge_duration = random.randint(20, 90)
                kwh_caricati = random.uniform(1.0, 8.0)
            elif veicolo_id <= len(CAR_MODELS) + len(BIKE_MODELS) + len(SCOOTER_MODELS):
                charge_duration = random.randint(30, 120)
                kwh_caricati = random.uniform(5.0, 25.0)
            else:
                charge_duration = random.randint(20, 90)
                kwh_caricati = random.uniform(1.0, 8.0)
            
            data_fine = datetime.strptime(data_inizio, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=charge_duration)
            data_fine = data_fine.strftime('%Y-%m-%dT%H:%M:%S')
            
            costo_per_kwh = random.uniform(0.35, 0.50)
            costo_sessione = round(kwh_caricati * costo_per_kwh, 2)
            
            add_charging_via_api(
                operatore_id, stazione_id, veicolo_id, 
                data_inizio, data_fine, 
                costoSessione=costo_sessione, 
                KWhCaricati=round(kwh_caricati, 2)
            )

def main():
    print("Starting database population...")
    
    try:
        connection = connect_to_database()
        
        print("Populating basic tables...")
        populate_tariffe(connection)
        populate_abbonamenti(connection)
        populate_operatore_ricarica(connection)
        populate_addetto_call_center(connection)
        populate_officine(connection)

        populate_vehicles()
        populate_charging_infrastructure()
        client_ids = populate_clients()
        populate_rentals(client_ids)
        populate_maintenances()
        populate_charging_sessions()
        
        print("Database population completed successfully!")
        
    except Exception as e:
        print(f"CRITICAL ERROR: Database population failed: {e}")
        raise
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
