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
    const alreadySearched = searchedCities.find(
      c => c.city.toLowerCase() === city.city.toLowerCase()
    );
    if (!alreadyInDashboard && !alreadySearched) {
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
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      maxWidth: '1180px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '42px', fontWeight: '800', margin: 0, letterSpacing: '-1px', color: '#0f172a' }}>🌆 City Pulse</h1>
      <p style={{ color: '#64748b', marginTop: '8px' }}>Loading city data...</p>
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    }}>
      {/* Top nav bar */}
      <div style={{
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'white',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 2000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🌆</span>
          <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: '#0f172a' }}>
            City Pulse
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: '500',
            color: '#64748b',
            backgroundColor: '#f1f5f9',
            padding: '3px 10px',
            borderRadius: '20px',
            marginLeft: '4px'
          }}>
            India
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
            Live · updates every 15 min
          </span>
        </div>
      </div>

      {/* Hero section */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '48px 40px 40px',
        maxWidth: '1180px',
        margin: '0 auto',
      }}>
        <div style={{ maxWidth: '560px' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            margin: '0 0 12px',
            color: '#0f172a',
            letterSpacing: '-1px',
            lineHeight: 1.1
          }}>
            The pulse of every<br />Indian city, live.
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
            Real-time energy scores combining weather, air quality, and city activity — updated every 15 minutes.
          </p>
          <CitySearch onCityFound={handleCityFound} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 40px 60px' }}>

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
    </div>   
  );
}

export default App;