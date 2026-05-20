import { useState, useEffect } from 'react';
import { getDashboard } from './api';
import CityCard from './components/CityCard';
import HistoryChart from './components/HistoryChart';
import CityMap from './components/CityMap';

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      getDashboard()
        .then(data => {
          setDashboard(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ padding: '40px' }}>Loading City Pulse...</p>;
  if (error) return <p style={{ padding: '40px', color: 'red' }}>Error: {error}</p>;
  if (loading) return (
  <div style={{
    padding: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    maxWidth: '1100px',
    margin: '0 auto'
  }}>
    <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>🌆 City Pulse</h1>
    <p style={{ color: '#64748b', marginTop: '8px' }}>Generating city summaries...</p>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '32px'
    }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: '300px',
          backgroundColor: '#e2e8f0',
          borderRadius: '16px',
          opacity: 0.6
        }} />
      ))}
    </div>
  </div>
);

  return (
    <div style={{
      padding: '40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#f1f5f9',
      minHeight: '100vh',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>
          🌆 City Pulse
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '4px' }}>
          Real-time city energy scores across India 
        </p>
        <p style={{ color: '#22c55e', fontSize: '12px', margin: 0 }}>
          ● Live — updates every 15 minutes
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <CityMap cities={dashboard ? dashboard.cities : []} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {dashboard.cities.map(city => (
          <CityCard
            key={city.city}
            city={city}
            onClick={setSelectedCity}
          />
        ))}
      </div>

      {selectedCity && (
        <div style={{
          marginTop: '32px',
          padding: '28px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <HistoryChart cityName={selectedCity.city} />
        </div>
      )}
    </div>
  );
}



export default App;