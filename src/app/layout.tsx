import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/Navigation";
import WebGLBackground from "@/components/WebGLBackground";

// Display serif for hero titles
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Clean grotesque for body
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Romain Laurent | Frontend Developer",
  description: "Portfolio of Romain Laurent, Frontend Developer specializing in GSAP and creative development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerifDisplay.variable} ${inter.variable} antialiased bg-neutral-dark-base text-neutral-light-lighter noise-bg min-h-screen`}
        style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
        {/* WebGL background fixed at root — persists through all modals/overlays */}
        <WebGLBackground />
        <SmoothScroll>
          <Preloader />
          <CustomCursor />
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
