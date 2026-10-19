// Renders product loops: loads each scene in headless Chrome, captures every frame from SCENE.render(t),
// then encodes MP4 (H.264, no audio) + a poster to public/videos.
// Usage: node brag-output/render.mjs [slug ...]   (Chrome must be running with --remote-debugging-port=9555)
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const scenesDir = join(here, "scenes");
const workDir = join(here, "work");
const outDir = join(here, "..", "public", "videos");
const FPS = 30;
const PORT = process.env.CDP_PORT || 9555;

const wanted = process.argv.slice(2);
const slugs = (wanted.length ? wanted : readdirSync(scenesDir).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, "")));

const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
};
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
mkdirSync(outDir, { recursive: true });

for (const slug of slugs) {
  errors.length = 0;
  await send("Page.navigate", { url: `file://${join(scenesDir, slug + ".html")}` });
  await sleep(600);
  await ev("document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {})))).then(() => true)");
  const duration = await ev("window.SCENE && window.SCENE.duration");
  if (!duration) throw new Error(`${slug}: window.SCENE.duration missing. Errors: ${errors.join(" | ")}`);
  const frames = Math.round(duration * FPS);
  const dir = join(workDir, slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (let f = 0; f < frames; f++) {
    await ev(`window.SCENE.render(${(f / FPS).toFixed(5)})`);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(dir, `${String(f).padStart(4, "0")}.png`), Buffer.from(shot.result.data, "base64"));
  }
  if (errors.length) console.warn(`${slug}: page errors: ${errors.join(" | ")}`);
  const mp4 = join(outDir, `${slug}.mp4`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(dir, "%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
  // Poster: the settled "result" frame (SCENE.poster seconds, default 70% through).
  const posterT = (await ev("window.SCENE.poster")) ?? duration * 0.7;
  const posterFrame = String(Math.min(frames - 1, Math.round(posterT * FPS))).padStart(4, "0");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(dir, `${posterFrame}.png`), "-q:v", "4", join(outDir, `${slug}.jpg`)]);
  const size = execFileSync("du", ["-h", mp4]).toString().split("\t")[0];
  console.log(`${slug}: ${frames} frames → ${size} mp4, poster at ${posterT}s`);
}
ws.close();
process.exit(0);
