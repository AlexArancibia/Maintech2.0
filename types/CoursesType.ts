import { DetailedChapter } from "./ChapterType";
import { BasicUser, User } from "./StudentType";
import { Teacher } from "./TeacherType";
import { Timestamp } from "./timestamp";

export interface BasicCategory {
  id: number;
  documentId: string;
  name: string;
}

export interface Image {
  id: number;
  documentId: string;
  url: string;
  name: string;
}


type NodeType = 'heading' | 'paragraph' | 'list' | 'quote';

export interface TextNode {
  text: string;
  type: 'text';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface LinkNode {
  type: 'link';
  url: string;
  children: TextNode[];
}

export interface ListItemNode {
  type: 'list-item';
  children: TextNode[];
}

export interface InfoNode {
  type: NodeType;
  level?: number;
  children: (TextNode | ListItemNode | LinkNode)[];
  format?: string;
}

 

 

export interface BasicCourse extends Timestamp {
  id: number;
  documentId: string;
  title: string;
 
  info: InfoNode[];
  teacher: Teacher;
  price: number;
  priceUSD: number;
  titleSlug: string;
  category: BasicCategory;
  modality: string;
  image: Image;
  users_permissions_users: BasicUser[];
  content: InfoNode[];
  start_date: string | null;
  finish_date: string | null;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
}

export interface Chapter extends Timestamp {
  id: number;
  documentId: string;
  title: string;
  content: InfoNode[];
  position: number;
  date: string | null;
  hours: number;
  chapterSlug: string;
  shortdescription: string | null;
  attachment: Attachment[] | null;
  liveSessionUrl: string | null;
  platform: string | null;
}

export interface DetailedCourse extends BasicCourse {
  chapters: DetailedChapter[];
}

export interface CourseResponse {
  data: DetailedCourse[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}