import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { useMap } from 'react-leaflet';


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


function FlyToHandler({ flyTo }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lon], 10, { duration: 1.5 });
    }
  }, [flyTo, map]);
  return null;
}

function ZoomHandler({ cities, onZoomChange }) {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom(), map.getCenter());
    };
    map.on('zoomend', handleZoom);
    handleZoom();
    return () => map.off('zoomend', handleZoom);
  }, [map, onZoomChange]);
  return null;
}

function CityMap({ cities, flyTo }) {
  const [neighbourhoods, setNeighbourhoods] = useState({});
  const [zoomedCity, setZoomedCity] = useState(null);

   const handleZoomChange = useCallback((zoom, center) => {
    if (zoom < 8) {
      setZoomedCity(null);
      return;
    }
    // find which city is closest to map center
    const closest = cities?.reduce((best, city) => {
      const dist = Math.abs(city.lat - center.lat) + Math.abs(city.lon - center.lng);
      return (!best || dist < best.dist) ? { city, dist } : best;
    }, null);

    if (!closest) return;
    const cityName = closest.city.city;
    setZoomedCity(cityName);

    if (!neighbourhoods[cityName]) {
      fetch(`${process.env.REACT_APP_API_URL}/neighbourhood/${cityName}`)
        .then(r => r.json())
        .then(data => {
          if (data.neighbourhoods) {
            setNeighbourhoods(prev => ({ ...prev, [cityName]: data.neighbourhoods }));
          }
        })
        .catch(() => {});
    }
  }, [cities, neighbourhoods]);

  const activeNeighbourhoods = zoomedCity && neighbourhoods[zoomedCity]
    ? neighbourhoods[zoomedCity]
    : null;

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
        <FlyToHandler flyTo={flyTo} />
        <ZoomHandler cities={cities} onZoomChange={handleZoomChange} />

        {/* City circles — hide the zoomed city */}
        {cities && cities.map(city => (
          zoomedCity === city.city ? null : (
            <CircleMarker
              key={city.city}
              center={[city.lat, city.lon]}
              radius={getRadius(city.pulse_score)}
              fillColor={getPulseColor(city.pulse_score)}
              fillOpacity={0.75}
              color={getPulseColor(city.pulse_score)}
              weight={2}
            >
              <Tooltip permanent direction="top" offset={[0, -getRadius(city.pulse_score) - 5]}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {city.city}
                  </div>
                  <div style={{ color: getPulseColor(city.pulse_score), fontWeight: '800', fontSize: '16px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {city.pulse_score}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          )
        ))}

        {/* Neighbourhood circles — shown when zoomed in */}
        {activeNeighbourhoods && activeNeighbourhoods.map(n => (
          <CircleMarker
            key={n.neighbourhood}
            center={[n.lat, n.lon]}
            radius={12}
            fillColor={getPulseColor(n.pulse_score)}
            fillOpacity={0.85}
            color={getPulseColor(n.pulse_score)}
            weight={2}
          >
            <Tooltip permanent direction="top" offset={[0, -16]}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '11px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  {n.neighbourhood}
                </div>
                <div style={{ color: getPulseColor(n.pulse_score), fontWeight: '800', fontSize: '13px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  {n.pulse_score}
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '140px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>{n.neighbourhood}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: getPulseColor(n.pulse_score) }}>
                  {n.pulse_score}<span style={{ fontSize: '12px', color: '#999' }}>/100</span>
                </div>
                <div style={{ fontSize: '12px', color: '#444', marginTop: '8px', lineHeight: '1.8' }}>
                  <div>🌡️ {n.temperature}°C</div>
                  <div>💨 AQI {n.aqi}</div>
                  <div>🌤️ {n.condition}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* branding overlay */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '8px 14px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>🌆 City Pulse — Live</div>
        <div style={{ color: '#22c55e', fontSize: '11px', marginTop: '2px' }}>● Updates every 15 minutes</div>
      </div>

      {/* legend */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '12px 16px', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
        <div style={{ color: '#999', fontSize: '11px', marginBottom: '8px', fontWeight: '600' }}>PULSE SCORE</div>
        {[
          { color: '#22c55e', label: 'High Energy (70–100)' },
          { color: '#f59e0b', label: 'Moderate (40–69)' },
          { color: '#ef4444', label: 'Low Energy (0–39)' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
            <span style={{ color: 'white', fontSize: '12px' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CityMap;