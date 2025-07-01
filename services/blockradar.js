import axios from 'axios';

const BLOCKRADAR_API_KEY = process.env.BLOCKRADAR_API_KEY;
const BASE_URL = 'https://api.blockradar.co/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${BLOCKRADAR_API_KEY}`,
  },
});

export const createAddress = async (blockchain, label) => {
  const res = await api.post('/addresses', { blockchain, label });
  return res.data;
};

export default { createAddress };
