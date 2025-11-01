"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VideoHeroProps {
  title: string;
  subtitle: string;
  description: string;
  videoSrc: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function VideoHero({
  title,
  subtitle,
  description,
  videoSrc,
  primaryCta,
  secondaryCta,
  className = "",
}: VideoHeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
      return () => video.removeEventListener('loadeddata', () => setIsVideoLoaded(true));
    }
  }, []);

  return (
    <section className={`relative h-screen overflow-hidden ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Loading placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 animate-pulse" />
              <p className="text-white/80">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-8 text-white/90">
              {subtitle}
            </h2>
            <p className="text-lg md:text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryCta && (
                <Button size="lg" asChild className="bg-white text-black hover:bg-white/90">
                  <Link href={primaryCta.href}>
                    {primaryCta.text}
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-black">
                  <Link href={secondaryCta.href}>
                    {secondaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
