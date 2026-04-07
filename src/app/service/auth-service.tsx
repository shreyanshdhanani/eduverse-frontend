import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const UserRegistrationService = async (name: string, email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/auth/register/user`, { name, email, password });
    return response; 
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const LoginService = async (email: string, password: string) => {
  try {
    const response: any = await axiosInstance.post(`/auth/login`, { email, password, role: 'user' });
    const token = response.accessToken;
    const user = response.user;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const ForgotPasswordService = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(`/auth/forgot-password`, { email, role: 'user' });
    return response as any;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const ResetPasswordService = async (token: string, password: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(`/auth/reset-password`, { token, password });
    return response as any;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Password reset failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const ChangePasswordService = async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.patch<{ message: string }>(`/auth/change-password`, { currentPassword, newPassword });
    return response as any;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Password change failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};