# 招财猫｜直播间视觉设计作品集

这是“招财猫”直播间视觉设计的私域作品集，用于向客户展示直播间场景、主题活动、电商主图与品牌视觉全案。

## 首页演示

▶️ [点击观看首页完整录屏](https://github.com/laoluzs/zhaocaimiao-portfolio/raw/main/docs/homepage-demo.mp4)

> 录屏用于快速了解首页视觉；仓库中的网站版本会持续迭代。

## 当前能力

- 桌面端、平板与手机端响应式布局
- 三组结构化案例数据，包含项目类型、目标、服务内容与设计亮点
- 案例轮播、触摸滑动、方向键操作和浏览进度恢复
- 全屏作品查看、图片缩放、键盘与手势切换
- 当前案例独立分享地址与一键复制链接
- AVIF、WebP、PNG 多格式响应式图片
- 图片加载占位、下一张预加载及移动端视频按需播放
- 首页视频播放、暂停和静音控制
- 减少动态效果模式与基础无障碍支持
- 私域展示水印、禁止图片拖拽和禁止搜索引擎收录
- Open Graph 分享封面与中文分享信息
- 自动构建、渲染、资源完整性和交互能力测试

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Vinext / Vite
- Cloudflare Workers
- Tailwind CSS 4
- Sharp

## 环境要求

- Node.js 22.13.0 或更高版本
- npm

## 本地开发

```bash
npm install
npm run dev
```

## 构建与检查

```bash
npm run lint
npm test
```

`npm test` 会执行正式构建，并验证中文页面、隐私元数据、案例结构、响应式图片和关键交互能力。

## 素材优化

```bash
npm run media:optimize
```

该命令会根据 `public/projects/` 中的原始 PNG 生成 500px、1000px 两档 AVIF/WebP 图片，同时更新首页视频封面与社交分享封面。

## 主要目录

```text
app/page.tsx             页面与交互
app/portfolio-data.ts    案例内容数据
app/globals.css          响应式视觉样式
public/projects/         原始图片与优化版本
public/og.png            分享封面
scripts/optimize-media.mjs 素材优化脚本
tests/                   自动化测试
docs/homepage-demo.mp4   首页录屏
```

## 分享指定案例

每个案例支持独立地址，并可附带当前图片序号：

```text
/#case-kids-1
/#case-water-3
/#case-yellow-6
```

访问者打开后会定位到相应案例，并恢复对应图片。

## 私域说明

网站通过页面元数据和 `robots.txt` 禁止搜索引擎收录，并对展示图片增加低干扰水印。网页无法彻底阻止截图或二次传播，因此重要项目仍建议只向可信客户分享。