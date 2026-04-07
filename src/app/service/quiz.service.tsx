import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GenerateQuestionService = async (title: string, description: string, level: string) => {
  try {
    const response: any = await axiosInstance.post(`/quiz/generate`, {
      title,
      description,
      level,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to generate assignment. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};
