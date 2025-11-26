import fetch from "../fetch.js";
import type { Course, User } from "./types.js";

export interface CourseResponse {
  courseRegistrations: Array<{
    course: Course;
    user: User;
    replayExpireTime: number;
  }>;
}

export default async () => {
  const res = await fetch("https://class.luogu.com.cn/api/user/courses");
  if (res.status !== 200) {
    throw new Error(`Failed to fetch course list: ${res.statusText}`);
  }
  return res.json() as Promise<CourseResponse>;
};
