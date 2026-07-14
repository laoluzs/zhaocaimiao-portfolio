export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  en: string;
  category: string;
  year: string;
  summary: string;
  goal: string;
  services: string[];
  highlights: string[];
  images: string[];
};

export const projects: PortfolioProject[] = [
  {
    id: "01",
    slug: "kids",
    title: "儿童乐园",
    en: "KIDS PLAYGROUND",
    category: "直播间视觉设计",
    year: "2026",
    summary: "明快色彩与趣味装置构建儿童主题直播场景。",
    goal: "用高识别度的色彩和游乐语言，让直播画面更亲切、更有记忆点。",
    services: ["场景设计", "主视觉设计", "物料延展"],
    highlights: ["童趣色彩", "空间层次", "镜头适配"],
    images: ["01", "02", "03", "04", "05", "06"],
  },
  {
    id: "02",
    slug: "water",
    title: "夏日户外玩水",
    en: "SUMMER WATER FUN",
    category: "主题活动视觉",
    year: "2026",
    summary: "清凉蓝调与户外氛围呈现夏季活动视觉。",
    goal: "在直播镜头中保留夏日水感，同时建立轻松、有参与感的活动气氛。",
    services: ["主题策划", "场景视觉", "活动物料"],
    highlights: ["清凉蓝调", "户外氛围", "动态构图"],
    images: ["01", "02", "03", "04", "05", "06"],
  },
  {
    id: "03",
    slug: "yellow",
    title: "黄色主题",
    en: "YELLOW CAMPAIGN",
    category: "品牌视觉全案",
    year: "2026",
    summary: "高饱和黄色系统贯穿空间、主图与延展物料。",
    goal: "以单一主色建立强品牌识别，并保持空间与电商画面的视觉一致性。",
    services: ["视觉策略", "直播间设计", "电商延展"],
    highlights: ["高识别色", "系统延展", "统一画面"],
    images: ["01", "02", "03", "04", "05", "06"],
  },
];

export function projectImagePath(
  project: PortfolioProject,
  image: string,
  format: "png" | "webp" | "avif" = "png",
  width?: 500 | 1000,
) {
  const suffix = width ? `-${width}` : "";
  return `/projects/${project.slug}/${image}${suffix}.${format}`;
}