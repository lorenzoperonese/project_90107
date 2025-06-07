import mysql.connector, os, time
from mysql.connector import Error
from datetime import date, datetime

def connect_to_database():
    """Connect to the MySQL database"""
    try:
        connection = mysql.connector.connect(
            host="localhost",      # Change as needed
            user="root",           # Change as needed
            password="lelelelesql",           # Change as needed
            database="vehicledb",   # Change as needed
            port=3306
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def populate_tariffe(connection):
    """Populate the Tariffa table"""
    cursor = connection.cursor()
    
    # Clear existing data (optional)
    cursor.execute("DELETE FROM Tariffa")
    
    # Tariffe data
    tariffe = [
        ('auto', 0.50),
        ('scooter', 0.30),
        ('bicicletta', 0.15),
        ('monopattino', 0.20)
    ]
    
    # Insert data
    query = "INSERT INTO Tariffa (CategoriaVeicolo, CostoAlMinuto) VALUES (%s, %s)"
    cursor.executemany(query, tariffe)
    
    connection.commit()
    print(f"Inserted {cursor.rowcount} records into Tariffa table")
    cursor.close()

def populate_officine(connection):
    # Nome, Indirizzo, NumeroTelefono
    cursor = connection.cursor()
    # Clear existing data (optional)
    cursor.execute("DELETE FROM Officina")

    # Officine data
    officine = [
        ('Officina 1', 'Via Roma 1', '0511234567'),
        ('Officina 2', 'Via Milano 2', '0512345678'),
        ('Officina 3', 'Via Napoli 3', '0513456789'),
        ('Officina 4', 'Via Torino 4', '0514567890'),
        ('Officina 5', 'Via Firenze 5', '0515678901')
    ]

    # Insert data
    query = "INSERT INTO Officina (Nome, Indirizzo, NumeroTelefono) VALUES (%s, %s, %s)"
    cursor.executemany(query, officine)

    connection.commit()
    print(f"Inserted {cursor.rowcount} records into Officina table")
    cursor.close()


def populate_abbonamenti(connection):
    """Populate the Abbonamento table"""
    cursor = connection.cursor()
    
    # Clear existing data (optional)
    cursor.execute("DELETE FROM Abbonamento")
    
    # Abbonamenti data
    abbonamenti = [
        ('giornaliero', 40),
        ('settimanale', 120),
        ('mensile', 300)
    ]
    
    # Insert data
    query = "INSERT INTO Abbonamento (Durata, Costo) VALUES (%s, %s)"
    cursor.executemany(query, abbonamenti)
    
    connection.commit()
    print(f"Inserted {cursor.rowcount} records into Abbonamento table")
    cursor.close()

def populate_operatore_ricarica(connection):
    """Populate the OperatoreRicarica table"""
    cursor = connection.cursor()
    
    # First create Account entries
    account_query = """
    INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
    VALUES (%s, %s, %s, %s, %s)
    """
    
    account_data = [
        ('op1@example.com', 'password123', '3331112223', 'attivo', True),
        ('op2@example.com', 'password123', '3331112224', 'attivo', True),
        ('op3@example.com', 'password123', '3331112225', 'attivo', True),
        ('op4@example.com', 'password123', '3331112226', 'attivo', True),
        ('op5@example.com', 'password123', '3331112227', 'attivo', True)
    ]
    
    cursor.executemany(account_query, account_data)
    connection.commit()
    
    # Get inserted account IDs
    cursor.execute("SELECT ID FROM Account WHERE Email IN ('op1@example.com', 'op2@example.com', 'op3@example.com', 'op4@example.com', 'op5@example.com')")
    account_ids = [row[0] for row in cursor.fetchall()]
    
    # Insert OperatoreRicarica data
    operatori_data = [
        (account_ids[0], 'Marco', 'Rossi', date(1985, 5, 15), 'Bologna', 'Via Roma 123', 1800.00),
        (account_ids[1], 'Laura', 'Bianchi', date(1990, 8, 22), 'Bologna', 'Via Milano 456', 1850.00),
        (account_ids[2], 'Giovanni', 'Verdi', date(1988, 3, 10), 'Bologna', 'Via Napoli 789', 1820.00),
        (account_ids[3], 'Mario', 'Bianchi', date(1990, 1, 1), 'Bologna', 'Via Milano 123', 1850.00),
        (account_ids[4], 'Luigi', 'Neri', date(1985, 12, 12), 'Bologna', 'Via Napoli 456', 1800.00)
    ]
    
    operatori_query = """
    INSERT INTO OperatoreRicarica (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(operatori_query, operatori_data)
    connection.commit()
    
    print(f"Inserted {len(operatori_data)} records into OperatoreRicarica table")
    cursor.close()

def populate_addetto_call_center(connection):
    """Populate the AddettoCallCenter table"""
    cursor = connection.cursor()
    
    # First create Account entries
    account_query = """
    INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
    VALUES (%s, %s, %s, %s, %s)
    """
    
    account_data = [
        ('call1@example.com', 'password123', '3334445556', 'attivo', True),
        ('call2@example.com', 'password123', '3334445557', 'attivo', True),
        ('call3@example.com', 'password123', '3334445558', 'attivo', True),
        ('call4@example.com', 'password123', '3334445559', 'attivo', True),
        ('call5@example.com', 'password123', '3334445560', 'attivo', True)
    ]
    
    cursor.executemany(account_query, account_data)
    connection.commit()
    
    # Get inserted account IDs
    cursor.execute("SELECT ID FROM Account WHERE Email IN ('call1@example.com', 'call2@example.com', 'call3@example.com', 'call4@example.com', 'call5@example.com')")
    account_ids = [row[0] for row in cursor.fetchall()]
    
    # Insert AddettoCallCenter data
    addetti_data = [
        (account_ids[0], 'Sofia', 'Esposito', date(1992, 4, 18), 'Ravenna', 'Via Torino 123', 1750.00),
        (account_ids[1], 'Antonio', 'Russo', date(1988, 9, 30), 'Bologna', 'Via Palermo 456', 1780.00),
        (account_ids[2], 'Francesca', 'Conti', date(1995, 2, 22), 'Rimini', 'Via Bologna 789', 1730.00),
        (account_ids[3], 'Giovanna', 'Gallo', date(1990, 5, 10), 'Bologna', 'Via Bologna 123', 1750.00),
        (account_ids[4], 'Maria', 'De Luca', date(1985, 11, 15), 'Bologna', 'Via Bologna 456', 1700.00)
    ]
    
    addetti_query = """
    INSERT INTO AddettoCallCenter (AccountID, Nome, Cognome, DataNascita, LuogoNascita, Indirizzo, Stipendio)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(addetti_query, addetti_data)
    connection.commit()
    
    print(f"Inserted {len(addetti_data)} records into AddettoCallCenter table")
    cursor.close()


import requests
import json

def add_vehicle_via_api(
    marca, modello, numeroPosti, percentualeBatteria, stato, 
    chilometraggioTotale, tipologia, numeroPolizzaAssicurativa,
    lat, lng, targa=None, scadenzaRevisione=None, dataImmatricolazione=None,
    base_url="http://localhost:30000/api"
):
    
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
    
    # Add required fields for auto/scooter
    if tipologia in ['auto', 'scooter']:
        if not all([targa, scadenzaRevisione, dataImmatricolazione]):
            raise ValueError("targa, scadenzaRevisione, and dataImmatricolazione are required for auto/scooter")
        
        vehicle_data.update({
            "Targa": targa,
            "ScadenzaRevisione": scadenzaRevisione,
            "DataImmatricolazione": dataImmatricolazione
        })
    
    try:
        response = requests.post(f"{base_url}/vehicles", json=vehicle_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Vehicle added successfully!")
            return response.json()
        else:
            print(f"Failed to add vehicle. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding vehicle via API: {e}")
        return None

def add_account_and_client_via_api(
    email, password, telefono, nome, cognome, dataNascita,
    luogoNascita, indirizzoResidenza, documento_numero, documento_scadenza,
    documento_enteRilascio, PatenteNumero, PatenteDataRilascio, PatenteEnteRilascio, PatenteScadenza, AB,
    base_url="http://localhost:30000/api", 
    numeroCarta=None, cvv=None, scadenza=None, intestatario=None
):
    
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
        response = requests.post(f"{base_url}/clients/register", json=client_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Client registered successfully!")
            res =  response.json()
        else:
            print(f"Failed to register client. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error registering client via API: {e}")
        return None

    client_data = {
        "PatenteNumero": PatenteNumero,
        "PatenteDataRilascio": PatenteDataRilascio,
        "PatenteEnteRilascio": PatenteEnteRilascio,
        "PatenteScadenza": PatenteScadenza,
        "AB": AB
    }

    try:
        response = requests.put(f"{base_url}/clients/{res['data']['AccountID']}/license", json=client_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Client updated successfully!")
            return res['data']['AccountID']
        else:
            print(f"Failed to update client. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error updating client via API: {e}")
        return None

def add_charging_station_via_api(
    tipologiaPresa, stato, lat, lng, centroRicarica=None,
    base_url="http://localhost:30000/api"
):
    station_data = {
        "TipologiaPresa": tipologiaPresa,
        "Stato": stato,
        "GPS": str(lat) + ',' + str(lng)
    }
    
    # If a charging center ID is provided, associate the station with it
    if centroRicarica:
        station_data["CentroRicaricaID"] = centroRicarica
    
    try:
        response = requests.post(f"{base_url}/charging-stations", json=station_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Charging station added successfully!")
            return response.json()
        else:
            print(f"Failed to add charging station. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding charging station via API: {e}")
        return None

def add_charging_center_via_api(
    indirizzo, base_url="http://localhost:30000/api"
):
    
    center_data = {
        "Indirizzo": indirizzo
    }
    
    try:
        response = requests.post(f"{base_url}/charging-centers", json=center_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Charging center added successfully!")
            return response.json()
        else:
            print(f"Failed to add charging center. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding charging center via API: {e}")
        return None
    
def add_rental_via_api(
    cliente, veicolo, dataInizio, dataFine, ChilometriPercorsi, EsitoPagamento,
    base_url="http://localhost:30000/api", GPSInizio=None, GPSFine=None
):
    
    rental_data = {
        "ClienteAccountID": cliente,
        "VeicoloID": veicolo,
        "GPSInizio": GPSInizio,
        "DataInizio": dataInizio,
    }
    
    try:
        response = requests.post(f"{base_url}/rentals/start", json=rental_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Rental added successfully!")
            res = response.json()
        else:
            print(f"Failed to add rental. Status code: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error adding rental via API: {e}")
        return None
    
    rental_data = {
        "GPSFine": GPSFine,
        "ChilometriPercorsi": ChilometriPercorsi,
        "EsitoPagamento": EsitoPagamento,
        "DataFine": dataFine,
    }

    
    
    try:
        response = requests.put(f"{base_url}/rentals/{res['data']['id']}/end", json=rental_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Rental added successfully!")
            return response.json()
        else:
            print(f"Failed to add rental. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding rental via API: {e}")
        return None
    
def add_maintenance_via_api(
    veicoloID, officinaID, dataIntervento, TipoIntervento, Costo,
    base_url="http://localhost:30000/api",
    descrizione=None, note=None
):
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
        response = requests.post(f"{base_url}/maintenances", json=maintenance_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Maintenance added successfully!")
            return response.json()
        else:
            print(f"Failed to add maintenance. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding maintenance via API: {e}")
        return None

def add_charging_via_api(
    operatoreID, stazioneID, veicoloID, dataInizio, dataFine,
    base_url="http://localhost:30000/api",
    costoSessione=None, KWhCaricati=None
):  
    charging_data = {
        "OperatoreAccountID": operatoreID,
        "StazioneRicaricaID": stazioneID,
        "VeicoloID": veicoloID,
        "DataInizio": dataInizio,
    }
    
    try:
        response = requests.post(f"{base_url}/charges/start", json=charging_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Charging added successfully!")
            res = response.json()
        else:
            print(f"Failed to add charging. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding charging via API: {e}")
        return None
    
    charging_data = {
        "CostoSessione": costoSessione,
        "KWhCaricati": KWhCaricati,
        "DataFine": dataFine,
    }


    try:
        response = requests.put(f"{base_url}/charges/{res['data']['id']}/end", json=charging_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Charging added successfully!")
            return response.json()
        else:
            print(f"Failed to add charging. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error adding charging via API: {e}")
        return None


def main():
    # Connect to the database
    connection = connect_to_database()
    if connection is None:
        return
    
    # Populate tables
    try:
        populate_tariffe(connection)
        populate_abbonamenti(connection)
        populate_operatore_ricarica(connection)
        populate_addetto_call_center(connection)
        populate_officine(connection)


        import random
        from random import randint
        from datetime import timedelta

        ## For loop to add multiple vehicles with different values
        def random_date(start, end):
            """Generate a random date between start and end (inclusive)."""
            delta = end - start
            random_days = randint(0, delta.days)
            return (start + timedelta(days=random_days)).strftime('%Y-%m-%d')

        start_date = date(2025, 9, 9)
        end_date = date(2030, 1, 1)

        for i in range(1, 10):
            scadenza = random_date(start_date, end_date)
            add_vehicle_via_api(
            modello=f"Auto{i}", marca="Marca", numeroPosti=5,
            percentualeBatteria=randint(20, 100), stato="disponibile",
            chilometraggioTotale=10000 + i * 1000, tipologia="auto",
            numeroPolizzaAssicurativa=f"1234567890{i}", lat=44.4268 + i * 0.001,
            lng=8.9480 + i * 0.001, targa=f"TARGA{i}",
            scadenzaRevisione=scadenza, dataImmatricolazione='2025-01-01'
            )
            # aggiungi qualche bici
            add_vehicle_via_api(
            modello=f"Bicicletta{i}", marca="Marca", numeroPosti=1,
            percentualeBatteria=randint(20, 100), stato="disponibile",
            chilometraggioTotale=500 + i * 100, tipologia="bicicletta",
            numeroPolizzaAssicurativa=f"1234567890{i}", lat=44.4268 + i * 0.001,
            lng=8.9480 + i * 0.001
            )
            # aggiungi qualche scooter
            scadenza_scooter = random_date(start_date, end_date)
            add_vehicle_via_api(
            modello=f"Scooter{i}", marca="Marca", numeroPosti=2,
            percentualeBatteria=randint(20, 100), stato="disponibile",
            chilometraggioTotale=1000 + i * 100, tipologia="scooter",
            numeroPolizzaAssicurativa=f"1234567890{i}", lat=44.4268 + i * 0.001,
            lng=8.9480 + i * 0.001, targa=f"TARGA{i+10}",
            scadenzaRevisione=scadenza_scooter, dataImmatricolazione='2025-01-01'
            )
            ## aggiungi qualche monopattino
            add_vehicle_via_api(
            modello=f"Monopattino{i}", marca="Marca", numeroPosti=1,
            percentualeBatteria=randint(20, 100), stato="disponibile",
            chilometraggioTotale=200 + i * 50, tipologia="monopattino",
            numeroPolizzaAssicurativa=f"1234567890{i}", lat=44.4268 + i * 0.001,
            lng=8.9480 + i * 0.001
            )
        

        for i in range(1, 6):
            add_charging_center_via_api(f"Via Roma {i * 10} {i * 10}")

        for i in range(1, 30):
            tipi = ["Schuko", "Type2", "CCS2"]
            add_charging_station_via_api(tipi[i % 3], "libera", 44.4268 + i * 0.001, 8.9480 + i * 0.001, centroRicarica=i % 5 + 1)
            add_charging_station_via_api(tipi[(i + 2) % 3], "libera", 46.2345 + i * 0.001, 10.2434 + i * 0.001)

        # For loop per creare 10 utenti di esempio con date di nascita casuali e scadenze che vanno da 2025-09-09 a 5 anni. Le date sono stringhe nel formato 'YYYY-MM-DD'.
        import random
        from datetime import timedelta
        def random_date(start, end):
            """Generate a random date between start and end (inclusive)."""
            delta = end - start
            random_days = random.randint(0, delta.days)
            return (start + timedelta(days=random_days)).strftime('%Y-%m-%d')
        
        start_date = date(2025, 9, 9)
        end_date = date(2030, 1, 1)
        ids = []
        for i in range(1, 11):
            data_nascita = "1990-01-01"  # Fissa una data di nascita per tutti gli utenti
            scadenza_documento = random_date(start_date, end_date)
            scadenza_patente = random_date(start_date, end_date)
            ids.append(add_account_and_client_via_api(
                email=f"client{i}@example.com", password="password123", telefono=f"333111122{i}", nome=f"Nome{i}", cognome=f"Cognome{i}", dataNascita=data_nascita, luogoNascita="Bologna", indirizzoResidenza="Via Roma 123", documento_numero=f"34253453{i}", documento_scadenza=scadenza_documento, documento_enteRilascio="Bologna", PatenteNumero=f"12341567{i}", PatenteDataRilascio='2025-01-01', PatenteEnteRilascio="Bologna", PatenteScadenza=scadenza_patente, AB="B", numeroCarta=f"23423423434234{i}", cvv="123", scadenza=scadenza_patente, intestatario=f"Nome Cognome{i}"
            ))


        # Inserisci dei noleggi usando come ID clienti ids e i veicoli id da 1 a 36
        for i in range(1, 500):
            cliente = random.choice(ids)
            veicolo = random.randint(1, 36)
            # Genera una data di base randomica tra il 2025-01-01 e il 2025-12-31 in stringa formato 'YYYY-MM-DDTHH:MM:SS'
            data_inizio = f"2025-05-{random.randint(1, 27):02d}T{random.randint(0, 23):02d}:{random.randint(0, 59):02d}:00"
            ## data_fine è data_inizio + un valore random tra 1 e 3 ore in stringa formato 'YYYY-MM-DDTHH:MM:SS'
            data_fine = datetime.strptime(data_inizio, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=random.randint(30, 300))
            data_fine = data_fine.strftime('%Y-%m-%dT%H:%M:%S')
            chilometri_percorsi = random.randint(5, 30)
            esito_pagamento = "successo"
            gps_inizio = f"{44.4268 + i * 0.001},{8.9480 + i * 0.001}"
            gps_fine = f"{44.4268 + i * 0.001},{8.9480 + i * 0.001}"
            add_rental_via_api(cliente=cliente, veicolo=veicolo, dataInizio=data_inizio, dataFine=data_fine, ChilometriPercorsi=chilometri_percorsi, EsitoPagamento=esito_pagamento, GPSInizio=gps_inizio, GPSFine=gps_fine)

        for i in range(1, 1000):
            cliente = random.choice(ids)
            veicolo = random.randint(1, 36)
            # Genera una data di base randomica tra il 2025-01-01 e il 2025-12-31 in stringa formato 'YYYY-MM-DDTHH:MM:SS'
            data_inizio = f"2025-{random.randint(1, 5):02d}-{random.randint(1, 27):02d}T{random.randint(0, 23):02d}:{random.randint(0, 59):02d}:00"
            ## data_fine è data_inizio + un valore random tra 1 e 3 ore in stringa formato 'YYYY-MM-DDTHH:MM:SS'
            data_fine = datetime.strptime(data_inizio, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=random.randint(30, 300))
            data_fine = data_fine.strftime('%Y-%m-%dT%H:%M:%S')
            chilometri_percorsi = random.randint(5, 30)
            esito_pagamento = "successo"
            gps_inizio = f"{44.4268 + i * 0.001},{8.9480 + i * 0.001}"
            gps_fine = f"{44.4268 + i * 0.001},{8.9480 + i * 0.001}"
            add_rental_via_api(cliente=cliente, veicolo=veicolo, dataInizio=data_inizio, dataFine=data_fine, ChilometriPercorsi=chilometri_percorsi, EsitoPagamento=esito_pagamento, GPSInizio=gps_inizio, GPSFine=gps_fine)


        # Aggiuni 10 manutenzioi a veicoli random da 1 a 36 con date stringhe randomiche tra 2025-04-01 e 2025-05-01
        for i in range(1, 300):
            veicolo_id = random.randint(1, 36)
            officina_id = random.randint(1, 5)  # Assuming you have 5 officine
            data_intervento = f"2025-05-{random.randint(1, 27):02d}"
            tipo_intervento = "manutenzione"
            costo = random.uniform(50.0, 200.0)
            add_maintenance_via_api(veicolo_id, officina_id, data_intervento, tipo_intervento, costo)

        ## Aggiungi 10 ricariche con operatore random da 1 a 5, stazione random da 1 a 30, veicolo random da 1 a 36, date stringhe tra 2025-05-01T10:00:00 e 2025-05-01T11:00:00
        for i in range(1, 800):
            operatore_id = random.randint(1, 5)
            stazione_id = random.randint(1, 30)
            veicolo_id = random.randint(1, 36)
            data_inizio = f"2025-05-{random.randint(1, 27):02d}T{random.randint(10, 11):02d}:{random.randint(0, 59):02d}:00"
            data_fine = datetime.strptime(data_inizio, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=random.randint(30, 120))
            data_fine = data_fine.strftime('%Y-%m-%dT%H:%M:%S')
            
            add_charging_via_api(operatore_id, stazione_id, veicolo_id, data_inizio, data_fine, costoSessione=random.uniform(5.0, 20.0), KWhCaricati=random.uniform(10.0, 50.0))
        
        
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
