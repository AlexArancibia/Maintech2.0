import { Timestamp } from "./timestamp";

export interface Teacher extends Timestamp {
  id: number;
  documentId: string;
  name: string;
  titulo: string;
  biography: string;
  country: string;
  linkedin: string | null;
 
  photo: {
    id: number;
    documentId: string;
    url: string;
  } ;
}