import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import AmbientBackground from "./components/AmbientBackground";

export const metadata: Metadata = {
  title: "ValetOS — Digital Valet Infrastructure",
  description:
    "QR-powered valet parking, real-time tracking, and vehicle management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col bg-bg0 text-fg1 relative"
        suppressHydrationWarning
      >
        {/* Ambient floating blobs behind everything */}
        <AmbientBackground />

        {/* Global grain overlay — subtle paper texture */}
        <div
          className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.03] mix-blend-overlay"
          style={{ filter: "url('/noise.svg#grainyNoise')" }}
          aria-hidden="true"
        />

        {/* Desktop Blocker Screen */}
        <div className="hidden lg:flex fixed inset-0 z-[10000] bg-band text-bg1 flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Please switch to a mobile or tablet device
          </h1>
          <p className="text-lg">
            ValetOS is optimized for smaller screens. To view this website,
            please open it on a mobile phone or tablet.
          </p>
        </div>

        {/* App Content wrapped in Lenis smooth scroll */}
        <SmoothScrollProvider>
          <div className="lg:hidden flex-1 flex flex-col w-full relative">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
