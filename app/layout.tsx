import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Sans_Bengali,
  Noto_Sans_Gujarati,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoGujarati = Noto_Sans_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VidUp — One click. Viral ready.",
  description:
    "VidUp analyzes your competitors and generates your complete pre-production pack — 3 titles, 1 hook script, and 3 thumbnail ideas — in seconds. Built for YouTube creators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    inter.variable,
    notoDevanagari.variable,
    notoBengali.variable,
    notoGujarati.variable,
    notoTamil.variable,
    notoTelugu.variable,
    notoKannada.variable,
    notoMalayalam.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
