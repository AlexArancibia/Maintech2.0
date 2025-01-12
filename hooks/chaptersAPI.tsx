import { DetailedChapter, UserProgress } from "@/types/ChapterType";
 
import api from '../lib/axios'
import { IdConversion } from "@/lib/IdConvertion";

export interface ApiResponse<T> {
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

export async function getChaptersByCourse(course: string): Promise<DetailedChapter[]> {
  try {
    const response = await api.get<ApiResponse<DetailedChapter>>(`/api/chapters?filters[course][titleSlug][$eq]=${course}&populate[quiz][populate][question][populate]=answer&populate[attachment]=*&populate[user_progresses][populate][1]=users_permissions_user`);
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching detailed chapters:', error);
    throw new Error('Failed to fetch detailed chapters');
  }
}

export async function getUserProgress(chapterId: string, userEmail: string): Promise<UserProgress | null> {
  try {
    const response = await api.get<ApiResponse<UserProgress>>('/api/user-progresses', {
      params: {
        populate: '*',
        'filters[users_permissions_user][email][$eq]': userEmail,
        'filters[chapter][documentId][$eq]': chapterId
      }
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
}

