import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MathMagician's School",
  description: "IBA Simplified",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
