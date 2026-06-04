import { useState } from 'react';

const API = process.env.REACT_APP_API_URL;

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [weights, setWeights] = useState({ weather: 0.50, air: 0.35, events: 0.15 });
  const [saveStatus, setSaveStatus] = useState('');

  const login = async () => {
    try {
      const res = await fetch(`${API}/admin/stats?password=${password}`);
      if (res.status === 401) { setError('Wrong password'); return; }
      const data = await res.json();
      setStats(data);
      setWeights(data.current_weights);
      setAuthed(true);
    } catch {
      setError('Connection failed');
    }
  };

  const saveWeights = async () => {
    const total = weights.weather + weights.air + weights.events;
    if (Math.abs(total - 1.0) > 0.01) {
      setSaveStatus(`Weights must sum to 1.0 (currently ${total.toFixed(2)})`);
      return;
    }
    const res = await fetch(
      `${API}/admin/weights?password=${password}&weather=${weights.weather}&air=${weights.air}&events=${weights.events}`,
      { method: 'POST' }
    );
    const data = await res.json();
    if (data.weights) {
      setWeights(data.weights);
      setSaveStatus('✅ Weights updated');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (!authed) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '360px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>🔒 Admin</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>City Pulse internal dashboard</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>}
        <button onClick={login} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 32px' }}>⚙️ Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Weather Snapshots', value: stats.total_weather_snapshots },
              { label: 'Pulse Scores', value: stats.total_pulse_scores },
              { label: 'Cities Tracked', value: stats.cities.length }
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{s.value?.toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Weight tuning */}
        <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Scoring Weights</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px' }}>
            Must sum to 1.0 — currently {(weights.weather + weights.air + weights.events).toFixed(2)}
          </p>
          {[
            { key: 'weather', label: '🌤️ Weather', color: '#3b82f6' },
            { key: 'air', label: '💨 Air Quality', color: '#22c55e' },
            { key: 'events', label: '🎉 Events', color: '#f59e0b' }
          ].map(({ key, label, color }) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color }}>{(weights[key] * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights[key]}
                onChange={e => setWeights(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: color }}
              />
            </div>
          ))}
          <button onClick={saveWeights} style={{ padding: '10px 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Save Weights
          </button>
          {saveStatus && <span style={{ marginLeft: '12px', fontSize: '13px', color: '#22c55e' }}>{saveStatus}</span>}
        </div>

        {/* City data points */}
        {stats && (
          <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Data Points per City</h2>
            {stats.cities.map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{c.name}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{c.pulse_count?.toLocaleString()} snapshots</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}