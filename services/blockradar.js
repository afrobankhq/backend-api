
const BASE_URL = 'https://api.blockradar.co/v1';
const WALLET_ID = process.env.BLOCKRADAR_WALLET_ID;

if (!WALLET_ID) {
  throw new Error('Missing BLOCKRADAR_WALLET_ID in .env');
}

/**
 * Helper function to make fetch requests
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${WALLET_ID}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Blockradar API error');
  }

  return res.json();
};

/**
 * Create a blockchain address
 */
export const createAddress = async (blockchain, label) => {
  return request(`/wallets/${WALLET_ID}/addresses`, {
    method: 'POST',
    body: JSON.stringify({ blockchain, label }),
  });
};

/**
 * Get a specific address info
 */
export const getAddress = async (addressId) => {
  return request(`/wallets/${WALLET_ID}/addresses/${addressId}`, {
    method: 'GET',
  });
};

/**
 * List all addresses under the wallet
 */
export const listAddresses = async () => {
  return request(`/wallets/${WALLET_ID}/addresses`, {
    method: 'GET',
  });
};

/**
 * List deposits for an address
 */
export const listDeposits = async (addressId) => {
  return request(`/wallets/${WALLET_ID}/addresses/${addressId}/deposits`, {
    method: 'GET',
  });
};

export default {
  createAddress,
  getAddress,
  listAddresses,
  listDeposits,
};
