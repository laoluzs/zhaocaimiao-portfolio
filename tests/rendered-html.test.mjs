import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://portfolio.local${pathname}`, {
      headers: { accept: "text/html", host: "portfolio.local" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the finished Chinese portfolio with privacy and share metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>招财猫｜直播间视觉设计作品集<\/title>/);
  assert.match(html, /name="description" content="精选直播间场景、主题活动与品牌视觉全案/);
  assert.match(html, /name="robots" content="noindex, nofollow, noarchive, nocache"/);
  assert.match(html, /property="og:image" content="https:\/\/portfolio\.local\/og\.png"/);
  assert.match(html, /直播间设计/);
  assert.match(html, /视觉全案作品集/);
  assert.match(html, /精选案例/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|codex-preview/);
  assert.doesNotMatch(html, /mailto:/);
});

test("server-renders all structured cases and accessible navigation", async () => {
  const html = await (await render()).text();
  for (const [slug, title] of [
    ["kids", "儿童乐园"],
    ["water", "夏日户外玩水"],
    ["yellow", "黄色主题"],
  ]) {
    assert.match(html, new RegExp(`id="case-${slug}"`));
    assert.match(html, new RegExp(title));
    assert.match(html, new RegExp(`/projects/${slug}/01-500\\.avif`));
    assert.match(html, new RegExp(`/projects/${slug}/01-1000\\.webp`));
  }
  assert.match(html, /跳到作品/);
  assert.match(html, /按回车查看大图，使用左右方向键切换/);
  assert.match(html, /复制当前案例链接/);
  assert.match(html, /class="thumbnail-nav"/);
  assert.match(html, /class="project-pagination"/);
  assert.match(html, /查看大图/);
  assert.match(html, /width="1000" height="2000"/);
});

test("includes every optimized responsive image and private sharing asset", async () => {
  const slugs = ["kids", "water", "yellow"];
  let variants = 0;
  for (const slug of slugs) {
    const directory = new URL(`../public/projects/${slug}/`, import.meta.url);
    const files = await readdir(directory);
    for (const index of ["01", "02", "03", "04", "05", "06"]) {
      const original = new URL(`${index}.png`, directory);
      const originalSize = (await stat(original)).size;
      for (const width of [500, 1000]) {
        for (const format of ["webp", "avif"]) {
          const optimized = new URL(`${index}-${width}.${format}`, directory);
          await access(optimized);
          const optimizedSize = (await stat(optimized)).size;
          assert.ok(optimizedSize < originalSize, `${optimized.pathname} should be smaller than its PNG source`);
          variants += 1;
        }
      }
    }
    assert.equal(files.filter((name) => /-(500|1000)\.(webp|avif)$/.test(name)).length, 24);
  }
  assert.equal(variants, 72);
  for (const file of ["public/og.png", "public/hero-poster.webp", "public/robots.txt", "public/_headers"]) {
    await access(new URL(`../${file}`, import.meta.url));
  }
  assert.match(await readFile(new URL("../public/robots.txt", import.meta.url), "utf8"), /Disallow: \//);
  assert.match(await readFile(new URL("../public/_headers", import.meta.url), "utf8"), /max-age=31536000/);
});

test("source keeps keyboard, touch, zoom, progress restore and reduced-motion behavior", async () => {
  const [page, css, data] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /role="dialog"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /event\.key === "ArrowLeft"/);
  assert.match(page, /onTouchStart/);
  assert.match(page, /sessionStorage\.setItem/);
  assert.match(page, /portfolio:scrollY/);
  assert.match(page, /navigator\.clipboard\.writeText/);
  assert.match(page, /Math\.min\(3/);
  assert.match(page, /saveData/);
  assert.match(page, /draggable=\{false\}/);
  assert.match(page, /element\?\.complete && element\.naturalWidth > 0/);
  assert.match(page, /onError=\{\(\) => setLoadedImage\(image\)\}/);
  assert.doesNotMatch(css, /\.project-image img\{[^}]*opacity:0/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\(max-width:800px\)/);
  assert.match(data, /services:\s*\[/);
  assert.match(data, /highlights:\s*\[/);
});