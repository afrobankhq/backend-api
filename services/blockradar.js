const BASE_URL = 'https://api.blockradar.co/v1';

/**
 * Helper function to make fetch requests
 */
const request = async (walletId, path, options = {}) => {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${walletId}`,
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
export const createAddress = async (walletId, blockchain, label) => {
  return request(walletId, `/wallets/${walletId}/addresses`, {
    method: 'POST',
    body: JSON.stringify({ blockchain, label }),
  });
};

/**
 * Get a specific address info
 */
export const getAddress = async (walletId, addressId) => {
  return request(walletId, `/wallets/${walletId}/addresses/${addressId}`, {
    method: 'GET',
  });
};

/**
 * List all addresses under the wallet
 */
export const listAddresses = async (walletId) => {
  return request(walletId, `/wallets/${walletId}/addresses`, {
    method: 'GET',
  });
};

/**
 * List deposits for an address
 */
export const listDeposits = async (walletId, addressId) => {
  return request(walletId, `/wallets/${walletId}/addresses/${addressId}/deposits`, {
    method: 'GET',
  });
};

export default {
  createAddress,
  getAddress,
  listAddresses,
  listDeposits,
};
