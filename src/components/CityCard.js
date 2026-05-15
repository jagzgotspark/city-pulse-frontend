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
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        backgroundColor: '#ffffff'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{city.city}</h2>
        <div style={{
          backgroundColor: color,
          color: 'white',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {getPulseLabel(city.pulse_score)}
        </div>
      </div>

      <PulseGauge score={city.pulse_score} size={140} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
        <div style={{ color: '#555', fontSize: '14px' }}>
          🌡️ {city.temperature}°C
        </div>
        <div style={{ color: '#555', fontSize: '14px' }}>
          🌤️ {city.condition}
        </div>
        <div style={{ color: '#555', fontSize: '14px' }}>
          💨 AQI {city.aqi}
        </div>
      </div>
    </div>
  );
}

export default CityCard;