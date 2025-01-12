import axios from 'axios';
import api from '../lib/axios';
import { getImageUrl } from '../lib/getImageUrl';
import { BasicCourse, DetailedCourse, Chapter, Attachment } from '@/types/CoursesType';

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

export async function getBasicCourses(): Promise<BasicCourse[]> {
  try {
    console.log("Fetching basic courses...");
    const response = await api.get<ApiResponse<BasicCourse>>(
      '/api/courses?populate[image][fields][0]=url&populate[image][fields][1]=name&populate[category][fields][0]=name&populate[teacher][populate][photo][fields][1]=url&populate[users_permissions_users][fields][0]=email'
    );
    console.log("Response received:", response);
    console.log("Extracted data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching basic courses:', error);
    throw new Error('Failed to fetch basic courses');
  }
}

export async function getDetailedCourses(): Promise<DetailedCourse[]> {
  try {
    console.log("Fetching detailed courses...");
    const response = await api.get<ApiResponse<DetailedCourse>>(
      '/api/courses?populate[chapters][populate][0]=user_progress&populate[image][fields][0]=url&populate[image][fields][1]=name&populate[chapters][populate][attachment]=*&populate[0]=category&populate[teacher][populate][photo][fields][1]=url&populate[users_permissions_users][fields][0]=email'
    );
    console.log("Response received:", response);
    console.log("Extracted data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching detailed courses:', error);
    throw new Error('Failed to fetch detailed courses');
  }
}

export async function getCourseBySlug(
  slug: string,
  detailed: boolean = false
): Promise<BasicCourse | DetailedCourse | null> {
  try {
    console.log("Fetching course by slug:", slug, "Detailed:", detailed);
    const endpoint = detailed
      ? `/api/courses?filters[titleSlug][$eq]=${slug}&populate[0]=chapters&populate[image][fields][0]=url&populate[image][fields][1]=name&populate[chapters][populate][0]=purchases&populate[chapters][populate][attachment]=*&populate[category][fields][0]=name&populate[teacher][populate][photo][fields][1]=url&populate[users_permissions_users][fields][0]=email`
      : `/api/courses?filters[titleSlug][$eq]=${slug}&populate[image][fields][0]=url&populate[image][fields][1]=name&populate[category][fields][0]=name&populate[teacher][populate][photo][fields][1]=url&populate[users_permissions_users][fields][0]=email`;

    console.log("Generated endpoint:", endpoint);
    const response = await api.get<{ data: { data: (BasicCourse | DetailedCourse)[] } }>(endpoint);
    console.log("Raw response:", response);
    console.log("Response data:", response.data);

    const courseData = Array.isArray(response.data.data) ? response.data.data[0] || null : response.data.data;
    console.log("Extracted course data:", courseData);

    return courseData;
  } catch (error) {
    console.error(`Error fetching course with slug "${slug}":`, error);
    return null;
  }
}

export async function getCoursesByStudent(studentId: string): Promise<BasicCourse[]> {
  try {
    console.log("Fetching courses for student ID:", studentId);
    const endpoint = `/api/courses?filters[users_permissions_users][email][$eq]=${studentId}&populate[0]=chapters&populate[image][fields][0]=url&populate[image][fields][1]=name&populate[chapters][populate][attachment]=*&populate[category][fields][0]=name`;
    console.log("Generated endpoint:", endpoint);

    const response = await api.get<ApiResponse<BasicCourse>>(endpoint);
    console.log("Raw response:", response);

    let coursesData: BasicCourse[] = [];
    if (Array.isArray(response.data?.data)) {
      coursesData = response.data.data;
    } else if (response.data?.data) {
      coursesData = [response.data.data];
    }

    console.log("Extracted courses:", coursesData);
    return coursesData;
  } catch (error) {
    console.error(`Error fetching courses for student "${studentId}":`, error);
    return [];
  }
}

export function getChapterContent(chapter: Chapter): string {
  console.log("Processing chapter content:", chapter);
  // const content = chapter.content
  //   .map((item) => {
  //     if (item.type === 'heading') {
  //       return `${'#'.repeat(item.level || 1)} ${item.children[0].text}\n\n`;
  //     } else if (item.type === 'paragraph') {
  //       return `${item.children[0].text}\n\n`;
  //     }
  //     return '';
  //   })
  //   .join('');
  // console.log("Processed content:", content);
  // return content;
  return ""
}

export function getChapterAttachments(chapter: Chapter): Attachment[] | null {
  console.log("Fetching attachments for chapter:", chapter);
  return chapter.attachment;
}

export default {
  getBasicCourses,
  getDetailedCourses,
  getImageUrl,
  getChapterContent,
  getChapterAttachments,
};
