import React from "react";

interface BannerProps {
  title?: React.ReactNode;
  subtitle?: string;
  description?: string;
  imageSrc?: string | null;
  imageAlt?: string;
  bgColor?: string;
  yellowShapeColor?: string;
  whiteShapeColor?: string;
  className?: string;
  hideImage?: boolean;
}

export default function Banner({
  title = (
    <>
      Knowledge Meets <br className="hidden sm:block" /> Innovation
    </>
  ),
  subtitle = "KNOWLEDGEPULSE",
  description =
    "This platform's simplicity belies its powerful capabilities, offering a seamless and enjoyable educational experience.",
  imageSrc = "/boyholdingbook.png",
  imageAlt = "Student",
  bgColor = "var(--color-primary-dark)",
  yellowShapeColor = "var(--color-accent)",
  whiteShapeColor = "var(--color-background)",
  className = "",
  hideImage = false,
}: BannerProps) {
  return (
    <section
      className={`w-full rounded-2xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 min-h-[320px] relative overflow-hidden ${className}`}
      style={{ background: bgColor }}
    >
      {/* Left Content */}
      <div className={`flex-1 z-10 ${hideImage ? '' : 'sm:pr-8'}`}>
        <div className="mb-2">
          <span className="tracking-[0.3em] text-xs font-semibold text-[var(--color-surface)] opacity-80">
            {subtitle}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-surface)] mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-[var(--color-surface)]/80 mb-8 max-w-md">{description}</p>
      </div>
      {/* Right Image & Shapes (or just shapes if hideImage) */}
      <div className="flex-1 flex items-end justify-end relative min-w-[220px] min-h-[220px] h-full z-10">
        {hideImage ? (
          <>
            {/* Top-left quarter circle */}
            <div
              className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 rounded-br-full z-10"
              style={{ background: whiteShapeColor }}
            />
            {/* Bottom-right cone/triangle */}
            <div
              className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 z-0"
              style={{
                background: yellowShapeColor,
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)"
              }}
            />
          </>
        ) : (
          <>
            {/* Yellow semi-circle behind image */}
            <div
              className="absolute bottom-0 right-6 sm:right-10 w-60 h-32 sm:w-80 sm:h-40 rounded-t-full z-0"
              style={{ background: yellowShapeColor }}
            />
            {/* White quarter-circle top right */}
            <div
              className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-bl-full z-0"
              style={{ background: whiteShapeColor }}
            />
            {/* Student/Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="relative z-20 w-56 h-56 sm:w-72 sm:h-72 object-cover rounded"
                style={{ background: "transparent" }}
              />
            )}
          </>
        )}
      </div>
      {/* Background shape for the whole banner */}
      <div
        className="absolute inset-0 rounded-2xl opacity-90 z-0"
        style={{ background: bgColor }}
      />
    </section>
  );
}
