import fetch from "../fetch.js";
import type { Course, CourseDetail, Response } from "./types.js";

export type CourseResponse = Response<{
  course: CourseDetail;
  registration: null;
  recommendCourses: Course[];
  lowestPrice: number;
  imGroup: [];
  canEdit: boolean;
  seriesCourses: Course[];
}>;

export default async (shortName: string) => {
  // This page does not require authentication but returns more detailed course info
  const res = await fetch(
    `https://class.luogu.com.cn/course/${shortName}?_contentOnly=1`
  );
  if (res.status !== 200) {
    throw new Error(`Failed to fetch course info: ${res.statusText}`);
  }
  return res.json() as Promise<CourseResponse>;
};
