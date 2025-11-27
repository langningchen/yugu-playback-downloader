import { Parser, type Segment } from "m3u8-parser";
import fetch from "../fetch.js";
import { createDecipheriv, type CipherKey } from "crypto";
import { createWriteStream } from "fs";
import type { YuguError } from "../type.js";
import { progress } from "@clack/prompts";

const CONCURRENCY = 16;

const fetchM3u8 = async (m3u8Uri: string): Promise<Segment[]> => {
  const res = await fetch(m3u8Uri);
  const m3u8Content = await res.text();
  const parser = new Parser();
  parser.push(m3u8Content);
  parser.end();
  return parser.manifest.segments;
};
const getKey = async (uri: string): Promise<CipherKey> => {
  uri = uri.replace("/live/decrypt", "/api/live/decrypt");
  const res = await fetch(uri);
  const keyBuffer = await res.arrayBuffer();
  return new Uint8Array(keyBuffer);
};
type SignedReplay = { url: string };
const getRealSegmentUri = async (uri: string): Promise<string> => {
  const res = await fetch(
    "https://class.luogu.com.cn/api/live/signReplay?url=" +
      encodeURIComponent(uri)
  );
  const data = (await res.json()) as SignedReplay | YuguError;
  if (data.hasOwnProperty("errorCode")) {
    throw new Error((data as YuguError).errorMessage);
  }
  return (data as SignedReplay).url;
};
const downloadSegment = async (
  uri: string,
  key: CipherKey,
  iv: Uint8Array
): Promise<Uint8Array> => {
  const res = await fetch(uri);
  const encryptedData = new Uint8Array(await res.arrayBuffer());
  const decipher = createDecipheriv("aes-128-cbc", key, iv);
  const decryptedData = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return new Uint8Array(decryptedData);
};

export default async (m3u8Uri: string, filePath: string): Promise<void> => {
  const segments = await fetchM3u8(m3u8Uri);
  if (segments.length == 0 || !segments[0]!.key) {
    throw new Error("No encryption key found in the m3u8 file");
  }
  const key = await getKey(segments[0]!.key.uri);

  const p = progress({ max: segments.length });
  p.start("Downloading segments");
  const ws = createWriteStream(filePath);

  let nextWrite = 0;
  let downloadedCount = 0;
  const pendingBuffers = new Map<number, Uint8Array>();
  const queue = segments.map((segment, index) => ({ segment, index }));

  const worker = async () => {
    while (queue.length > 0) {
      const job = queue.shift();
      if (!job) break;
      const { segment, index } = job;
      try {
        const realUri = await getRealSegmentUri(
          [...m3u8Uri.split("/").slice(0, -1), segment!.uri].join("/")
        );

        const iv = Buffer.alloc(16);
        iv.writeUInt32BE(index, 12);
        const data = await downloadSegment(realUri, key, iv);
        pendingBuffers.set(index, data);
        downloadedCount++;
        p.advance(
          1,
          `Downloaded segment ${downloadedCount}/${segments.length}`
        );
        while (pendingBuffers.has(nextWrite)) {
          const bufferToWrite = pendingBuffers.get(nextWrite)!;
          ws.write(bufferToWrite);
          pendingBuffers.delete(nextWrite);
          nextWrite++;
        }
      } catch (err) {
        throw err;
      }
    }
  };

  await Promise.all(
    Array(CONCURRENCY)
      .fill(null)
      .map(() => worker())
  );

  ws.end();
  p.stop(`Download complete: ${filePath}`);

  await new Promise<void>((resolve, reject) => {
    ws.on("finish", resolve);
    ws.on("error", reject);
  });
};
