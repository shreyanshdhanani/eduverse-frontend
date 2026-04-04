import axiosInstance from './axiosInstance';

export const GetLandingPageService = async () => {
  try {
    const response = await axiosInstance.get('/cms/landing-page');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch landing page content');
  }
};

export const UpdateLandingPageService = async (data: any) => {
  try {
    const response = await axiosInstance.patch('/cms/landing-page', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update landing page content');
  }
};
