import { Chapter } from "./CoursesType";
import { User } from "./StudentType";
import { Timestamp } from "./timestamp";

interface Answer {
  id: number;
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  content: string;
  answer: Answer[];
}

export interface Quiz {
  id: number;
  question: Question[];
}

interface QuizAttempt {
  __component: string;
  id: number;
  attempt: number;
  qualification: number;
  approved: boolean;
  
}

 

interface Course extends Timestamp {
  id: number;
  documentId: string;
  title: string;
  description: string;
 
  price: number;
  priceUSD: number;
  titleSlug: string;
  modality: string;
}

 


export interface UserProgress extends Timestamp {
  id: number;
  documentId: string;
  isCompleted: boolean;
  chapter: {id: number ;documentId: string; title: string}
 
  users_permissions_user: User;
  quiz_attempt: QuizAttempt[] | null;
}

export interface DetailedChapter extends Chapter {
  user_progresses: UserProgress[];
  course: Course;
  quiz: Quiz[] ;

}
