import { CookieJar } from "tough-cookie";
import FileCookieStore from "tough-cookie-file-store";

const cookieJar = new CookieJar(new FileCookieStore("./cookies.json"));

export default async (url: string, options?: RequestInit) => {
  const cookie = await cookieJar.getCookieString(url);
  // log.info(`Fetching ${url}`);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: cookie,
    },
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    await cookieJar.setCookie(setCookie, url);
  }
  return response;
};
