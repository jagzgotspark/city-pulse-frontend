import { useState, useEffect } from 'react';

function WeatherCard({ data }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginTop: "16px",
      maxWidth: "400px"
    }}>
      <h2>{data.name}</h2>
      <p>Temperature: {data.main.temp}°C</p>
      <p>Feels like: {data.main.feels_like}°C</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Condition: {data.weather[0].description}</p>
      <p>Wind: {data.wind.speed} m/s</p>
    </div>
  );
}

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=${API_KEY}&units=metric`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "40px" }}>Fetching city data...</p>;
  if (error) return <p style={{ padding: "40px", color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>City Pulse</h1>
      <p style={{ color: "#666" }}>Live data for Lucknow</p>
      <WeatherCard data={weather} />
    </div>
  );
}

export default App;
