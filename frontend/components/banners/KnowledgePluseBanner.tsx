import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function KnowledgeBanner() {
  return (
    <section className="w-full mt-10 bg-[#0B3C3C] rounded-2xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 min-h-[320px] relative overflow-hidden" style={{background: '#0B3C3C'}}>
      {/* Left Content */}
      <div className="flex-1 z-10">
        <div className="mb-2">
          <span className="tracking-[0.3em] text-xs font-semibold text-white opacity-80">KNOWLEDGEPULSE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Knowledge Meets <br className="hidden sm:block" /> Innovation
        </h1>
        <p className="text-white/80 mb-8 max-w-md">
          This platform's simplicity belies its powerful capabilities, offering a seamless and enjoyable educational experience.
        </p>
      </div>
      {/* Right Image & Shapes */}
      <div className="flex-1 flex items-end justify-end relative min-w-[220px] min-h-[220px] h-full z-10">
        {/* Yellow semi-circle behind image */}
        <div className="absolute bottom-0 right-6 sm:right-10 w-60 h-32 sm:w-80 sm:h-40 bg-[#F8E71C] rounded-t-full z-0" style={{}} />
        {/* White quarter-circle top right */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-[#E6F4F1] rounded-bl-full z-0" />
        {/* Student Image */}
        <img
          src="/boyholdingbook.png"
          alt="Student"
          className="relative z-20 w-56 h-56 sm:w-72 sm:h-72 object-cover rounded"
          style={{background: 'transparent'}}
        />
      </div>
      {/* Background shape for the whole banner */}
      <div className="absolute inset-0 bg-[#0B3C3C] rounded-2xl opacity-90 z-0" />
    </section>
  );
}
