import axios, { AxiosError } from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';

export const GetOneTopicService = async(id: string)=>{
  try {
    const response = await axios.get(`${API_URL}/topic/get-one/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get topic.');
  }
}

export const GetAllTopicsService = async()=>{
  try {
    const response = await axios.get(`${API_URL}/topic`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch subcategories.');
  }
}
export const GetSubcategoryByIdService = async(subcategoryId: string)=>{
    try {
        const response = await axios.get(`${API_URL}/topic/sub-category/${subcategoryId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch subcategories.');
      }
} 
export const GetTopicsBySubcategoryService = async(subcategoryId: string)=>{
    try {
        const response = await axios.get(`${API_URL}/topic/${subcategoryId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch subcategories.');
      }
}
export const CreateTopicService = async(subcategoryId : string, newTopicName: string, newTopicDescription: string)=>{
    try {
        const response = await axios.post(`${API_URL}/topic`, {
            name: newTopicName,
            description: newTopicDescription,
            subCategory: subcategoryId
        });
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch subcategories.');
      }
} 

export const UpdateTopicService = async(id: string, updatedName: string, updatedDescription: string)=>{
    try {
        const response = await axios.patch(`${API_URL}/topic/${id}`, {
            name: updatedName,
            description: updatedDescription,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Failed to update topic.";
            throw new Error(errorMessage);
        } else {
            throw new Error("Unexpected error occurred. Please try again.");
        }
    }
} 
export const DeleteTopicService = async(id: string)=>{
    try {
        const response = await axios.delete(`${API_URL}/topic/${id}`,)
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch subcategories.');
      }
}  