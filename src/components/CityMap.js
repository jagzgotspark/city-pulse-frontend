import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';

function getPulseColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function getRadius(score) {
  const minRadius = 20;
  const maxRadius = 50;
  return minRadius + (score / 100) * (maxRadius - minRadius);
}

function getPulseClass(score) {
  if (score >= 70) return 'pulse-high';
  if (score >= 40) return 'pulse-mid';
  return 'pulse-low';
}

function CityMap({ cities }) {
  return (
    <div style={{ position: 'relative', height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer
        center={[22.5, 80.9]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap contributors © CARTO'
        />
        {cities && cities.map(city => (
          <CircleMarker
            key={city.city}
            center={[city.lat, city.lon]}
            radius={getRadius(city.pulse_score)}
            fillColor={getPulseColor(city.pulse_score)}
            fillOpacity={0.75}
            color={getPulseColor(city.pulse_score)}
            weight={2}
            className={getPulseClass(city.pulse_score)}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -getRadius(city.pulse_score) - 5]}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {city.city}
                </div>
                <div style={{
                  color: getPulseColor(city.pulse_score),
                  fontWeight: '800',
                  fontSize: '16px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                }}>
                  {city.pulse_score}
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '140px' }}>
                <strong style={{ fontSize: '16px' }}>{city.city}</strong>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: getPulseColor(city.pulse_score),
                  margin: '4px 0'
                }}>
                  {city.pulse_score}
                  <span style={{ fontSize: '14px', color: '#999', fontWeight: '400' }}>/100</span>
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  🌡️ {city.temperature}°C
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  💨 AQI {city.aqi}
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>
                  🌤️ {city.condition}
                </div>
                {city.summary && (
                  <p style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#666',
                    marginTop: '8px',
                    lineHeight: '1.5'
                  }}>
                    "{city.summary}"
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
        padding: '12px 16px',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ color: '#999', fontSize: '11px', marginBottom: '8px', fontWeight: '600' }}>
          PULSE SCORE
        </div>
        {[
          { color: '#22c55e', label: 'High Energy (70–100)' },
          { color: '#f59e0b', label: 'Moderate (40–69)' },
          { color: '#ef4444', label: 'Low Energy (0–39)' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '10px', height: '10px',
              borderRadius: '50%',
              backgroundColor: item.color
            }} />
            <span style={{ color: 'white', fontSize: '12px' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityMap;