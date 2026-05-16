import axios from 'axios';

const BASE_URL = 'https://city-pulse-production-5856.up.railway.app/api';

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