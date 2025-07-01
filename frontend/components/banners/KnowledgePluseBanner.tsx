import React from "react";

interface BannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

const KnowledgeBanner: React.FC<BannerProps> = ({
  title = "KNOWLEDGEPULSE",
  subtitle = "Knowledge Meets Innovation",
  description = "This platform's simplicity belies its powerful capabilities, offering a seamless and enjoyable educational experience.",
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-8 md:p-12 ${className}`}
      style={{
        background: "linear-gradient(135deg, var(--primary-800), var(--primary-600))"
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-8 right-8 w-24 h-24 rounded-full opacity-80" style={{ background: "var(--warning)" }}></div>
      <div className="absolute bottom-16 right-32 w-16 h-16 rounded-full opacity-60" style={{ background: "var(--primary-400)" }}></div>
      <div className="absolute top-20 right-48 w-8 h-8 rounded-full opacity-70" style={{ background: "var(--warning)" }}></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
        {/* Left content */}
        <div className="flex-1 mb-8 lg:mb-0 lg:pr-12" style={{ color: "var(--foreground)" }}>
          <div className="text-sm font-medium tracking-widest mb-4" style={{ color: "var(--warning)" }}>
            {title}
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight" style={{ color: "var(--foreground)" }}>
            {subtitle}
          </h1>

          <p className="text-lg lg:text-xl max-w-lg leading-relaxed" style={{ color: "var(--primary-700)" }}>
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="font-semibold px-6 py-3 rounded-lg transition-colors duration-200" style={{ background: "var(--warning)", color: "var(--primary)", border: "none" }}>
              Get Started
            </button>
            <button className="font-semibold px-6 py-3 rounded-lg transition-all duration-200 border-2" style={{ borderColor: "var(--warning)", color: "var(--warning)", background: "transparent" }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--warning)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--warning)'; }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right image section */}
        <div className="relative flex-shrink-0">
          {/* Large yellow circle background */}
          <div className="w-80 h-80 rounded-full relative" style={{ background: "var(--warning)" }}>
            {/* Student image placeholder */}
            <div className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary-400), var(--primary-600))" }}>
              {/* Simulated photo - person with books */}
              <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg, var(--primary-300), var(--primary-500), var(--primary-600))" }}>
                {/* Person silhouette */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 rounded-t-full" style={{ background: "linear-gradient(to top, var(--primary-100), var(--primary-300))" }}></div>

                {/* Head */}
                <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full" style={{ background: "linear-gradient(135deg, var(--primary-700), var(--primary-900))" }}></div>

                {/* Curly hair */}
                <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 w-20 h-12 rounded-t-full" style={{ background: "linear-gradient(135deg, var(--primary-900), var(--primary-100))" }}></div>
                <div className="absolute bottom-42 left-8 w-3 h-3 rounded-full" style={{ background: "var(--primary-900)" }}></div>
                <div className="absolute bottom-44 right-8 w-3 h-3 rounded-full" style={{ background: "var(--primary-900)" }}></div>
                <div className="absolute bottom-46 left-10 w-2 h-2 rounded-full" style={{ background: "var(--primary-900)" }}></div>
                <div className="absolute bottom-46 right-10 w-2 h-2 rounded-full" style={{ background: "var(--primary-900)" }}></div>

                {/* Books */}
                <div className="absolute bottom-8 right-16 w-8 h-12 rounded" style={{ background: "var(--secondary)" }}></div>
                <div className="absolute bottom-6 right-14 w-8 h-12 rounded" style={{ background: "var(--primary-400)" }}></div>
                <div className="absolute bottom-4 right-12 w-8 h-12 rounded" style={{ background: "var(--primary-500)" }}></div>

                {/* Backpack strap */}
                <div className="absolute bottom-20 left-12 w-3 h-16 rounded" style={{ background: "var(--primary-200)" }}></div>

                {/* Shirt details */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-20 rounded-t-lg" style={{ background: "var(--primary-600)" }}></div>
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded" style={{ background: "var(--background)" }}></div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div
            className="absolute -top-4 -left-4 w-12 h-12 rounded-full animate-bounce"
            style={{ background: "var(--warning)", animationDelay: "0s" }}
          ></div>
          <div
            className="absolute -bottom-8 -right-8 w-8 h-8 rounded-full animate-bounce"
            style={{ background: "var(--primary-400)", animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 -left-8 w-6 h-6 rounded-full animate-pulse" style={{ background: "var(--danger)" }}></div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50 rounded-b-2xl" style={{ background: "linear-gradient(90deg, var(--primary-800), var(--primary-600))" }}></div>
    </div>
  );
};

export default KnowledgeBanner;
