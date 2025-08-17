import { Timestamp } from "./timestamp";
import { BasicCourse } from "./CoursesType";
import { BasicUser } from "./StudentType";

export interface Certificate extends Timestamp {
  id: number;
  course: BasicCourse;
  users_permissions_user: BasicUser;
  finished_date: string | null;
  qualification: number;
  certificateCode: string;
}
