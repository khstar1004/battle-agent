import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PORT = 4174;
const DEFAULT_HOST = "0.0.0.0";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".glb", "model/gltf-binary"],
  [".gltf", "model/gltf+json"],
  [".pdf", "application/pdf"],
  [".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
]);

function getDecodedPathname(requestUrl) {
  const rawPath = String(requestUrl || "/").split(/[?#]/, 1)[0] || "/";

  try {
    const decoded = decodeURIComponent(rawPath).replace(/\\/g, "/");
    const segments = decoded.split("/");
    if (segments.includes("..") || decoded.includes("\0")) return null;
    return decoded.startsWith("/") ? decoded : `/${decoded}`;
  } catch {
    return null;
  }
}

export function getContentType(filePath) {
  return contentTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";
}

export function resolveStaticPath(rootDir, requestUrl) {
  let pathname = getDecodedPathname(requestUrl);
  if (!pathname) return null;
  if (pathname.endsWith("/")) pathname = `${pathname}index.html`;

  const root = resolve(rootDir);
  const candidate = resolve(root, `.${pathname}`);
  const insideRoot = candidate === root || candidate.startsWith(`${root}${sep}`);
  return insideRoot ? candidate : null;
}

function writeHeaders(response, statusCode, headers = {}) {
  response.writeHead(statusCode, {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "no-referrer",
    ...headers
  });
}

function sendText(response, statusCode, message) {
  writeHeaders(response, statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(message);
}

async function serveStaticFile(root, request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    writeHeaders(response, 405, {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    });
    response.end("Method Not Allowed");
    return;
  }

  const filePath = resolveStaticPath(root, request.url);
  if (!filePath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      request.url = `${request.url.replace(/\/?$/, "/")}index.html`;
      return serveStaticFile(root, request, response);
    }
    if (!fileStat.isFile()) {
      sendText(response, 404, "Not Found");
      return;
    }

    writeHeaders(response, 200, {
      "Content-Type": getContentType(filePath),
      "Content-Length": String(fileStat.size),
      "Cache-Control": "public, max-age=0, must-revalidate"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath)
      .on("error", () => {
        if (!response.headersSent) sendText(response, 500, "Internal Server Error");
        else response.destroy();
      })
      .pipe(response);
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
      sendText(response, 404, "Not Found");
      return;
    }
    sendText(response, 500, "Internal Server Error");
  }
}

export function createStaticServer(options = {}) {
  const root = resolve(options.root || process.cwd());
  return createServer((request, response) => {
    serveStaticFile(root, request, response);
  });
}

export function parsePort(value, fallback = DEFAULT_PORT) {
  const port = Number(value);
  if (Number.isInteger(port) && port > 0 && port < 65536) return port;
  return fallback;
}

const currentFile = fileURLToPath(import.meta.url);
const entryFile = process.argv[1] ? resolve(process.argv[1]) : "";

if (currentFile === entryFile) {
  const host = process.env.HOST || DEFAULT_HOST;
  const port = parsePort(process.env.PORT);
  createStaticServer({ root: process.cwd() }).listen(port, host, () => {
    console.log(`WAR GROUND static server listening on http://${host}:${port}`);
  });
}
