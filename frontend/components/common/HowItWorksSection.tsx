import React from "react";
import { Button } from "../ui/button";

const steps = [
  {
    title: "Create your profile",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
    illustration: (
      <div className="w-full h-36 flex items-center justify-center mb-4">
        <img src="/maponmobile.webp" alt="Create profile on mobile" className="h-32 w-auto rounded-xl object-contain" />
      </div>
    ),
  },
  {
    title: "Search Courses",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
    illustration: (
      <div className="w-full h-36 flex items-center justify-center mb-4">
        <img src="/searching.webp" alt="Searching courses" className="h-32 w-auto rounded-xl object-contain" />
      </div>
    ),
  },
  {
    title: "Make a Connection",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
    illustration: (
      <div className="w-full h-36 flex items-center justify-center mb-4">
        <img src="/peoplemakingconnection.webp" alt="People making connection" className="h-32 w-auto rounded-xl object-contain" />
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 text-[var(--color-primary-dark)]">
          How KnowledgePulse <span className="inline-block relative">works
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 120 12" fill="none"><path d="M0 10 Q60 0 120 10" stroke="var(--color-primary-dark)" strokeWidth="2" fill="none"/></svg>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-2xl border border-[var(--color-primary-light)] shadow-md p-8 transition hover:shadow-xl">
              {step.illustration}
              <h3 className="text-xl font-semibold text-[var(--color-primary-dark)] mb-2 text-center">{step.title}</h3>
              <p className="text-sm text-center text-[var(--color-primary-light)] mb-6">{step.description}</p>
              <Button>Get Started</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 