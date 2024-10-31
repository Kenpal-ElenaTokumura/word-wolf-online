import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Wolf Online",
  description: "Play Word Wolf online with friends!",
  openGraph: {
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
