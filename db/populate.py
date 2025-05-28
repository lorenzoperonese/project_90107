import mysql.connector
from mysql.connector import Error
from datetime import date, datetime

def connect_to_database():
    """Connect to the MySQL database"""
    try:
        connection = mysql.connector.connect(
            host="localhost",      # Change as needed
            user="root",           # Change as needed
            password="rootpassword",           # Change as needed
            database="project_90107_db",   # Change as needed
            port=3307
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
        "chilometraggioTotale": chilometraggioTotale,
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
        response = requests.put(f"{base_url}/{res['data']["AccountID"]}/license", json=client_data)
        if response.status_code == 200 or response.status_code == 201:
            print("Client updated successfully!")
            return response.json()
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
        "id": res['data']["id"],
        "dataFine": dataFine,
        "GPSFine": GPSFine,
        "ChilometriPercorsi": ChilometriPercorsi,
        "EsitoPagamento": EsitoPagamento,
        "durataMinuti": dataFine - dataInizio,
    }
    
    try:
        response = requests.put(f"{base_url}/rentals/{res['data']["id"]}/end", json=rental_data)
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
        "veicoloID": veicoloID,
        "officinaID": officinaID,
        "dataIntervento": dataIntervento,
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
        "operatoreID": operatoreID,
        "stazioneID": stazioneID,
        "veicoloID": veicoloID,
        "dataInizio": dataInizio
    }
    
    try:
        response = requests.post(f"{base_url}/chargings", json=charging_data)
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
        "id": res['data']["id"],
        "dataFine": dataFine,
        "costoSessione": costoSessione,
        "KWhCaricati": KWhCaricati,
    }

    try:
        response = requests.put(f"{base_url}/chargings", json=charging_data)
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
 #       add_vehicle_via_api(modello="Tesla", marca="Tesla", numeroPosti=5, percentualeBatteria=100, stato="disponibile", chilometraggioTotale=10000, tipologia="auto", numeroPolizzaAssicurativa="1234567890", lat=44.4268, lng=8.9480, targa="1234567890", scadenzaRevisione='2025-01-01', dataImmatricolazione='2025-01-01')
  #      add_charging_station_via_api("CCS2", "libera", 44.4268, 8.9480)
  #      add_charging_center_via_api("Via Roma 123")
        add_account_and_client_via_api(email="cliendt1@example.com", password="password123", telefono="33311112221", nome="Dario", cognome="Rossi", dataNascita='1990-01-01', luogoNascita="Bologna", indirizzoResidenza="Via Roma 123", documento_numero="12345671890", documento_scadenza='2025-01-01', documento_enteRilascio="Bologna", PatenteNumero="12341567890", PatenteDataRilascio='2025-01-01', PatenteEnteRilascio="Bologna", PatenteScadenza='2025-01-01', AB="B", numeroCarta="123456178901234", cvv="123", scadenza='2025-01-01', intestatario="Dario Rossi")
        add_rental_via_api(cliente="1", veicolo="1", dataInizio='2025-01-01', dataFine='2025-01-02', ChilometriPercorsi=100, EsitoPagamento="successo", GPSInizio='44.4268,8.9480', GPSFine='44.4268,8.9480')
        add_maintenance_via_api("1", "1", date(2025, 1, 1), "manutenzione", 100)
        add_charging_via_api("1", "1", "1", date(2025, 1, 1), date(2025, 1, 2), 100)
        
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
