import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./blog-styles.css";
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
    default: "TableSift | AI Table Extractor & Image to Excel Converter",
    template: "%s | TableSift"
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  description: "Stop manual data entry. The automated data entry tool that converts PDFs, Screenshots, and Images to structured Excel files in 30 seconds.",
  keywords: [
    // Core conversion terms
    "pdf to excel converter",
    "extract tables from pdf",
    "ai table extractor",
    "image to excel ai",
    "convert pdf table to csv",
    "screenshot to excel",
    "ocr table extraction",
    // Profession-specific (high intent)
    "bank statement to excel",
    "invoice pdf to spreadsheet",
    "scanned document to excel",
    "gst invoice extractor",
    "financial report to excel",
    // India-specific
    "tally export to excel",
    "itr pdf data extraction",
    "ca document converter",
    // Workflow terms
    "bulk pdf processing",
    "automated data entry tool",
    "document automation software"
  ],
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0LXS80XCDV"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0LXS80XCDV');
            `,
          }}
        />
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
