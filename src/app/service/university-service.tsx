import { AxiosError } from 'axios';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';


export const UniversityRegistration= async(formData: any)=>{
    try{
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }
        const response = await axios.post(`${API_URL}/university-admin/university-registration`,formData);
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

export const UniversityLoginService = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/university-admin/university-login`, { email, password });
    
    // Assuming the response contains the token in `response.data.token`
    const token = response.data.token;

    // Store the token in localStorage
    localStorage.setItem('authToken', token);

    // Return the response data if needed, e.g., for user information or additional logic
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const GetAllUniversitiesService = async()=>{
  try
  {
    const response = await axios.get(`${API_URL}/university-admin`);
    return response.data; 

  }catch(error: unknown)
  {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'university Data fetching failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export const UpdateUniversityStatusService = async(id: string, status: string)=>{
  try {
    const response = await axios.post(`${API_URL}/university-admin/status/${id}`, { status: status});
    return response.data; 
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'status updation failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export const GeneratePdfService = async () => {
  try {
    const response = await axios.get(`${API_URL}/university-admin/generate-pdf`, {
      responseType: "blob", // Ensure binary data is properly received
    });
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const GetSubscriptionService = async(id: string, plan: string)=>{
  try {

    const response = await axios.post(`${API_URL}/university-admin/get-subscription`, {
      id: id,
      plan: plan
    });
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export const UploadCSVService = async(formData: any)=>{
  try {

    const response = await axios.post(`${API_URL}/university-admin/upload-student`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export const GetAllStudentByUniversity = async()=>{
  try {

  const authToken = localStorage.getItem("authToken");
    if(!authToken)
    {
      return new Error('unauthorized access')
    }
    const response = await axios.get(`${API_URL}/university-admin/university-student/${authToken}`);
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}