import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getCityTrend } from '../api';

function formatHour(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit'
  });
}

function getPulseColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function TrendChart({ cityName }) {
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    getCityTrend(cityName, days)
      .then(data => {
        setTrend(data);
        setLoading(false);
      })
      .catch(() => {
        setTrend(null);
        setLoading(false);
      });
  }, [cityName, days]);

  if (loading) return (
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading trend data...</p>
  );

  if (!trend || trend.data_points === 0) return (
    <div>
      <h3 style={{ margin: '0 0 8px' }}>{cityName} — Pulse Trend</h3>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>
        Not enough data yet — check back after the scheduler has run a few more times.
      </p>
    </div>
  );

  const chartData = trend.trend.map(row => ({
    time: formatHour(row.hour),
    score: parseFloat(row.avg_score?.toFixed(1)),
    weather: parseFloat(row.avg_weather?.toFixed(1)),
    air: parseFloat(row.avg_air?.toFixed(1))
  }));

  const avgScore = chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{cityName} — Pulse Trend</h3>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
            {trend.data_points} data points over {days} day{days > 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 3, 7].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: days === d ? '#1e293b' : '#e2e8f0',
                backgroundColor: days === d ? '#1e293b' : 'white',
                color: days === d ? 'white' : '#64748b',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px'
            }}
          />
          <ReferenceLine
            y={avgScore}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: `avg ${avgScore.toFixed(1)}`, fontSize: 11, fill: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            name="Pulse Score"
          />
          <Line
            type="monotone"
            dataKey="weather"
            stroke="#f59e0b"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 4"
            name="Weather Score"
          />
          <Line
            type="monotone"
            dataKey="air"
            stroke="#22c55e"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 4"
            name="Air Score"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '2px', backgroundColor: '#6366f1' }} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>Pulse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '2px', backgroundColor: '#f59e0b', borderTop: '2px dashed #f59e0b' }} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>Weather</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '2px', backgroundColor: '#22c55e', borderTop: '2px dashed #22c55e' }} />
          <span style={{ fontSize: '12px', color: '#64748b' }}>Air Quality</span>
        </div>
      </div>
    </div>
  );
}

export default TrendChart;