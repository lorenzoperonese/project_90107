function parseGpsString(gpsString) {
  // Verifica che l'input sia una stringa non vuota
  if (!gpsString || typeof gpsString !== 'string') {
    return null;
  }
  
  // Rimuovi spazi extra e verifica che contenga una virgola
  const trimmed = gpsString.trim();
  if (!trimmed.includes(',')) {
    return null;
  }
  
  // Dividi per virgola e converti in numeri
  const parts = trimmed.split(',');
  if (parts.length !== 2) {
    return null;
  }
  
  const lat = parseFloat(parts[0].trim());
  const lng = parseFloat(parts[1].trim());
  
  // Verifica che siano numeri validi e nei range corretti
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }
  
  // Verifica che le coordinate siano nei range validi
  // Latitudine: -90 a 90, Longitudine: -180 a 180
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  
  // MySQL POINT vuole (longitudine latitudine)
  return `POINT(${lng} ${lat})`;
}

module.exports = { parseGpsString };