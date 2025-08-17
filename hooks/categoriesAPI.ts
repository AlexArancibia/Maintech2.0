import axios from 'axios';
import api from '../lib/axios'
import { getImageUrl } from '../lib/getImageUrl';
// Interfaces
import { Category } from '@/types/CategoryType';


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

export async function getCategories(): Promise<Category[]> {
  
  try {
    const response = await api.get<ApiResponse<Category>>('/api/categories?populate[category_img][fields][0]=url');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener las categorías'
      );
    }
    throw error;
  }
}

export { api };