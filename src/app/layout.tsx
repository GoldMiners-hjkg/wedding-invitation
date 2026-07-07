import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { WeChatBridgeScript } from "@/components/WeChatBridgeScript";

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are cordially invited to celebrate with us.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B8CADC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <head>
        <WeChatBridgeScript />
        <link
          rel="preload"
          href="/fonts/genryu/GenRyuMin-TW-R.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/genryu/GenRyuMin-TW-M.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
