// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'YOUR LINK';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GET_ME: `${API_BASE_URL}/api/auth/me`,
  
  // Forgot Password
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Change Email
  CHANGE_EMAIL: `${API_BASE_URL}/api/auth/change-email`,
  
  // Change Password
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
  
  // Items
  GET_ITEMS: `${API_BASE_URL}/api/items`,
  GET_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  GET_MY_ITEMS: `${API_BASE_URL}/api/items/my/items`,
  GET_MY_BIDS: `${API_BASE_URL}/api/items/my/bids`,
  CREATE_ITEM: `${API_BASE_URL}/api/items`,
  UPDATE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  DELETE_ITEM: (id: string) => `${API_BASE_URL}/api/items/${id}`,
  MARK_SOLD: (id: string) => `${API_BASE_URL}/api/items/${id}/mark-sold`,

  // Reviews
  ADD_REVIEW: `${API_BASE_URL}/api/reviews`,
  GET_SELLER_REVIEWS: (sellerId: string) => `${API_BASE_URL}/api/reviews/seller/${sellerId}`,
  GET_SELLER_RATING: (sellerId: string) => `${API_BASE_URL}/api/reviews/seller/${sellerId}/rating`,
  GET_MY_REVIEWS: `${API_BASE_URL}/api/reviews/my-reviews`,
  UPDATE_REVIEW: (reviewId: string) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId: string) => `${API_BASE_URL}/api/reviews/${reviewId}`,
};

export default API_BASE_URL;
