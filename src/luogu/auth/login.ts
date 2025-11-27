import getCaptcha from "./captcha.js";
import fetch from "../fetch.js";
import type { LuoguError } from "../type.js";
import { spinner } from "@clack/prompts";

export type LoginResponse = {
  username: string;
  syncToken: string;
  locked: boolean;
  redirectTo: string;
};

export default async (username: string, password: string) => {
  const s = spinner();
  const captcha = await getCaptcha(s);
  s.message("Logging in");
  const res = await fetch("https://www.luogu.com.cn/do-auth/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, captcha }),
  });
  const data = (await res.json()) as LoginResponse | LuoguError;
  if (data.hasOwnProperty("errorCode")) {
    throw new Error((data as LuoguError).errorMessage);
  }
  s.stop("Successfully logged in to luogu");
};
