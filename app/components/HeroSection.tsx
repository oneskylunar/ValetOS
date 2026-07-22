"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const goToLogin = () => router.push("/login");

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-8 bg-bg0 text-dark">
      <div className="max-w-2xl mx-auto flex flex-col items-center z-10 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
          Every Parking Spot.<br />Always Accounted For.
        </h1>
        <p className="text-lg md:text-xl mb-10 text-fg0 font-medium">
          Digitize valet parking with QR-powered tracking,<br className="hidden md:block" /> real-time visibility and secure vehicle retrieval.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <button
            onClick={goToLogin}
            className="w-full md:w-auto px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 hover:text-bg0 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Get Started
          </button>
          <button
            onClick={goToLogin}
            className="w-full md:w-auto px-8 py-3.5 text-base font-bold text-bg1 bg-transparent border-2 border-bg1 hover:bg-bg1 hover:text-bg0 transition-all hover:-translate-y-0.5"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
