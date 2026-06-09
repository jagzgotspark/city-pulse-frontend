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

export default function PulseLeaderboard({ cities }) {
  const sorted = [...(cities || [])].sort((a, b) => b.pulse_score - a.pulse_score);

  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '32px 40px',
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Live City Rankings
          </h1>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
            updated every 15 min
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sorted.map((city, i) => {
            const color = getPulseColor(city.pulse_score);
            return (
              <div key={city.city} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto auto',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: i === 0 ? '#f8fafc' : 'transparent',
                border: i === 0 ? '1px solid #e2e8f0' : '1px solid transparent',
                transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = i === 0 ? '#f8fafc' : 'transparent'}
              >
                {/* Rank */}
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: i === 0 ? '#f59e0b' : '#94a3b8',
                  textAlign: 'center'
                }}>
                  {i === 0 ? '🏆' : `#${i + 1}`}
                </span>

                {/* City name + condition */}
                <div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                    {city.city}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>
                    {city.temperature}°C · {city.condition}
                  </span>
                </div>

                {/* AQI badge */}
                {city.real_aqi && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: city.aqi_color,
                    backgroundColor: city.aqi_color + '18',
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    AQI {city.real_aqi}
                  </span>
                )}

                {/* Score + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color, fontVariantNumeric: 'tabular-nums' }}>
                    {city.pulse_score}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color,
                    backgroundColor: color + '18',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap'
                  }}>
                    {getPulseLabel(city.pulse_score)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}