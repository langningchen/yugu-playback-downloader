import fetch from "../fetch.js";
import type { LiveDetail, Response } from "./types.js";

export type LiveResponse = Response<{
  lesson: LiveDetail;
  obfsKey: number;
  liveUrl: null;
  replayFiles: {
    id: number;
    name: string;
    sort: number;
    startTime: number;
    endTime: number;
    path: string;
    url: {
      HD: string;
      SD: string;
      fallback: string;
    };
  }[];
  playerIdentifier: string;
  exclusiveKey: string;
  isTeacher: boolean;
  userCanChat: boolean;
}>;

export default async (shortName: string) => {
  const res = await fetch(
    `https://class.luogu.com.cn/classroom/${shortName}?_contentOnly=1`
  );
  if (res.status !== 200) {
    throw new Error(`Failed to fetch course info: ${res.statusText}`);
  }
  return res.json() as Promise<LiveResponse>;
};
