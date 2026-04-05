import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

/**
 * NOTE: axiosInstance has a response interceptor that automatically unwraps
 * { success: true, data: <payload> } into just <payload>.
 * So `response` here is ALREADY the inner data — do NOT do `response.data`.
 */

export const GetAllCartCoursesService = async (): Promise<any[]> => {
  try {
    // interceptor returns { courses: [...] } directly
    const response: any = await axiosInstance.get(`/cart`);
    // Normalize: could be { courses: [...] } or directly an array
    if (Array.isArray(response)) return response;
    if (response?.courses && Array.isArray(response.courses)) return response.courses;
    return [];
  } catch (error) {
    console.error('Error fetching cart courses:', error);
    throw error;
  }
};

export const AddToCartService = async (courseId: string): Promise<any> => {
  try {
    const response: any = await axiosInstance.post(`/cart/add/${courseId}`);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || 'Failed to add course to cart. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const RemoveFromCartService = async (courseId: string): Promise<any> => {
  try {
    const response: any = await axiosInstance.delete(`/cart/remove/${courseId}`);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || 'Failed to remove course from cart.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const CreateCheckoutSessionService = async (cartCourses: any[]): Promise<any> => {
  try {
    const response: any = await axiosInstance.post(`/stripe/create-checkout-session`, {
      cartCourses,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || 'Checkout failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};