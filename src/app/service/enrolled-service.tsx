import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GetEnrolledCoursesService = async () => {
    try {
      const response: any = await axiosInstance.get(`/enrollment/enrolled-courses`);
      // The backend returns { courses: [...] }
      return response.courses || [];
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || 'Failed to fetch enrolled courses.';
        throw new Error(errorMessage);
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };