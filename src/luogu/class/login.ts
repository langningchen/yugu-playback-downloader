import fetch from "../fetch.js";

export default async () => {
  let url = "https://class.luogu.com.cn/connect/luogu";
  while (url !== "https://class.luogu.com.cn/") {
    const res = await fetch(url, {
      redirect: "manual",
    });
    url = res.headers.get("location") || "";
    if (!url) {
      throw new Error("Failed to follow redirects");
    }
  }
};
