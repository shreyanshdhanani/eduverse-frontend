import { AxiosError } from 'axios';
import axios from 'axios';
import { GetOneTopicService } from './topic-service';

const API_URL = process.env.API_URL || 'http://localhost:3020/api';

export const GenerateQuestionService = async(selectedTopic: string)=>{
    try{
        const response = await axios.get(`${API_URL}/quiz/${selectedTopic}`);
        console.log('response.data', response.data)
        return response
    }catch(error: unknown)
    {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'not able to fetch data. Please try again.';
            throw new Error(errorMessage);
          } else {
            throw new Error('An unexpected error occurred. Please try again later.');
          }
    }
}
