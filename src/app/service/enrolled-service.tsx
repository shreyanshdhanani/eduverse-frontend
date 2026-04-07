import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GetEnrolledCoursesService = async () => {
  try {
    const response: any = await axiosInstance.get(`/enrollment/enrolled-courses`);
    return response.courses || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses.');
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const UpdateProgressService = async (courseId: string, progress: number) => {
  try {
    const response = await axiosInstance.patch(`/enrollment/progress`, { courseId, progress });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to update progress.');
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const IssueCertificateService = async (courseId: string) => {
  try {
    const response = await axiosInstance.post(`/enrollment/certificate/issue`, { courseId });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to issue certificate.');
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const GetCertificateService = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/enrollment/certificate/${courseId}`);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch certificate.');
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const GetMyCertificatesService = async () => {
  try {
    const response = await axiosInstance.get(`/enrollment/my-certificates`);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch certificates.');
    }
    throw new Error('An unexpected error occurred.');
  }
};