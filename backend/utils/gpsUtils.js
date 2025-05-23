function parseGpsString(gpsString) {
  if (gpsString && typeof gpsString === 'string' && gpsString.includes(',')) {
    const [lat, lng] = gpsString.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      return `POINT(${lng} ${lat})`; // MySQL vuole (long lat)
    }
  }
  return null;
}

module.exports = { parseGpsString };