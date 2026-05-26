import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TESORO Couture — Salon haljina Beograd",
    template: "%s | TESORO Couture",
  },
  description:
    "Elegantne ženske haljine za svaku priliku. Vjenčane, koktel, svečane i maturske haljine. Rezervišite termin u našem salonu u Beogradu.",
  keywords: ["haljine", "salon haljina", "Beograd", "vjenčane haljine", "maturske haljine"],
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "TESORO Couture",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${cormorantGaramond.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf7f4]">
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
