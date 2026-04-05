import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const SuperAdminLoginService = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password,
      role: 'super_admin'
    });
    
    // axiosInstance already returns response.data.data or response.data
    // Let's be extremely safe here
    const data = (response as any);
    const accessToken = data.accessToken || data.data?.accessToken;
    const refreshToken = data.refreshToken || data.data?.refreshToken;
    
    if (!accessToken) {
        throw new Error('No access token received from server.');
    }

    localStorage.setItem('adminToken', accessToken);
    if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken);
    localStorage.setItem('adminRole', 'super-admin');
    
    return data;
  } catch (error: any) {
    console.error("SuperAdminLoginService Error:", error);
    const apiMessage = error.response?.data?.message;
    const errorMessage = apiMessage || error.message || 'Login failed. Please verify your credentials.';
    throw new Error(errorMessage);
  }
};

export const SuperAdminLogoutService = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRole');
};

export const Dashboard = async () => {
  try {
    const response = await axiosInstance.get(`/super-admin/dashboard`);
    return response; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Unable to fetch dashboard data.');
  }
};

export const GetAllCourse = async () => {
  try {
    const response = await axiosInstance.get(`/super-admin/course-list`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Unable to fetch course list.');
  }
};

export const CourseStatusService = async (courseId: string, newStatus: string) => {
  try {
    const response = await axiosInstance.put(`/super-admin/status/${courseId}`, { status: newStatus });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update course status");
  }
};

export const GetFullStudentDetails = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/super-admin/student-details/${userId}`);
    return response; // axiosInstance unwraps this
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch student details");
  }
};
