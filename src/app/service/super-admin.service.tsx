import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const SuperAdminLoginService = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password,
      role: 'super_admin'
    });
    
    // Auth success - get token from data.data.accessToken
    const { accessToken } = response.data.data;
    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('adminRole', 'super-admin');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid admin credentials. Please try again.');
  }
};

export const SuperAdminLogoutService = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRole');
};

export const Dashboard = async () => {
  try {
    const response = await axiosInstance.get(`/super-admin/dashboard`);
    return response.data; // Response interceptor wraps in {success, data}
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Unable to fetch dashboard data.');
  }
};

export const GetAllCourse = async () => {
  try {
    const response = await axiosInstance.get(`/super-admin/course-list`);
    return response.data.data;
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
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch student details");
  }
};
