"use client";

import React, { useState, useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden flex items-center justify-center">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />

      {/* Glowing orb that follows mouse */}
      <div
        className="fixed w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Interactive 404 Text */}
        <div className="mb-12 relative group cursor-default">
          <h1
            className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 select-none leading-none relative group-hover:animate-shake"
            style={{
              textShadow: "0 0 80px rgba(251, 191, 36, 0.4)",
              filter: "drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))",
            }}
          >
            {["4", "0", "4"].map((digit, index) => (
              <span
                key={index}
                className="inline-block"
                style={{
                  transformOrigin: "center",
                }}
              >
                {digit}
              </span>
            ))}
          </h1>

          {/* Animated underline */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent group-hover:w-3/4 transition-all duration-1000 ease-out" />

          {/* Enhanced floating particles around 404 */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-yellow-400 rounded-full opacity-60"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${5 + i * 3.5}%`,
                  top: `${10 + (i % 6) * 12}%`,
                  animation: `particle-float-${i % 4} ${2 + i * 0.2}s ease-in-out infinite, particle-fade ${4 + i * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Messages */}
        <div className="mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Oops!</h2>
          <p className="text-2xl md:text-3xl text-gray-300 font-light">
            The page not found
          </p>
          <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Maybe you can find something interesting in home page
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="group flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
