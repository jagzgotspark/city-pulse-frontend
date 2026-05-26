import { useState, useEffect } from 'react';
import { getDashboard, getAllForecasts } from './api';
import CityCard from './components/CityCard';
import TrendChart from './components/TrendChart';
import CityMap from './components/CityMap';
import CitySearch from './components/CitySearch';
import CityComparison from './components/CityComparison';
import ForecastChart from './components/ForecastChart';

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchedCities, setSearchedCities] = useState([]);
  const [flyTo, setFlyTo] = useState(null);
  const [forecasts, setForecasts] = useState({});

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

    getAllForecasts()
      .then(data => {
        const forecastMap = {};
        data.forecasts.forEach(f => {
          forecastMap[f.city] = f;
        });
        setForecasts(forecastMap);
      })
      .catch(() => {});

    return () => clearInterval(interval);
  }, []);

  const handleCityFound = (city) => {
    const alreadyInDashboard = dashboard?.cities?.find(
      c => c.city.toLowerCase() === city.city.toLowerCase()
    );
    if (!alreadyInDashboard) {
      setSearchedCities(prev => {
        const exists = prev.find(c => c.city === city.city);
        if (exists) return prev.map(c => c.city === city.city ? city : c);
        return [...prev, city];
      });
    }
    if (city.lat && city.lon) {
      setFlyTo({ lat: city.lat, lon: city.lon });
    }
  };

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '32px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: '300px', backgroundColor: '#e2e8f0', borderRadius: '16px', opacity: 0.6 }} />
        ))}
      </div>
    </div>
  );

  if (error) return <p style={{ padding: '40px', color: 'red' }}>Error: {error}</p>;

  const allCities = [
    ...(dashboard ? dashboard.cities : []),
    ...searchedCities
  ];

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

      <CitySearch onCityFound={handleCityFound} />

      <div style={{ marginBottom: '32px' }}>
        <CityMap cities={allCities} flyTo={flyTo} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {allCities.map(city => (
          <CityCard
            key={city.city}
            city={city}
            onClick={setSelectedCity}
            forecast={forecasts[city.city]}
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
          <TrendChart cityName={selectedCity.city} />
          <ForecastChart
            cityName={selectedCity.city}
            currentScore={selectedCity.pulse_score}
          />
        </div>
      )}

      <CityComparison />
    </div>
  );
}

export default App;