import { Chapter } from "./CoursesType";

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BasicUser {
  id: number;
  documentId: string;
  email: string;
}



