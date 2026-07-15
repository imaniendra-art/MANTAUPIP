import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MANTAU PIP DIKTI - Dashboard",
  description: "Manajemen, Administrasi, Nilai, Transparansi Anggaran, & Usulan PIP DIKTI STIMI YAPMI Makassar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full w-full flex flex-col text-foreground"
      >
        <div 
          className="fixed inset-0 -z-20 w-full h-full bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg_login.png')" }}
        />
        <div className="fixed inset-0 bg-white/10 -z-10 pointer-events-none" />
        <Providers>
          <div className="relative z-0 min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
