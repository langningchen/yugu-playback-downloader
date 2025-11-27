import getCaptcha from "./captcha.js";
import fetch from "../fetch.js";
import type { YuguError } from "../type.js";
import { type SpinnerResult } from "@clack/prompts";

export type LoginResponse = {
  username: string;
  syncToken: string;
  locked: boolean;
  redirectTo: string;
};

export default async (s: SpinnerResult, username: string, password: string) => {
  const captcha = await getCaptcha(s);
  s.message("Logging in");
  const res = await fetch("https://www.luogu.com.cn/do-auth/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, captcha }),
  });
  const data = (await res.json()) as LoginResponse | YuguError;
  if (data.hasOwnProperty("errorCode")) {
    throw new Error((data as YuguError).errorMessage);
  }
  s.stop("Successfully logged in to yugu");
};
