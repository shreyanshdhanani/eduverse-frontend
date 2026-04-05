import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GetOneTopicService = async(id: string)=>{
  try {
    const response = await axiosInstance.get(`/topic/get-one/${id}`);
    return response;
  } catch (error) {
    throw new Error('Failed to get topic.');
  }
}

export const GetAllTopicsService = async()=>{
  try {
    const response = await axiosInstance.get(`/topic`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch topics.');
  }
}
export const GetSubcategoryByIdService = async(subcategoryId: string)=>{
    try {
        const response = await axiosInstance.get(`/topic/sub-category/${subcategoryId}`);
        return response;
      } catch (error) {
        throw new Error('Failed to fetch subcategory details.');
      }
} 
export const GetTopicsBySubcategoryService = async(subcategoryId: string)=>{
    try {
        const response = await axiosInstance.get(`/topic/${subcategoryId}`);
        return response;
      } catch (error) {
        throw new Error('Failed to fetch topics.');
      }
}
export const CreateTopicService = async(subcategoryId : string, newTopicName: string, newTopicDescription: string)=>{
    try {
        const response = await axiosInstance.post(`/topic`, {
            name: newTopicName,
            description: newTopicDescription,
            subCategory: subcategoryId
        });
        return response;
      } catch (error) {
        throw new Error('Failed to create topic.');
      }
} 

export const UpdateTopicService = async(id: string, updatedName: string, updatedDescription: string)=>{
    try {
        const response = await axiosInstance.patch(`/topic/${id}`, {
            name: updatedName,
            description: updatedDescription,
        });
        return response;
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
        const response = await axiosInstance.delete(`/topic/${id}`,)
        return response;
      } catch (error) {
        throw new Error('Failed to delete topic.');
      }
}  