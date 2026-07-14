import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
  colorScheme: "light dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const host = rawHost.split(",")[0].trim();
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim()
    .toLowerCase();
  const isLocalHost =
    /^(localhost|127(?:\.\d{1,3}){3})(:\d+)?$/i.test(host) ||
    /^\[::1\](?::\d+)?$/i.test(host);
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : isLocalHost
        ? "http"
        : "https";
  const origin = `${protocol}://${host}`;
  const title = "招财猫｜直播间视觉设计作品集";
  const description = "精选直播间场景、主题活动与品牌视觉全案，呈现从视觉策略到空间落地的完整设计作品。";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    applicationName: "招财猫视觉设计作品集",
    referrer: "no-referrer",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: origin,
      siteName: "招财猫视觉设计",
      title,
      description,
      images: [
        {
          url: `${origin}/og.png`,
          width: 1200,
          height: 630,
          alt: "招财猫直播间视觉设计作品集",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
    other: {
      "format-detection": "telephone=no,email=no,address=no",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}