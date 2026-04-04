import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const CourseProviderLoginService = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, { email, password, role: 'provider' });
    const token = response.data.data.accessToken;
    localStorage.setItem('authToken', token);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

export const GetAllCourseProviderService = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/all-course-providers`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching data.');
  }
};

export const CourseProviderRegistrationService = async (name: string, email: string, password: string, phone: string, address: string) => {
  try {
    const response = await axiosInstance.post(`/auth/register/provider`, { name, email, password, phone, address });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed.');
  }
};

export const CourseProviderDashboardService = async () => {
  try {
    const response = await axiosInstance.post(`/course-provider/dashboard`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Dashboard data fetching failed.');
  }
};

export const getCourseDetails = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/course-provider/get-single-course/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Course details not fetched.');
  }
};

export const GetCoursesByCategoryService = async (categoryId: string, subcategoryId?: string) => {
  try {
    const response = await axiosInstance.get(`/course-provider/by-category`, {
      params: { categoryId, subcategoryId },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch courses.');
  }
};

export const getStatus = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/get-status`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Status not fetched.');
  }
};

export const GetCoursesListByCourseProviderService = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/get-courses`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch course list.');
  }
};

export const CreateCourseWithBasicInformation = async (formData: any, id: string) => {
  try {
    const response = await axiosInstance.post(`/course-provider/upload-basic-information/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Course upload failed.');
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/profile`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Profile fetch failed.');
  }
};

export const ProfileService = async (formData: any) => {
  try {
    const response = await axiosInstance.patch(`/course-provider/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Profile save failed.');
  }
};

export const GetEnrolledStudentsService = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/get-enrolled-students`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Data fetch failed.');
  }
};

export const GetProviderOrdersService = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/orders`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Oders fetch failed.');
  }
};

export const GetProviderEarningsAnalyticsService = async () => {
  try {
    const response = await axiosInstance.get(`/course-provider/earnings`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Earnings analytics fetch failed.');
  }
};