import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI ScanFood — Intelligent Food Calorie Analyzer",
  description:
    "AI-powered food recognition and calorie estimation. Upload a photo of your meal and get instant nutritional analysis.",
  keywords: [
    "AI food analyzer",
    "calorie counter",
    "food recognition",
    "nutrition tracker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}