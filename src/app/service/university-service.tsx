import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const UniversityRegistration = async (formData: any) => {
    try {
        const response = await axiosInstance.post(`/university-admin/university-registration`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    } catch (error: unknown) {
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
        const response = await axiosInstance.post(`/university-admin/university-login`, { email, password });
        const token = (response as any).token || (response as any).accessToken;

        if (token) {
            localStorage.setItem('authToken', token);
        }

        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            throw new Error(errorMessage);
        } else {
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
};

export const GetAllUniversitiesService = async () => {
    try {
        const response = await axiosInstance.get(`/university-admin`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'university Data fetching failed. Please try again.';
            throw new Error(errorMessage);
        } else {
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
}

export const UpdateUniversityStatusService = async (id: string, status: string) => {
    try {
        const response = await axiosInstance.post(`/university-admin/status/${id}`, { status: status });
        return response;
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
        const response = await axiosInstance.get(`/university-admin/generate-pdf`, {
            responseType: "blob",
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
};

export const GetSubscriptionService = async (id: string, plan: string) => {
    try {
        const response = await axiosInstance.post(`/university-admin/get-subscription`, {
            id: id,
            plan: plan
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}

export const UploadCSVService = async (formData: any) => {
    try {
        const response = await axiosInstance.post(`/university-admin/upload-student`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}

export const GetAllStudentByUniversity = async () => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            throw new Error('unauthorized access');
        }
        const response = await axiosInstance.get(`/university-admin/university-student/${authToken}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
}