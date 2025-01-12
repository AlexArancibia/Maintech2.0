import { DetailedChapter } from "@/types/ChapterType";
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


export async function getChaptersByCourse(course : string): Promise<DetailedChapter[]> {
  try {
    const cursoSlug = IdConversion(course)

    const response = await api.get<ApiResponse<DetailedChapter>>(`/api/chapters?filters[course][titleSlug][$eq]=${cursoSlug}&populate[quiz][populate][question][populate]=answer&populate[attachment]=*&populate[user_progresses][populate][1]=users_permissions_user`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching detailed chapters:', error);
    throw new Error('Failed to fetch detailed chapters');
  }
}
