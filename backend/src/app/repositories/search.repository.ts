import { CourseRecord } from "../records/course.record";
import { UserRecord } from "../records/user.record";

export interface ISearchRepository {
  search(options: {
    query: string;
    type?: "courses" | "users" | "all";
    page?: number;
    limit?: number;
  }): Promise<{
    courses: CourseRecord[];
    users: UserRecord[];
    total: number;
  }>;
}
