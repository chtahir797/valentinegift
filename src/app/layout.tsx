import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Valentine Surprise",
  description: "A beautiful Valentine proposal experience",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

import AppGuardian from "../components/AppGuardian";
import DeviceDetector from "./components/DeviceDetector";
import GiftNavigation from "./components/GiftNavigation";
import GiftNavbar from "./components/GiftNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DeviceDetector>
        <AppGuardian>
            <GiftNavbar />
          {children}
            <GiftNavigation />
        </AppGuardian>
        </DeviceDetector>
      </body>
    </html>
  );
}