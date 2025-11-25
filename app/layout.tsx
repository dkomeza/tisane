import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/app/components/ThemeProvider";

import "@/styles/globals.css";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGH IT Future Day 2025 | Wydział Informatyki AGH",
  description:
    "Dołącz do AGH IT Future Day 26.03.2026. Prelekcje, warsztaty, networking i konkurs innowacji studenckich IT is ME. Odkryj przyszłość technologii z Wydziałem Informatyki AGH.",
  keywords: [
    "AGH IT Future Day",
    "Wydział Informatyki AGH",
    "IT is ME",
    "konkurs studencki",
    "innowacje",
    "AI",
    "Data Science",
    "Cyberbezpieczeństwo",
    "Cloud Computing",
    "IoT",
    "Quantum Computing",
    "Digital Health",
    "Green IT",
    "Kraków",
    "wydarzenie IT",
  ],
  openGraph: {
    title: "AGH IT Future Day 2025 | Wydział Informatyki AGH",
    description:
      "Wydarzenie łączące studentów, naukowców i biznes. Prelekcje, warsztaty i konkurs IT is ME. 26.03.2026, Kraków.",
    type: "website",
    locale: "pl_PL",
    siteName: "AGH IT Future Day",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGH IT Future Day 2025",
    description:
      "Dołącz do AGH IT Future Day 26.03.2026. Innowacje, kariera i przyszłość IT.",
  },
  icons: {
    icon: "/signet.svg",
    shortcut: "/signet.svg",
    apple: "/signet.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="z-10 relative">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
