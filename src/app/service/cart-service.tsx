import { AxiosError } from 'axios';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';

export const GetAllCartCoursesService = async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/cart/courses`,{token: token})
      return response.data;
    } catch (error) {
      console.error("Error fetching cart courses:", error);
      throw error;
    }
  };

export const AddToCartService = async (token: string, courseId: string) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add-to-cart`, {
      token,
      courseId,
    });
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

export const CreateCheckoutSessionService = async(token: string, cartCourses: any)=>{
  try {
    console.log('token', token)
    console.log('cartCourses', cartCourses)
    const response = await axios.post(`${API_URL}/stripe/create-checkout-session`, {
      token,
      cartCourses,
    });
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
}