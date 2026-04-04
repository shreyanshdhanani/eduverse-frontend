import { AxiosError } from 'axios';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';

export const getAllUser= async()=>{
    try{
        const response = await axios.get(`${API_URL}/student`);
        return response.data; 
    }catch(error: unknown)
    {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(errorMessage);
          } else {
            throw new Error('An unexpected error occurred. Please try again later.');
          }
    }
}