import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

// Service to get all subcategories by categoryId
export const GetSubcategoriesByCategoryService = async (categoryId: string) => {
  try {
    const response = await axiosInstance.get(`/sub-category/category/${categoryId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subcategories.');
  }
};

export const CreateSubcategoryService = async (categoryId: string, newSubcategoryName: string, newSubcategoryDescription: string) => {
  try {
    const response = await axiosInstance.post(`/sub-category`, {
      categoryId: categoryId,
      name: newSubcategoryName,
      description: newSubcategoryDescription
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create subcategory.');
  }
}
export const DeleteSubcategoryService = async(id: string)=>{
    try {
        const response = await axiosInstance.delete(`/sub-category/${id}`)
        return response;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete subcategory.');
      }
}


export const UpdateSubcategoryService = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
        const response = await axiosInstance.patch(`/sub-category/${id}`, {
            name: updatedName,
            description: updatedDescription,
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Failed to update category.";
            throw new Error(errorMessage);
        } else {
            throw new Error("Unexpected error occurred. Please try again.");
        }
    }
};