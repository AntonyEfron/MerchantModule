// src/api/auth.ts
import axiosInstance from '../utils/axiosInstance';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('token');
};

// ===== AUTH API CALLS =====
export const registerMerchant = async (
  shopName: string,
  ownerName: string,
  email: string,
  phoneNumber: string,
  password: string,
  category: string
) => {
  const res = await axiosInstance.post('merchant/register', {
    shopName,
    ownerName,
    email,
    phoneNumber,
    password,
    category,
  });

  return res.data; // Adjust based on backend response shape
};

export const login = async (email: string, password: string) => {
  // console.log('resresresresresres');


  const res = await axiosInstance.post('merchant/login', { 
    identifier: email,
    password 
  });

  console.log(res,'resresresresresres');
  

  // No manual localStorage here!
  return {
    merchant: res.data?.merchant,
    token: res.data?.token
  };
};
