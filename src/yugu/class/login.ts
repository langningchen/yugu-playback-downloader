import { type SpinnerResult } from "@clack/prompts";
import fetch from "../fetch.js";

export default async (s: SpinnerResult) => {
  s.start("Logging to yugu class");
  let url = "https://class.luogu.com.cn/connect/luogu";
  while (url !== "https://class.luogu.com.cn/") {
    const res = await fetch(url, {
      redirect: "manual",
    });
    url = res.headers.get("location") || "";
    if (!url) {
      throw new Error("Failed to follow redirects");
    }
    s.message(`Following redirect to ${new URL(url).pathname}`);
  }
  s.stop("Successfully logged in to yugu class");
};
