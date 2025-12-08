import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gitbee - AI Powered Github Moderator",
  description:
    "An AI Powered Github Moderator to help you manage your repositories efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
