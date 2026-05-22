import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  if (loading) return <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading comparison...</p>;
  if (!data || data.cities.length === 0) return null;

  const chartData = data.cities.map(city => ({
    name: city.name,
    avg: parseFloat(parseFloat(city.avg_score).toFixed(1)),
    best: parseFloat(parseFloat(city.best_score).toFixed(1)),
    worst: parseFloat(parseFloat(city.worst_score).toFixed(1))
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
        <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>7-Day City Ranking</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
          Average pulse score over the past week
        </p>
      </div>

      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
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
            Average pulse score: {parseFloat(best.avg_score).toFixed(1)}/100
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} tickLine={false} axisLine={false} width={80} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          />
          <Bar dataKey="avg" name="Avg Score" radius={[0, 4, 4, 0]}
            fill="#6366f1"
          />
          <Bar dataKey="best" name="Best Score" radius={[0, 4, 4, 0]}
            fill="#22c55e"
          />
          <Bar dataKey="worst" name="Worst Score" radius={[0, 4, 4, 0]}
            fill="#ef4444"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CityComparison;