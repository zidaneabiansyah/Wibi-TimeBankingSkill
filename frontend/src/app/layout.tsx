import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth";
import { AdminProvider } from "@/components/auth/AdminProvider";
import AchievementPopup from "@/components/gamification/AchievementPopup";
import { PWAProvider } from "@/components/providers/pwa-provider";
import { MobileOptimization } from "@/components/mobile-optimization";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wibi - Waktu Indonesia Berbagi Ilmu",
  description: "Share skills, earn credits, grow together. A peer-to-peer time banking platform for students to exchange knowledge and services.",
  keywords: [
    "time banking",
    "skill exchange",
    "peer-to-peer learning",
    "education platform",
    "student community",
  ],
  authors: [{ name: "Wibi Team" }],
  creator: "Wibi",
  publisher: "Wibi",
  metadataBase: new URL("https://wibi.app"),
  alternates: {
    canonical: "https://wibi.app",
  },
  openGraph: {
    title: "Wibi - Waktu Indonesia Berbagi Ilmu",
    description: "Share skills, earn credits, grow together.",
    type: "website",
    locale: "en_US",
    siteName: "Wibi",
    images: [
      {
        url: "/wibi.png",
        width: 1200,
        height: 630,
        alt: "Wibi Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wibi - Waktu Indonesia Berbagi Ilmu",
    description: "Share skills, earn credits, grow together.",
    images: ["/wibi.png"],
    creator: "@wibiapp",
  },
  icons: {
    icon: "/wibi.png",
    shortcut: "/wibi.png",
    apple: "/wibi.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Wibi - Waktu Indonesia Berbagi Ilmu",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: "cover",
};

import { FramerProvider } from "@/components/providers/FramerProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MobileOptimization />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FramerProvider>
            <PWAProvider>
              <AdminProvider>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </AdminProvider>
              <AchievementPopup />
              <Sonner />
            </PWAProvider>
          </FramerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
