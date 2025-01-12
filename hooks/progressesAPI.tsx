import { DetailedChapter, UserProgress } from "@/types/ChapterType";
import api from '../lib/axios'
 
interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}


export async function getUserProgresses(email : string): Promise<UserProgress[]> {
  try {
    
    const response = await api.get<ApiResponse<UserProgress>>(`/api/user-progresses?populate=*&filters[users_permissions_user][email][$eq]=${email}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching detailed chapters:', error);
    throw new Error('Failed to fetch detailed chapters');
  }
}
