import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { translate, DEFAULT_LANGUAGE } from "@/i18n";
import { StoreHydrator } from "@/store/hydration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: translate(DEFAULT_LANGUAGE, "app.title"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
