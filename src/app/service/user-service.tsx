import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(`/student`);
    return response; 
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};