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

// ─── New Subscription API Calls ───────────────────────────────────────────────

export const GetActiveSubscriptionService = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/university-admin/active-subscription/${token}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch subscription";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const GetSubscriptionUsageService = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/university-admin/subscription-usage/${token}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch subscription usage";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const GetAllSubscriptionPlansService = async () => {
    try {
        const response = await axiosInstance.get(`/subscription-plans`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to fetch plans";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const CreateSubscriptionPlanService = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/subscription-plans`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to create plan";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const UpdateSubscriptionPlanService = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.patch(`/subscription-plans/${id}`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to update plan";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const DeleteSubscriptionPlanService = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/subscription-plans/${id}`);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to delete plan";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const AssignSubscriptionPlanService = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/subscription-plans/assign`, data);
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to assign plan";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const CreateSubscriptionCheckoutSessionService = async (planId: string) => {
    try {
        const response: any = await axiosInstance.post(`/stripe/create-subscription-session`, { planId });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to create checkout session";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const AddStudentManualService = async (data: any) => {
    try {
        const token = localStorage.getItem('authToken');
        const response: any = await axiosInstance.post(`/university-admin/add-student-manual`, { ...data, universityToken: token });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Failed to add student";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const VerifySubscriptionSessionService = async (sessionId: string) => {
    try {
        const response: any = await axiosInstance.post(`/stripe/verify-session`, { sessionId });
        return response;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = (error as AxiosError<any>).response?.data?.message || "Verification failed";
            throw new Error(errorMessage);
        } else {
            throw new Error("An unexpected error occurred during verification.");
        }
    }
}