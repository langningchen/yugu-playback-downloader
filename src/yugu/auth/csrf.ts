import { type SpinnerResult } from "@clack/prompts";
import fetch from "../fetch.js";

export default async (s: SpinnerResult) => {
  s.message("Fetching login CSRF token");
  const res = await fetch("https://www.luogu.com.cn/auth/login");
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const csrfToken = doc
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (!csrfToken) {
    throw new Error("CSRF token not found in the document");
  }
  return csrfToken;
};
