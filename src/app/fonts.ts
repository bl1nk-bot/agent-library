import { Inter, JetBrains_Mono, Sarabun } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  display: "swap",
  variable: "--font-sarabun",
  weight: ["300", "400", "500", "600", "700"],
});
