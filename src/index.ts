#!/usr/bin/env node
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
import courseList from "./yugu/class/courseList.js";
import course from "./yugu/class/course.js";
import classroom from "./yugu/class/live.js";
import decode from "./yugu/class/decode.js";
import loginYugu from "./yugu/auth/login.js";
import loginClass from "./yugu/class/login.js";
import download from "./yugu/class/download.js";
import check from "./yugu/auth/check.js";

intro("Yugu Class Downloader");
const s = spinner();
try {
  if (!(await check())) {
    const yuguUsername = await text({
      message: "Enter your Yugu username",
    });
    if (isCancel(yuguUsername)) {
      throw new Error("Login cancelled by user");
    }
    const yuguPassword = await password({
      message: "Enter your Yugu password",
    });
    if (isCancel(yuguPassword)) {
      throw new Error("Login cancelled by user");
    }
    await loginYugu(s, yuguUsername, yuguPassword);
  }
  await loginClass(s);
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
} finally {
  s.stop("Done");
}
outro("Program exited");
