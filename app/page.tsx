"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  projectImagePath,
  projects,
  type PortfolioProject,
} from "./portfolio-data";

type LightboxState = { project: PortfolioProject; index: number } | null;

type ResponsiveProjectImageProps = {
  project: PortfolioProject;
  image: string;
  alt: string;
  eager?: boolean;
  sizes?: string;
  onClick?: () => void;
};

function ResponsiveProjectImage({
  project,
  image,
  alt,
  eager = false,
  sizes = "(max-width: 980px) 100vw, 33vw",
  onClick,
}: ResponsiveProjectImageProps) {
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const loaded = loadedImage === image;

  useEffect(() => {
    const element = imageRef.current;

    // A cached image can finish before React hydrates and attaches onLoad.
    // Checking `complete` keeps the first visible slide from remaining blank.
    const frame = window.requestAnimationFrame(() => {
      if (element?.complete && element.naturalWidth > 0) {
        setLoadedImage(image);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [image, project.slug]);

  return (
    <div className={`project-image ${loaded ? "is-loaded" : "is-loading"}`}>
      <picture>
        <source
          type="image/avif"
          srcSet={`${projectImagePath(project, image, "avif", 500)} 500w, ${projectImagePath(project, image, "avif", 1000)} 1000w`}
          sizes={sizes}
        />
        <source
          type="image/webp"
          srcSet={`${projectImagePath(project, image, "webp", 500)} 500w, ${projectImagePath(project, image, "webp", 1000)} 1000w`}
          sizes={sizes}
        />
        {/* The original PNG remains the compatibility fallback. */}
        <img
          ref={imageRef}
          src={projectImagePath(project, image)}
          width={1000}
          height={2000}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoadedImage(image)}
          onError={() => setLoadedImage(image)}
          onClick={onClick}
          onContextMenu={(event) => event.preventDefault()}
        />
      </picture>
      <span className="image-watermark" aria-hidden="true">
        招财猫 · LUCKY CAT DESIGN
      </span>
    </div>
  );
}

function getStoredSlide(slug: string, total: number) {
  if (typeof window === "undefined") return 0;
  const hashMatch = window.location.hash.match(
    new RegExp(`^#case-${slug}-(\\d+)$`),
  );
  if (hashMatch) {
    return Math.min(Math.max(Number(hashMatch[1]) - 1, 0), total - 1);
  }
  const stored = Number(window.sessionStorage.getItem(`portfolio:${slug}:slide`));
  return Number.isInteger(stored) && stored >= 0 && stored < total ? stored : 0;
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}
function ProjectSlider({
  project,
  projectIndex,
  onOpen,
}: {
  project: PortfolioProject;
  projectIndex: number;
  onOpen: (project: PortfolioProject, index: number) => void;
}) {
  const total = project.images.length;
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const startX = useRef(0);
  const didSwipe = useRef(false);

  useEffect(() => {
    const savedSlide = getStoredSlide(project.slug, total);
    const frame = window.requestAnimationFrame(() => setActive(savedSlide));
    return () => window.cancelAnimationFrame(frame);
  }, [project.slug, total]);

  useEffect(() => {
    window.sessionStorage.setItem(`portfolio:${project.slug}:slide`, String(active));
    const nextIndex = (active + 1) % total;
    const preload = new Image();
    preload.src = projectImagePath(
      project,
      project.images[nextIndex],
      "webp",
      1000,
    );
  }, [active, project, total]);

  const go = (next: number) => setActive((next + total) % total);

  const shareCurrent = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#case-${project.slug}-${active + 1}`;
    window.history.replaceState(null, "", `#case-${project.slug}-${active + 1}`);
    await copyToClipboard(url);

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const onViewportKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(project, active);
    }
  };

  const onTouchStart = (event: ReactTouchEvent) => {
    startX.current = event.touches[0].clientX;
    didSwipe.current = false;
  };

  const onTouchEnd = (event: ReactTouchEvent) => {
    const distance = event.changedTouches[0].clientX - startX.current;
    if (Math.abs(distance) > 45) {
      didSwipe.current = true;
      go(active + (distance < 0 ? 1 : -1));
    }
  };

  return (
    <article
      id={`case-${project.slug}`}
      className="project-card"
      aria-labelledby={`case-${project.slug}-title`}
    >
      <header className="project-head">
        <div>
          <small>
            {project.id} / {String(projects.length).padStart(2, "0")}
          </small>
          <h3 id={`case-${project.slug}-title`}>{project.title}</h3>
          <span>{project.en}</span>
        </div>
        <div className="project-count" aria-live="polite">
          <b>{String(active + 1).padStart(2, "0")}</b>
          <i>/</i>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </header>

      <div
        className="project-stage"
        role="group"
        tabIndex={0}
        aria-label={`${project.title}，第 ${active + 1} 张，共 ${total} 张。按回车查看大图，使用左右方向键切换。`}
        onKeyDown={onViewportKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <figure key={`${project.slug}-${active}`} className="active">
          <ResponsiveProjectImage
            project={project}
            image={project.images[active]}
            alt={`${project.title}视觉设计效果图 ${active + 1}`}
            eager={projectIndex === 0 && active === 0}
            onClick={() => {
              if (!didSwipe.current) onOpen(project, active);
              didSwipe.current = false;
            }}
          />
          <figcaption>
            <span>{String(active + 1).padStart(2, "0")}</span>
            <small>VISUAL DESIGN / {project.year}</small>
          </figcaption>
        </figure>

        <button
          type="button"
          className="stage-arrow prev"
          onClick={() => go(active - 1)}
          aria-label={`${project.title}上一张`}
        >
          ←
        </button>
        <button
          type="button"
          className="stage-arrow next"
          onClick={() => go(active + 1)}
          aria-label={`${project.title}下一张`}
        >
          →
        </button>
        <button
          type="button"
          className="view-large"
          onClick={() => onOpen(project, active)}
        >
          查看大图 ↗
        </button>
      </div>

      <div className="thumbnail-nav" aria-label={`${project.title}图片导航`}>
        {project.images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={index === active ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`查看第 ${index + 1} 张`}
            aria-current={index === active ? "true" : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={projectImagePath(project, image, "webp", 500)}
              width={500}
              height={1000}
              loading="lazy"
              decoding="async"
              draggable={false}
              alt=""
            />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <div className="project-story">
        <p>{project.summary}</p>
        <dl>
          <div>
            <dt>项目类型</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>服务内容</dt>
            <dd>{project.services.join(" / ")}</dd>
          </div>
          <div>
            <dt>设计目标</dt>
            <dd>{project.goal}</dd>
          </div>
        </dl>
        <div className="project-actions">
          <button type="button" onClick={shareCurrent}>
            {copied ? "链接已复制 ✓" : "复制当前案例链接"}
          </button>
          <div className="highlight-tags" aria-label="设计亮点">
            {project.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
          <nav className="project-pagination" aria-label="案例切换">
            <a href={`#case-${previousProject.slug}`}>← {previousProject.title}</a>
            <a href={`#case-${nextProject.slug}`}>{nextProject.title} →</a>
          </nav>
        </div>
      </div>
    </article>
  );
}

function Lightbox({
  value,
  onChange,
  onClose,
}: {
  value: NonNullable<LightboxState>;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const { project, index } = value;
  const [zoom, setZoom] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const zoomViewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const total = project.images.length;

  const go = (next: number) => {
    setZoom(1);
    onChange((next + total) % total);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "Tab") {
        const controls = Array.from(
          document.querySelectorAll<HTMLButtonElement>(".lightbox button:not(:disabled)"),
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    const viewport = zoomViewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        left: Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2),
        top: Math.max(0, (viewport.scrollHeight - viewport.clientHeight) / 2),
        behavior: "auto",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [index, zoom]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}全屏作品浏览`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 55) go(index + (distance < 0 ? 1 : -1));
      }}
    >
      <header className="lightbox-bar">
        <div>
          <small>{project.en}</small>
          <b>{project.title}</b>
        </div>
        <div className="lightbox-tools">
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(1, current - 0.5))}
            disabled={zoom <= 1}
            aria-label="缩小图片"
          >
            −
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(3, current + 0.5))}
            disabled={zoom >= 3}
            aria-label="放大图片"
          >
            ＋
          </button>
          <button
            ref={closeRef}
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="关闭全屏浏览"
          >
            关闭 ×
          </button>
        </div>
      </header>

      <div
        ref={zoomViewportRef}
        className={`lightbox-image ${zoom > 1 ? "is-zoomed" : ""}`}
      >
        <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          <ResponsiveProjectImage
            project={project}
            image={project.images[index]}
            alt={`${project.title}全屏效果图 ${index + 1}`}
            eager
            sizes="96vw"
          />
        </div>
      </div>

      <button
        type="button"
        className="lightbox-arrow prev"
        onClick={() => go(index - 1)}
        aria-label="上一张大图"
      >
        ←
      </button>
      <button
        type="button"
        className="lightbox-arrow next"
        onClick={() => go(index + 1)}
        aria-label="下一张大图"
      >
        →
      </button>
      <footer className="lightbox-footer">
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <small>左右滑动或使用方向键切换 · ESC 退出</small>
      </footer>
    </div>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [portfolioCopied, setPortfolioCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reducedMotion.matches || saveData || window.innerWidth <= 800) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play().catch(() => setVideoPlaying(false));
    }
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches || reducedMotion.matches) return;
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty(
        "--mx",
        `${(event.clientX / window.innerWidth - 0.5) * 16}px`,
      );
      document.documentElement.style.setProperty(
        "--my",
        `${(event.clientY / window.innerHeight - 0.5) * 12}px`,
      );
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      const savedScroll = Number(window.sessionStorage.getItem("portfolio:scrollY"));
      if (Number.isFinite(savedScroll) && savedScroll > 0) {
        window.requestAnimationFrame(() => window.scrollTo({ top: savedScroll }));
      }
    }
    const rememberScroll = () => {
      window.sessionStorage.setItem("portfolio:scrollY", String(window.scrollY));
    };
    window.addEventListener("pagehide", rememberScroll);
    return () => window.removeEventListener("pagehide", rememberScroll);
  }, []);

  const openLightbox = (project: PortfolioProject, index: number) => {
    lightboxTrigger.current = document.activeElement as HTMLElement;
    window.history.replaceState(null, "", `#case-${project.slug}-${index + 1}`);
    setLightbox({ project, index });
  };

  const closeLightbox = () => {
    setLightbox(null);
    window.setTimeout(() => lightboxTrigger.current?.focus(), 0);
  };

  const toggleVideo = async () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) await videoRef.current.play();
    else videoRef.current.pause();
  };

  const copyPortfolioLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    await copyToClipboard(url);
    setPortfolioCopied(true);
    window.setTimeout(() => setPortfolioCopied(false), 1800);
  };

  return (
    <main>
      <a className="skip-link" href="#work">
        跳到作品
      </a>

      <header className="site-nav">
        <a className="brand" href="#top" aria-label="招财猫作品集首页">
          <b>招财猫</b>
          <small>LUCKY CAT DESIGN</small>
        </a>
        <nav aria-label="主要导航">
          <a href="#work">作品</a>
          <a href="#about">关于</a>
          <a href="#scope">服务范围</a>
        </nav>
        <small>PRIVATE PORTFOLIO / 2026</small>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-video"
            muted={videoMuted}
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.webp"
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
          >
            <source src="/hero-character.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-shade" />

        <div className="hero-copy">
          <p className="eyebrow">用设计赋能直播 · 让视觉留下记忆　✦</p>
          <h1 id="hero-title">
            直播间设计
            <br />
            视觉全案作品集
          </h1>
          <i className="signature">Zhaocaimiao</i>
          <p className="hero-intro">
            专注直播间视觉策略与场景打造
            <br />
            从空间到画面，完整呈现每一次设计落地
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#work">
              浏览精选案例　↓
            </a>
            <a className="secondary-button" href="#about">
              了解设计方法
            </a>
          </div>
          <div className="hero-stats" aria-label="项目数据">
            <span>
              <b>60+</b>直播间设计
            </span>
            <span>
              <b>18+</b>品牌合作
            </span>
            <span>
              <b>100+</b>项目落地
            </span>
            <span>
              <b>5年+</b>行业经验
            </span>
          </div>
        </div>

        <div className="case-shortcuts" aria-label="精选案例快捷入口">
          {projects.map((project) => (
            <a key={project.slug} href={`#case-${project.slug}`}>
              <small>{project.id}</small>
              <b>{project.title}</b>
              <span>{project.en}</span>
            </a>
          ))}
        </div>

        <div className="hero-process" aria-label="设计流程">
          <span>
            <i>◎</i>
            <b>视觉策略</b>
          </span>
          <em />
          <span>
            <i>◇</i>
            <b>空间设计</b>
          </span>
          <em />
          <span>
            <i>↗</i>
            <b>完整落地</b>
          </span>
        </div>

        <div className="video-controls" aria-label="首页视频控制">
          <button type="button" onClick={toggleVideo}>
            {videoPlaying ? "暂停" : "播放"}
          </button>
          <button
            type="button"
            onClick={() => setVideoMuted((current) => !current)}
          >
            {videoMuted ? "开启声音" : "静音"}
          </button>
          <span aria-live="polite">{videoPlaying ? "PLAYING" : "PAUSED"}</span>
        </div>
      </section>

      <section className="statement" id="about">
        <div>
          <small>DESIGN APPROACH</small>
          <p>
            不只装饰一个空间，
            <br />
            而是设计一场<span>让品牌被记住</span>的直播。
          </p>
        </div>
        <div className="statement-note">
          <p>
            从品牌特征、镜头关系到现场执行，视觉设计贯穿每一个观众能够感知的触点。
          </p>
          <dl>
            <div>
              <dt>策略</dt>
              <dd>先理解品牌与直播内容</dd>
            </div>
            <div>
              <dt>空间</dt>
              <dd>为镜头建立层次与焦点</dd>
            </div>
            <div>
              <dt>延展</dt>
              <dd>保持主图与物料一致</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <header className="section-head">
          <div>
            <small>SELECTED WORK</small>
            <h2 id="work-title">精选案例</h2>
          </div>
          <p>点击作品进入全屏，支持缩放、滑动与键盘浏览。</p>
        </header>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectSlider
              key={project.slug}
              project={project}
              projectIndex={index}
              onOpen={openLightbox}
            />
          ))}
        </div>
      </section>

      <section className="services" id="scope">
        <div>
          <small>SERVICE SCOPE</small>
          <h2>
            从直播间出发，
            <br />
            向每一个视觉触点延展。
          </h2>
        </div>
        <ol>
          <li>
            <b>01</b>
            <span>直播间视觉设计</span>
            <em>场景 / 贴片 / 氛围 / 导播视觉</em>
          </li>
          <li>
            <b>02</b>
            <span>电商主图设计</span>
            <em>产品主图 / 详情页 / 活动页</em>
          </li>
          <li>
            <b>03</b>
            <span>品牌物料延展</span>
            <em>KT板 / 海报 / 展架 / 包装</em>
          </li>
          <li>
            <b>04</b>
            <span>视觉策略与统筹</span>
            <em>风格定位 / 视觉规范 / 系统延展</em>
          </li>
        </ol>
      </section>

      <footer className="portfolio-footer">
        <small>END OF SELECTED WORK</small>
        <h2>
          感谢观看
          <br />
          <span>THANK YOU.</span>
        </h2>
        <div className="footer-actions">
          <a href="#top">返回顶部 ↑</a>
          <button type="button" onClick={copyPortfolioLink}>
            {portfolioCopied ? "作品集链接已复制 ✓" : "复制作品集链接"}
          </button>
        </div>
        <div className="footer-meta">
          <span>招财猫视觉设计</span>
          <span>PRIVATE PORTFOLIO · PLEASE DO NOT REDISTRIBUTE</span>
          <span>© 2026</span>
        </div>
      </footer>

      <p className="sr-only" aria-live="polite">
        {portfolioCopied ? "作品集链接已复制" : ""}
      </p>

      {lightbox ? (
        <Lightbox
          value={lightbox}
          onChange={(index) => setLightbox({ ...lightbox, index })}
          onClose={closeLightbox}
        />
      ) : null}
    </main>
  );
}