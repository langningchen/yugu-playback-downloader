import { spinner } from "@clack/prompts";
import fetch from "../fetch.js";

export default async () => {
  const s = spinner();
  s.start("Checking yugu login");
  const res = await fetch("https://www.luogu.com.cn/chat?_contentOnly=1", {
    redirect: "manual",
  });
  if (res.status === 200) {
    s.stop("You are logged in");
    return true;
  }
  s.error("You are not logged in");
  return false;
};
