import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getDashboard = async () => {
  const response = await axios.get(`${BASE_URL}/dashboard`);
  return response.data;
};

export const getCityPulse = async (cityName) => {
  const response = await axios.get(`${BASE_URL}/pulse/${cityName}`);
  return response.data;
};

export const getCityHistory = async (cityName, hours = 24) => {
  const response = await axios.get(`${BASE_URL}/history/${cityName}?hours=${hours}`);
  return response.data;
};

export const searchCity = async (cityName) => {
  const response = await axios.get(`${BASE_URL}/search/${cityName}`);
  return response.data;
};

export const getCityTrend = async (cityName, days = 7) => {
  const response = await axios.get(`${BASE_URL}/trend/${cityName}?days=${days}`);
  return response.data;
};

export const getCityComparison = async (days = 7) => {
  const response = await axios.get(`${BASE_URL}/comparison?days=${days}`);
  return response.data;
};

export const getCityForecast = async (cityName) => {
  const response = await axios.get(`${BASE_URL}/forecast/${cityName}`);
  return response.data;
};

export const getAllForecasts = async () => {
  const response = await axios.get(`${BASE_URL}/forecast`);
  return response.data;
};