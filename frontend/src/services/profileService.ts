import api from './api';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (data: { name: string; email: string }) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  const response = await api.put('/password', data);
  return response.data;
};
