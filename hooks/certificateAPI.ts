import api from '@/lib/axios';
import { Certificate } from '@/types/CertificateType';

interface CreateCertificateData {
  course: number;
  users_permissions_user: number;
  finished_date: string;
  qualification: number;
  certificateCode: string;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function createCertificate(certificateData: CreateCertificateData): Promise<Certificate> {
  try {
    const response = await api.post<ApiResponse<Certificate>>('/api/certificates', {
      data: certificateData
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw new Error('Failed to create certificate');
  }
}

export async function getCertificateByUserAndCourse(userId: number, courseId: number): Promise<Certificate | null> {
  try {
    const response = await api.get<ApiResponse<Certificate[]>>(`/api/certificates?filters[users_permissions_user][id][$eq]=${userId}&filters[course][id][$eq]=${courseId}&populate=*`);
    
    if (response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }
}

export async function getCertificateByCode(certificateCode: string): Promise<Certificate | null> {
  try {
    const response = await api.get<ApiResponse<Certificate[]>>(`/api/certificates?filters[certificateCode][$eq]=${certificateCode}&populate=*`);
    
    if (response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching certificate by code:', error);
    return null;
  }
}

export function generateUniqueCertificateCode(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
}
