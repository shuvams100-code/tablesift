import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "./json-ld";

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tablesift.com'),
  title: {
    default: "TableSift.com | AI Screenshot to Excel Converter",
    template: "%s | TableSift"
  },
  description: "The world&apos;s most advanced AI tool to convert screenshots, PDFs, and images into clean Excel & CSV files instantly. 99.9% accuracy with structure retention.",
  keywords: ["screenshot to excel", "image to csv", "pdf to excel ai", "table extraction", "ocr table", "tablesift"],
  authors: [{ name: "TableSift AI" }],
  creator: "TableSift AI",
  publisher: "TableSift AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tablesift.com",
    title: "TableSift | Turn Screenshots into Excel Instantly",
    description: "Stop typing data manually. Use AI to extract perfect tables from any image or PDF in seconds.",
    siteName: "TableSift.com",
    images: [
      {
        url: '/og-image.png', // We'll need to create this placeholder or user can upload
        width: 1200,
        height: 630,
        alt: 'TableSift AI Extraction Demo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TableSift | AI Screenshot to Excel",
    description: "The fastest way to convert images to spreadsheets. 99% accuracy.",
    creator: "@TableSift",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Premium Fonts: Satoshi (body) + Clash Display (headlines) */}
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
