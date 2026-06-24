import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { join } from "node:path";

import { createStaticServer, getContentType, resolveStaticPath } from "../server.mjs";

const root = process.cwd();

describe("Cloudtype static server", () => {
  const servers = [];

  after(async () => {
    await Promise.all(
      servers.map(
        (server) =>
          new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
          })
      )
    );
  });

  it("maps root requests to index.html", () => {
    assert.equal(resolveStaticPath(root, "/"), join(root, "index.html"));
    assert.equal(resolveStaticPath(root, "/index.html?demo=1"), join(root, "index.html"));
  });

  it("rejects path traversal before touching the filesystem", () => {
    assert.equal(resolveStaticPath(root, "/../package.json"), null);
    assert.equal(resolveStaticPath(root, "/%2e%2e/package.json"), null);
  });

  it("serves static assets over localhost with deployment-safe headers", async () => {
    const server = createStaticServer({ root });
    servers.push(server);

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address();

    const htmlResponse = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(htmlResponse.status, 200);
    assert.match(htmlResponse.headers.get("content-type"), /^text\/html/);
    assert.equal(htmlResponse.headers.get("x-content-type-options"), "nosniff");
    assert.match(await htmlResponse.text(), /warGround3dCanvas/);

    const jsResponse = await fetch(`http://127.0.0.1:${port}/app.js`);
    assert.equal(jsResponse.status, 200);
    assert.match(jsResponse.headers.get("content-type"), /^text\/javascript/);
  });

  it("returns 403 for encoded traversal attempts", async () => {
    const server = createStaticServer({ root });
    servers.push(server);

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address();

    const statusCode = await new Promise((resolve, reject) => {
      const req = request({ host: "127.0.0.1", port, path: "/%2e%2e/package.json" }, (res) => {
        res.resume();
        res.on("end", () => resolve(res.statusCode));
      });
      req.on("error", reject);
      req.end();
    });
    assert.equal(statusCode, 403);
  });

  it("uses correct content types for demo asset files", () => {
    assert.equal(getContentType("asset.glb"), "model/gltf-binary");
    assert.equal(getContentType("terrain.json"), "application/json; charset=utf-8");
    assert.equal(getContentType("briefing.pdf"), "application/pdf");
    assert.equal(getContentType("sheet.xlsx"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  });
});
