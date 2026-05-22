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