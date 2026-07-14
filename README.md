# 招财猫｜直播间视觉设计作品集

这是“招财猫”直播间视觉设计的官方网站与作品集，集中展示直播间场景设计、电商主图、品牌物料以及主题视觉案例。

## 项目特色

- 响应式单页作品集，适配桌面端和移动端
- 展示儿童乐园、夏日玩水和黄色主题三组案例
- 支持案例图片轮播、键盘操作和触摸交互
- 包含动态人物视频、项目数据和服务介绍
- 使用 Vinext 构建，可运行于 Node.js 或 Cloudflare Workers

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Vinext / Vite
- Cloudflare Workers
- Tailwind CSS 4

## 环境要求

- Node.js 22.13.0 或更高版本
- npm

## 本地开发

```bash
npm install
npm run dev
```

开发服务启动后，按照终端显示的本地地址访问网站。

## 正式构建

```bash
npm run build
```

构建产物会生成在 `dist/` 目录：

- `dist/client/`：浏览器静态资源
- `dist/server/index.js`：服务器入口
- `dist/server/wrangler.json`：Cloudflare Workers 配置

## 生产环境运行

```bash
npm start
```

服务默认监听 `0.0.0.0:3000`，也可以通过 `PORT` 环境变量指定端口。生产服务器可以使用 Nginx、Caddy 或服务器面板反向代理到该端口。

## 常用命令

- `npm run dev`：启动本地开发服务
- `npm run build`：生成正式构建产物
- `npm start`：启动生产服务
- `npm run lint`：检查代码规范
- `npm run db:generate`：生成 Drizzle 数据库迁移

## 主要目录

```text
app/                 页面、布局和全局样式
public/              图片、视频和网站图标
worker/              Cloudflare Worker 入口
db/                  数据库结构与访问层
drizzle/             数据库迁移记录
tests/               自动化测试
.openai/hosting.json Sites 托管资源声明
```

## 部署说明

项目当前未启用 D1 数据库或 R2 对象存储绑定。部署时需要保留完整的 `dist/` 目录，服务器应使用 Node.js 22.13.0 或更高版本。

## 项目定位

以直播间设计为原点，通过空间视觉、电商主图和品牌物料设计，帮助品牌提升直播间辨识度、用户停留和内容转化。
