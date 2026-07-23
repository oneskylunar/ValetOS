"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "valetos.token";

export default function ExplorePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-bg0 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-bg1 mb-4">Explore</h1>
      <p className="text-text-secondary">This page is coming soon.</p>
      <button
        onClick={() => router.push("/home")}
        className="mt-6 px-6 py-2.5 text-sm font-bold text-bg0 bg-bg1 hover:bg-fg1 transition-colors rounded-full"
      >
        Back to Home
      </button>
    </main>
  );
}
