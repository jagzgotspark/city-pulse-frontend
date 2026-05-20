import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

function getPulseColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function CityMap({ cities }) {
  return (
    <div style={{ height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer
        center={[22.5, 80.9]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {cities && cities.map(city => (
          <CircleMarker
            key={city.city}
            center={[city.lat, city.lon]}
            radius={30}
            fillColor={getPulseColor(city.pulse_score)}
            fillOpacity={0.7}
            color={getPulseColor(city.pulse_score)}
            weight={2}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <strong style={{ fontSize: '16px' }}>{city.city}</strong>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: getPulseColor(city.pulse_score)
                }}>
                  {city.pulse_score}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>/ 100</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>
                  🌡️ {city.temperature}°C · AQI {city.aqi}
                </div>
                {city.summary && (
                  <p style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#555',
                    marginTop: '6px'
                  }}>
                    "{city.summary}"
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CityMap;