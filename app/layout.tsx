import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValetOS — Digital Valet Infrastructure",
  description: "QR-powered valet parking, real-time tracking, and vehicle management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg0 text-fg1 relative " suppressHydrationWarning >

        {/* Global Fixed Grain Overlay scaling to whole website */}
        <div className="pointer-events-none absolute inset-0 z-40 h-full w-full [filter:url('/noise.svg#grainyNoise')] opacity-60" aria-hidden="true" />

        {/* Desktop Blocker Screen */}
        <div className="hidden lg:flex fixed inset-0 z-[10000] bg-bg1 text-bg0 flex-col items-center justify-center p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Please switch to a mobile or tablet device</h1>
          <p className="text-lg">ValetOS is optimized for smaller screens. To view this website, please open it on a mobile phone or tablet.</p>
        </div>

        {/* App Content */}
        <div className="lg:hidden flex-1 flex flex-col w-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}
