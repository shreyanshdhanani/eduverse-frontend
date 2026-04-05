import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const EnrollCourseService = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.post(`/enrollment/enroll`, {
      token: token,
      courseId: id
    });
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Enrollment failed. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export const GetAllCoursesService = async () => {
  try {
    const response = await axiosInstance.get(`/courses/get-all-courses`);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Courses could not be fetched. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const GetCourseDetailsService = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Course details could not be fetched. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export const GetCourseByIdService = async (courseId: string) => {
  try {
    const response = await axiosInstance.post(`/course-provider/get-single-course/${courseId}`);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Course details could not be fetched.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export const AddCourseSectionService = async (courseId: string, section: any) => {
  try {
    const response = await axiosInstance.post(`/courses/${courseId}/sections`, section);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to add course section. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const UpdateCourseSectionService = async (courseId: string, sectionId: string, sectionData: any) => {
  try {
    const response = await axiosInstance.put(`/courses/${courseId}/sections/${sectionId}`, sectionData);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to update course section. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const DeleteCourseSectionService = async (courseId: string, sectionId: string) => {
  try {
    const response = await axiosInstance.delete(`/courses/${courseId}/sections/${sectionId}`);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to delete course section. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const AddVideoToSectionService = async (courseId: string, sectionId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/courses/${courseId}/sections/${sectionId}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to add video to the section. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const DeleteVideoFromSectionService = async (courseId: string, sectionId: string) => {
  try {
    const response = await axiosInstance.delete(`/courses/${courseId}/sections/${sectionId}/videos`);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || 'Failed to delete video. Please try again.';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
};
  