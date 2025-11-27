import {
  isCancel,
  multiselect,
  select,
  log,
  intro,
  outro,
  text,
  password,
  spinner,
} from "@clack/prompts";
import courseList from "./luogu/class/courseList.js";
import course from "./luogu/class/course.js";
import classroom from "./luogu/class/live.js";
import decode from "./luogu/class/decode.js";
import loginLuogu from "./luogu/auth/login.js";
import loginClass from "./luogu/class/login.js";
import download from "./luogu/class/download.js";
import check from "./luogu/auth/check.js";

intro("Luogu Class Downloader");
try {
  if (!(await check())) {
    const luoguUsername = await text({
      message: "Enter your Luogu username",
    });
    if (isCancel(luoguUsername)) {
      throw new Error("Login cancelled by user");
    }
    const luoguPassword = await password({
      message: "Enter your Luogu password",
    });
    if (isCancel(luoguPassword)) {
      throw new Error("Login cancelled by user");
    }
    await loginLuogu(luoguUsername, luoguPassword);
  }
  await loginClass();
  const s = spinner();
  s.start("Fetching course list");
  const courses = await courseList();
  s.stop("Got course list");
  const courseName = await select({
    message: "Select courses to download",
    options: courses.courseRegistrations.map(({ course }) => ({
      label: course.name,
      value: course.shortName,
    })),
  });
  if (isCancel(courseName)) {
    throw new Error("Course selection cancelled by user");
  }
  s.start("Fetching course details");
  const courseData = await course(courseName);
  s.stop("Got course details");
  const liveNames = await multiselect({
    message: "Select chapters to download",
    options: courseData.currentData.course.lives.map((live) => ({
      label: live.name,
      value: live.shortName,
    })),
  });
  if (isCancel(liveNames)) {
    throw new Error("Chapter selection cancelled by user");
  }
  for (const liveName of liveNames) {
    s.start(`Fetching class details for ${liveName}`);
    const liveData = await classroom(liveName);
    s.stop(`Got class details for ${liveName}`);
    for (const replayFile of liveData.currentData.replayFiles) {
      await download(
        decode(replayFile.url.HD, liveData.currentData.obfsKey),
        `${liveData.currentData.lesson.name}.ts`
      );
    }
  }
  log.success("All downloads completed successfully");
} catch (error) {
  log.error(error instanceof Error ? error.message : String(error));
}
outro("Goodbye");
