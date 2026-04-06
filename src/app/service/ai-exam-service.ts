import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return { Authorization: `Bearer ${token}` };
};

export const GetAIExamSetupData = async () => {
    const response = await axios.get(`${API_URL}/ai-exam/setup-data`, {
        headers: getAuthHeaders()
    });
    return response.data.data;
};

export const SaveAIExamResult = async (resultData: any) => {
    const response = await axios.post(`${API_URL}/ai-exam/save-result`, resultData, {
        headers: getAuthHeaders()
    });
    return response.data.data;
};

export const GetAIExamHistory = async (params: any = {}) => {
    const response = await axios.get(`${API_URL}/ai-exam/history`, {
        params,
        headers: getAuthHeaders()
    });
    return response.data.data;
};

export const GetAIExamDetails = async (examId: string) => {
    const response = await axios.get(`${API_URL}/ai-exam/history/${examId}`, {
        headers: getAuthHeaders()
    });
    return response.data.data;
};
