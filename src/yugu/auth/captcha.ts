import type { SpinnerResult } from "@clack/prompts";
import fetch from "../fetch.js";

const getImage = async (s: SpinnerResult) => {
  s.message("Fetching captcha image");
  const res = await fetch("https://www.luogu.com.cn/lg4/captcha");
  if (!res.ok) {
    throw new Error("Failed to fetch captcha");
  }
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
};
export default async (s: SpinnerResult) => {
  const image = await getImage(s);
  s.message("Recognizing captcha");
  const res = await fetch("https://luogu.cyezoi.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });
  if (!res.ok) {
    throw new Error("Failed to send captcha");
  }
  const data = (await res.json()) as { prediction: string };
  return data.prediction;
};
