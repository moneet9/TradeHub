// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://marketplace-backend-vtqh.onrender.com';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GET_ME: `${API_BASE_URL}/api/auth/me`,

  // Items
  GET_ITEMS: `${API_BASE_URL}/api/items`,
  GET_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  GET_MY_ITEMS: `${API_BASE_URL}/api/items/my/items`,
  CREATE_ITEM: `${API_BASE_URL}/api/items`,
  UPDATE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  DELETE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  MARK_SOLD: (id: string) => `${API_BASE_URL}/api/items/${id}/mark-sold`,
};

export default API_BASE_URL;
