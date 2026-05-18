import PulseGauge from './PulseGauge';

function getPulseColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function getPulseLabel(score) {
  if (score >= 70) return 'High Energy';
  if (score >= 40) return 'Moderate';
  return 'Low Energy';
}

function CityCard({ city, onClick }) {
  const color = getPulseColor(city.pulse_score);

  return (
    <div
      onClick={() => onClick(city)}
      style={{
        border: `2px solid ${color}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{city.city}</h2>
        <div style={{
          backgroundColor: color,
          color: 'white',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {getPulseLabel(city.pulse_score)}
        </div>
      </div>

      <PulseGauge score={city.pulse_score} size={140} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        margin: '12px 0'
      }}>
        <div style={{ color: '#555', fontSize: '14px' }}>🌡️ {city.temperature}°C</div>
        <div style={{ color: '#555', fontSize: '14px' }}>🌤️ {city.condition}</div>
        <div style={{ color: '#555', fontSize: '14px' }}>💨 AQI {city.aqi}</div>
      </div>

      {city.summary && (
        <p style={{
          fontSize: '13px',
          color: '#666',
          fontStyle: 'italic',
          margin: '12px 0 0',
          lineHeight: '1.5',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '12px'
        }}>
          "{city.summary}"
        </p>
      )}
    </div>
  );
}

export default CityCard;