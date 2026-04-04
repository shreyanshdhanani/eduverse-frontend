import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const GetAllCategoryService = async()=>{
    try{
        const response = await axiosInstance.get(`/category`)
        return response; // No need for .data anymore, interceptor handles it
    }catch(error: unknown)
    {
        if(error instanceof AxiosError)
        {
            const errorMessage = error.response?.data?.message || 'category is not fatched'
            throw new Error(errorMessage)
        }else{
            throw new Error('unexpacted error occured. please try again')
        }
    }
}

export const GetCategoryByIdService = async(id: string)=>{
    try{
        const response = await axiosInstance.get(`/category/${id}`)
        return response;
    }catch(error: unknown)
    {
        if(error instanceof AxiosError)
        {
            const errorMessage = error.response?.data?.message || 'category is not fatched'
            throw new Error(errorMessage)
        }else{
            throw new Error('unexpacted error occured. please try again')
        }
    }
}

export const CreateCategoryService = async(name: string, description: string)=>{
    try{
        const response = await axiosInstance.post(`/category`, {name, description})
        return response;
    }catch(error: unknown)
    {
        if(error instanceof AxiosError)
            {
                const errorMessage = error.response?.data?.message || 'category is not created'
                throw new Error(errorMessage)
            }else{
                throw new Error('unexpacted error occured. please try again')
            } 
    }
}

export const DeleteCategoryService= async(id: string)=>{
    try{
        const response = await axiosInstance.delete(`/category/${id}`)
        return response;
    }catch(error: unknown)
    {
        if(error instanceof AxiosError)
            {
                const errorMessage = error.response?.data?.message || 'category is not deleted'
                throw new Error(errorMessage)
            }else{
                throw new Error('unexpacted error occured. please try again')
            } 
    }
}

export const UpdateCategoryService = async (id: string, updatedName: string, updatedDescription: string) => {
    try {
        const response = await axiosInstance.patch(`/category/${id}`, {
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

