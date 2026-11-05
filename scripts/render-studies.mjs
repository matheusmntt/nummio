// Renders the procedural visual studies (scripts/studies/*.html) to PNG
// masters in assets/studies/, using a local headless Chrome over CDP.
// Run with `pnpm studies:render`; set CHROME_PATH if Chrome is elsewhere.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const studies = [
  { page: "scripts/studies/computational.html", out: "computational-forms.png", width: 3200, height: 2000 },
];

const types = { ".html": "text/html", ".js": "text/javascript" };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let body;
  try {
    body = readFileSync(join(root, path));
  } catch {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
  res.end(body);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const profile = mkdtempSync(join(tmpdir(), "nummio-studies-"));
const port = 9400 + Math.floor(Math.random() * 400);
const browser = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--use-angle=swiftshader",
  "--enable-unsafe-swiftshader",
  "--hide-scrollbars",
  "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      return await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
    } catch {
      await sleep(200);
    }
  }
  throw new Error("Chrome did not start");
}

const target = await connect();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id) pending.get(msg.id)?.(msg);
  if (msg.method === "Runtime.exceptionThrown") console.error(msg.params.exceptionDetails.exception?.description);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++seq;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send("Runtime.enable");
const outDir = join(root, "assets/studies");
mkdirSync(outDir, { recursive: true });

for (const study of studies) {
  await send("Emulation.setDeviceMetricsOverride", { width: study.width, height: study.height, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${origin}/${study.page}` });
  let done = false;
  for (let i = 0; i < 300 && !done; i++) {
    await sleep(200);
    const r = await send("Runtime.evaluate", { expression: "window.__done === true", returnByValue: true });
    done = r.result?.result?.value === true;
  }
  if (!done) throw new Error(`${study.page} did not finish rendering`);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: study.width, height: study.height, scale: 1 },
  });
  writeFileSync(join(outDir, study.out), Buffer.from(shot.result.data, "base64"));
  console.log(`studies: ${study.page} -> assets/studies/${study.out}`);
}

ws.close();
const exited = new Promise((r) => browser.once("exit", r));
browser.kill();
await exited;
server.close();
rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
