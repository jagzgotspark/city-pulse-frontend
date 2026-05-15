import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCityHistory } from '../api';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function HistoryChart({ cityName }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    getCityHistory(cityName, 24)
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cityName]);

  if (loading) return <p>Loading history...</p>;
  if (!history || history.snapshots.length === 0) {
    return <p style={{ color: '#666' }}>Not enough history yet — check back after a few collection runs.</p>;
  }

  const chartData = history.snapshots.map(s => ({
    time: formatTime(s.timestamp),
    temperature: s.temperature,
    aqi: s.aqi
  }));

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>
        {cityName} — Last 24 Hours
      </h3>

      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Temperature trend
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="Temperature °C"
          />
        </LineChart>
      </ResponsiveContainer>

      <p style={{ color: '#666', fontSize: '14px', margin: '20px 0 8px' }}>
        AQI trend
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="AQI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HistoryChart;