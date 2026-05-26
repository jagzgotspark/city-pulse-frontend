import PulseGauge from './PulseGauge';
import { useState } from 'react';
import { downloadCityCard, copyCityCardToClipboard } from '../utils/generateCityCard';

function ShareButton({ label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 12px',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: hovered ? '#94a3b8' : '#e2e8f0',
        backgroundColor: hovered ? '#f8fafc' : 'white',
        color: '#64748b',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.15s'
      }}
    >
      {label}
    </button>
  );
}

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

function CityCard({ city, onClick, forecast}) {
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
        <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          💨
          {city.real_aqi ? (
            <>
              <span style={{ fontWeight: '700', color: city.aqi_color }}>
                {city.real_aqi}
              </span>
              <span style={{
                fontSize: '11px',
                backgroundColor: city.aqi_color + '22',
                color: city.aqi_color,
                padding: '1px 8px',
                borderRadius: '10px',
                fontWeight: '600'
              }}>
                {city.aqi_label}
              </span>
            </>
          ) : (
            <span style={{ color: '#555' }}>AQI {city.aqi}</span>
          )}
        </div>
              </div>

      {forecast && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Next hour:</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: forecast.trend === 'improving' ? '#22c55e' : '#ef4444'
          }}>
            {forecast.trend === 'improving' ? '↑' : '↓'} {forecast.predicted_next}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {forecast.trend}
          </span>
        </div>
      )}

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
      {/* Share menu */}
      <div style={{ marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>

          {/* Copy to clipboard */}
          <ShareButton
            label="📋 Copy"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await copyCityCardToClipboard(city);
                alert('Image copied to clipboard!');
              } catch {
                alert('Copy failed — try downloading instead.');
              }
            }}
          />

          {/* WhatsApp share */}
          <ShareButton
            label="💬 WhatsApp"
            onClick={(e) => {
              e.stopPropagation();
              const text = `${city.city} pulse score today: ${city.pulse_score}/100 — ${city.pulse_score >= 70 ? 'High Energy 🟢' : city.pulse_score >= 40 ? 'Moderate 🟡' : 'Low Energy 🔴'}\n\n${city.summary || ''}\n\nCheck City Pulse: https://project-s9n4g.vercel.app`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
          />

          {/* Download */}
          <ShareButton
            label="📤 Download"
            onClick={(e) => {
              e.stopPropagation();
              downloadCityCard(city);
            }}
          />

        </div>
      </div>
          
    </div>
  );
}

export default CityCard;