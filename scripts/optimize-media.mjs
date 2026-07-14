import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const projectsRoot = path.join(root, "public", "projects");
const widths = [500, 1000];
let before = 0;
let after = 0;
let generated = 0;

for (const slug of await readdir(projectsRoot)) {
  const directory = path.join(projectsRoot, slug);
  for (const file of (await readdir(directory)).filter((name) => /^\d{2}\.png$/.test(name))) {
    const input = path.join(directory, file);
    const base = path.basename(file, ".png");
    before += (await stat(input)).size;
    for (const width of widths) {
      const webp = path.join(directory, `${base}-${width}.webp`);
      const avif = path.join(directory, `${base}-${width}.avif`);
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: width === 500 ? 76 : 82, effort: 5 }).toFile(webp);
      await sharp(input).resize({ width, withoutEnlargement: true }).avif({ quality: width === 500 ? 45 : 52, effort: 5 }).toFile(avif);
      after += (await stat(webp)).size + (await stat(avif)).size;
      generated += 2;
    }
  }
}

await sharp(path.join(root, "public", "hero-frame-6.png"))
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 82, effort: 5 })
  .toFile(path.join(root, "public", "hero-poster.webp"));

const cardPaths = [
  path.join(projectsRoot, "kids", "01.png"),
  path.join(projectsRoot, "water", "01.png"),
  path.join(projectsRoot, "yellow", "01.png"),
];
const cardLayers = await Promise.all(cardPaths.map(async (source, index) => ({
  input: await sharp(source)
    .resize(260, 520, { fit: "cover", position: "top" })
    .rotate(index === 1 ? 2 : -3, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer(),
  left: 590 + index * 190,
  top: index === 1 ? 62 : 78,
})));
const typeLayer = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cn{font-family:'Microsoft YaHei','Noto Sans CJK SC',Arial,sans-serif;font-weight:800;fill:#171717}
    .en{font-family:Arial,sans-serif;font-weight:700;letter-spacing:5px;fill:#8f3029}
  </style>
  <text x="66" y="82" class="en" font-size="15">LUCKY CAT DESIGN · 2026</text>
  <text x="66" y="205" class="cn" font-size="70">直播间设计</text>
  <text x="66" y="292" class="cn" font-size="70">视觉全案作品集</text>
  <line x1="66" y1="352" x2="500" y2="352" stroke="#171717" opacity=".35"/>
  <text x="66" y="401" class="cn" font-size="24" font-weight="500">空间视觉 · 电商主图 · 品牌物料</text>
  <text x="66" y="548" class="en" font-size="13">PRIVATE PORTFOLIO</text>
</svg>`);
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#e9e5dc" },
})
  .composite([
    { input: Buffer.from('<svg width="1200" height="630"><defs><radialGradient id="g"><stop stop-color="#fff"/><stop offset="1" stop-color="#d8d0c3"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1090" cy="80" r="250" fill="#d84b3e" opacity=".18"/></svg>') },
    ...cardLayers,
    { input: typeLayer, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public", "og.png"));

console.log(JSON.stringify({ generated, sourceBytes: before, optimizedVariantBytes: after }));