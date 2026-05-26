import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { useState } from 'react';


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


function CityMap({ cities, flyTo }) {
  return (
    <div style={{ position: 'relative', height: '50vh', borderRadius: '16px', overflow: 'hidden' }}>

      <MapContainer
        center={[22.5, 80.9]}
        zoom={4.5}
        style={{ height: '100%', width: '100%' }}
        whenCreated={map => setTimeout(() => map.invalidateSize(), 100)}
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
              <div style={{
                textAlign: 'center',
                minWidth: '160px',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '8px'
              }}>
                {city.city}
              </div>

              <div style={{
                fontSize: '36px',
                fontWeight: '800',
                color: getPulseColor(city.pulse_score),
                lineHeight: 1
          }}>
            {city.pulse_score}
            <span style={{ fontSize: '14px', color: '#999', fontWeight: '400' }}>/100</span>
          </div>

          <div style={{
            display: 'inline-block',
            backgroundColor: getPulseColor(city.pulse_score),
            color: 'white',
            borderRadius: '12px',
            padding: '2px 10px',
            fontSize: '11px',
            fontWeight: '600',
            margin: '6px 0 10px'
          }}>
            {city.pulse_score >= 70 ? 'High Energy' : city.pulse_score >= 40 ? 'Moderate' : 'Low Energy'}
          </div>

          <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.8' }}>
            <div>🌡️ {city.temperature}°C</div>
            <div>🌤️ {city.condition}</div>
            <div>💨 AQI {city.aqi}</div>
          </div>

          {city.summary && (
            <p style={{
              fontSize: '12px',
              fontStyle: 'italic',
              color: '#666',
              marginTop: '10px',
              lineHeight: '1.5',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '8px',
              marginBottom: 0
          }}>
            "{city.summary}"
          </p>
        )}
    </div>
  </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
        padding: '8px 14px',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
          🌆 City Pulse — Live
        </div>
        <div style={{ color: '#22c55e', fontSize: '11px', marginTop: '2px' }}>
          ● Updates every 15 minutes
        </div>
      </div>

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