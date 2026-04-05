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

export const GetUniversityDashboardData = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/university-admin/dashboard-stats/${token}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch dashboard data";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
};

export const GetUniversityProfile = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/university-admin/profile/${token}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch profile";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
};

export const UpdateUniversityProfile = async (formData: any) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.patch(`/university-admin/profile/${token}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Update failed";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
};

export const GetUniversityEnrolledStudents = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/university-admin/get-enrolled-students/${token}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch enrolled students";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
};