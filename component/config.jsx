const BASE_URL = 'http://192.168.0.107:8000/api';

export const API_ENDPOINTS = {
  GET_USERS: `${BASE_URL}/getusers`,
  LOGIN: `${BASE_URL}/auth/login`,
  CATEGORY: `${BASE_URL}/category`,
  CATEGORIES: `${BASE_URL}/categories`,
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  CART: `${BASE_URL}/cart`,
  GET_ADDONS: `${BASE_URL}/get-addons`,
  ORDER: `${BASE_URL}/orderssss`,
  ME: `${BASE_URL}/auth/me`,
  ADDRESSES: `${BASE_URL}/auth/addresses`,
  ADDRESSESGET: `${BASE_URL}/auth/addressesget`,
  COUPON: `${BASE_URL}/coupon`,
  ORDERGET: `${BASE_URL}/auth/order-get`,
  NEARBY_STORES: `${BASE_URL}/nearby-stores`,
  ORDERDELIVERY: `${BASE_URL}/auth/order-delivery`,
  ORDERSACCEPT: `${BASE_URL}/auth/ordersaccept`,
  ORDERSDELIVERY: `${BASE_URL}/auth/ordersdelivery`,
  PROCESS_PAYMENT: `${BASE_URL}/auth/process-payment`,
  UPDATE_ORDER_STATUS: `${BASE_URL}/auth/update-status`,
  CUSTOMERDISTSNCE: `${BASE_URL}/customer-distances`,
  CUPDATE_QTY_ORDER: `${BASE_URL}/cupdate-qty-order`,
  RIDERWALLET: `${BASE_URL}/wallet/rider`,
  // Add more endpoints as needed
};
