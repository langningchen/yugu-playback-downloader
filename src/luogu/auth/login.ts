import captcha from "./captcha.js";
import fetch from "../fetch.js";
import type { LuoguError } from "../type.js";

export type LoginResponse = {
  username: string;
  syncToken: string;
  locked: boolean;
  redirectTo: string;
};

export default async (username: string, password: string) => {
  const res = await fetch("https://www.luogu.com.cn/do-auth/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, captcha: await captcha() }),
  });
  const data = (await res.json()) as LoginResponse | LuoguError;
  if (data.hasOwnProperty("errorCode")) {
    throw new Error((data as LuoguError).errorMessage);
  }
};
