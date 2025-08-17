import { Timestamp } from "./timestamp";

interface CategoryImage {
  id: number;
  documentId: string;
  url: string;
  name: string;
}

export interface Category extends Timestamp {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  category_img: CategoryImage | null;
  certificate_img?: CategoryImage | null;
}
