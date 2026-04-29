import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ozan Gezen Blog | Anlama ve Anlamlandırma",
  description: "Anlama ve anlamlandırma üzerine bir blog.",
  keywords: ["blog", "finans", "ekonomi", "piyasalar", "yatırım"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ozan Gezen",
  },
};

export const viewport: Viewport = {
  themeColor: "#355E3B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
