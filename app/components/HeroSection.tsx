"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/app/lib/motion";

export default function HeroSection() {
  const router = useRouter();

  const goToScan = () => router.push("/home");

  return (
    <motion.section
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-8 bg-bg0 text-dark"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center mt-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight"
          variants={fadeUp}
        >
          Every Parking Spot.<br />Always Accounted For.
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-10 text-fg0 font-medium"
          variants={fadeUp}
        >
          Digitize valet parking with QR-powered tracking,<br className="hidden md:block" /> real-time visibility and secure vehicle retrieval.
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
          variants={fadeUp}
        >
          <button onClick={goToScan} className="w-full md:w-auto px-8 py-3.5 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 hover:text-bg0 transition-all shadow-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(18,35,36,0.3)] active:scale-[0.98] active:shadow-sm">
            Get Started
          </button>
          <a
            href="#why-valetos"
            className="w-full md:w-auto px-8 py-3.5 text-base font-bold text-bg1 bg-transparent border-2 border-bg1 hover:bg-bg1 hover:text-bg0 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(18,35,36,0.2)] active:scale-[0.98] active:shadow-sm"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
