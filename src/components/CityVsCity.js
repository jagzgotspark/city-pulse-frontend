import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL;

function MetricRow({ label, a, b, unit = '', higherIsBetter = true }) {
  const aWins = higherIsBetter ? a > b : a < b;
  const bWins = higherIsBetter ? b > a : b < a;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{
        textAlign: 'right',
        fontSize: '15px',
        fontWeight: aWins ? '700' : '400',
        color: aWins ? '#0f172a' : '#94a3b8'
      }}>
        {a}{unit} {aWins && '←'}
      </div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textAlign: 'center', minWidth: '100px' }}>
        {label}
      </div>
      <div style={{
        fontSize: '15px',
        fontWeight: bWins ? '700' : '400',
        color: bWins ? '#0f172a' : '#94a3b8'
      }}>
        {bWins && '→'} {b}{unit}
      </div>
    </div>
  );
}

export default function CityVsCity({ cities }) {
  const cityNames = cities?.map(c => c.city) || [];
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cityNames.length >= 2 && !cityA && !cityB) {
      setCityA(cityNames[0]);
      setCityB(cityNames[1]);
    }
  }, [cities]);

  useEffect(() => {
    if (!cityA || !cityB) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/pulse/${cityA}`).then(r => r.json()),
      fetch(`${API}/pulse/${cityB}`).then(r => r.json())
    ]).then(([a, b]) => {
      setDataA(a);
      setDataB(b);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [cityA, cityB]);

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    backgroundColor: 'white',
    cursor: 'pointer',
    flex: 1
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>City vs City</h3>
      <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>Compare any two cities head to head</p>

      {/* Dropdowns */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <select value={cityA} onChange={e => setCityA(e.target.value)} style={selectStyle}>
          {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '700' }}>vs</span>
        <select value={cityB} onChange={e => setCityB(e.target.value)} style={selectStyle}>
          {cityNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {loading && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>}

      {dataA && dataB && !loading && (
        <>
          {/* City name headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', marginBottom: '8px' }}>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{cityA}</div>
            <div style={{ minWidth: '100px' }} />
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{cityB}</div>
          </div>

          <MetricRow label="Pulse Score" a={dataA.pulse_score} b={dataB.pulse_score} />
          <MetricRow label="Temperature" a={dataA.temperature} b={dataB.temperature} unit="°C" higherIsBetter={false} />
          <MetricRow label="AQI" a={dataA.aqi} b={dataB.aqi} higherIsBetter={false} />
          <MetricRow label="Weather Score" a={dataA.weather_score} b={dataB.weather_score} />
          <MetricRow label="Air Score" a={dataA.air_score} b={dataB.air_score} />
          <MetricRow label="Humidity" a={dataA.humidity} b={dataB.humidity} unit="%" higherIsBetter={false} />

          {/* Winner */}
          {dataA.pulse_score !== dataB.pulse_score && (
            <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Better city right now: </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                {dataA.pulse_score > dataB.pulse_score ? cityA : cityB} 🏆
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}