import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getCityForecast } from '../api';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function ForecastChart({ cityName, currentScore }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;
    setLoading(true);
    getCityForecast(cityName)
      .then(data => {
        setForecast(data);
        setLoading(false);
      })
      .catch(() => {
        setForecast(null);
        setLoading(false);
      });
  }, [cityName]);

  if (loading) return (
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>
      Running forecast model...
    </p>
  );

  if (!forecast) return (
    <p style={{ color: '#94a3b8', fontSize: '14px' }}>
      Not enough data to forecast {cityName} yet.
    </p>
  );

  const chartData = forecast.forecast_24h.map(row => ({
    time: formatTime(row.timestamp),
    predicted: row.predicted,
    lower: row.lower,
    upper: row.upper
  }));

  const trendColor = forecast.trend === 'improving' ? '#22c55e' : '#ef4444';
  const trendArrow = forecast.trend === 'improving' ? '↑' : '↓';

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>
            {cityName} — 24h Forecast
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Prophet model trained on {forecast.data_points_used} data points
          </p>
        </div>

        <div style={{
          textAlign: 'right',
          backgroundColor: '#f8fafc',
          borderRadius: '10px',
          padding: '10px 16px'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>
            Next hour
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '800',
            color: trendColor,
            lineHeight: 1
          }}>
            {trendArrow} {forecast.predicted_next}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            {forecast.trend} from {forecast.current_score}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            interval={3}
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
            formatter={(value, name) => [
              value,
              name === 'predicted' ? 'Predicted Score'
                : name === 'upper' ? 'Upper bound'
                : 'Lower bound'
            ]}
          />
          <ReferenceLine
            y={currentScore}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{
              value: `now ${currentScore}`,
              fontSize: 11,
              fill: '#94a3b8',
              position: 'insideTopLeft'
            }}
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#6366f1"
            fillOpacity={0.1}
            name="upper"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#forecastGradient)"
            dot={false}
            name="predicted"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="white"
            fillOpacity={1}
            name="lower"
          />
        </AreaChart>
      </ResponsiveContainer>

      <p style={{
        color: '#94a3b8',
        fontSize: '11px',
        marginTop: '8px',
        marginBottom: 0
      }}>
        Shaded area shows 80% confidence interval
      </p>
    </div>
  );
}

export default ForecastChart;