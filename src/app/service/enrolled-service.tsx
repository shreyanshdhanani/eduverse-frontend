import { AxiosError } from 'axios';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';

export const GetEnrolledCoursesService = async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/enrollment/enrolled-courses`, { token });
      return response.data.courses;
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