import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GetAllCartCoursesService = async () => {
    try {
      // axiosInstance uses the token from localStorage via interceptor
      const response: any = await axiosInstance.get(`/cart`);
      // Cart response could be directly the array or { courses: [...] } 
      // based on CartController, it returns this.cartService.getCartCourses(user._id)
      return response; 
    } catch (error) {
      console.error("Error fetching cart courses:", error);
      throw error;
    }
  };

export const AddToCartService = async (courseId: string) => {
  try {
    const response = await axiosInstance.post(`/cart/add/${courseId}`);
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

export const RemoveFromCartService = async (courseId: string) => {
    try {
      const response = await axiosInstance.delete(`/cart/remove/${courseId}`);
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

export const CreateCheckoutSessionService = async(cartCourses: any[]) => {
  try {
    const response = await axiosInstance.post(`/stripe/create-checkout-session`, {
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
}