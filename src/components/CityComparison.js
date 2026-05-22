import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCityComparison } from '../api';

function getPulseColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function CityComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCityComparison(7)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading comparison...</p>
  );

  if (!data || data.cities.length === 0) return null;

  const chartData = data.cities.map(city => ({
    name: city.name,
    avg: parseFloat(parseFloat(city.avg_score).toFixed(1)),
    best: parseFloat(parseFloat(city.best_score).toFixed(1)),
    worst: parseFloat(parseFloat(city.worst_score).toFixed(1)),
    points: city.data_points
  }));

  const best = data.cities[0];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginTop: '32px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>
          7-Day City Ranking
        </h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
          Average pulse score over the past week
        </p>
      </div>

      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>🏆</span>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>
            {best.name} leads this week
          </div>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Average pulse: {parseFloat(best.avg_score).toFixed(1)}/100
            · Best day: {parseFloat(best.best_score).toFixed(1)}
            · Worst day: {parseFloat(best.worst_score).toFixed(1)}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={chartData.length * 44}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#374151' }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px'
            }}
            formatter={(value, name) => [value, name === 'avg' ? 'Avg Score' : name === 'best' ? 'Best Score' : 'Worst Score']}
          />
          <Bar dataKey="avg" name="avg" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getPulseColor(entry.avg)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '16px', marginBottom: 0 }}>
        Cities with only 1 data point are recently searched — rankings improve with more data.
      </p>
    </div>
  );
}

export default CityComparison;