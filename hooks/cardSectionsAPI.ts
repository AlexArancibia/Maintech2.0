import axios from 'axios';
import api from '../lib/axios';

export interface CardSection {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: {
    url: string;
    name?: string;
  };
  background?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    [key: string]: any;
  };
  mobileBackground?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    [key: string]: any;
  };
  link?: string;
  card?: any[];
  // Agrega aquí otros campos según el modelo de Strapi
}

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

export interface CardSectionsOptions {
  documentId?: string;
  populateCard?: boolean;
  populateAll?: boolean;
  [key: string]: any;
}

export async function getCardSections(options?: CardSectionsOptions): Promise<CardSection[]> {
  try {
    let endpoint = '/api/card-sections';
    const params: string[] = [];
    if (options?.documentId) {
      params.push(`filters[documentId][$eq]=${options.documentId}`);
    }
    if (options?.populateCard) {
      params.push('populate[card][populate]=*');
    }
    if (options?.populateAll) {
      params.push('populate=*');
    }
    // Permite agregar más parámetros personalizados
    Object.entries(options || {}).forEach(([key, value]) => {
      if (!['documentId', 'populateCard', 'populateAll'].includes(key)) {
        params.push(`${key}=${value}`);
      }
    });
    if (params.length) {
      endpoint += '?' + params.join('&');
    }
    const response = await api.get<ApiResponse<CardSection>>(endpoint);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener las card sections');
    }
    throw error;
  }
}

export default {
  getCardSections,
};
