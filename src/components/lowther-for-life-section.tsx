'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '@/components/scroll-reveal';
import { X, Play } from 'lucide-react';

interface Episode {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  loopVideo?: string;
}

const episodes: Episode[] = [
  {
    id: 1,
    title: 'Episode 1',
    thumbnail: '/videos/Lowther for life episode 1.jpeg',
    videoUrl: 'https://www.youtube.com/embed/wtgehrsJi0I',
    loopVideo: '/videos/loop-Lowther for life ep1.mp4'
  },
  {
    id: 2,
    title: 'Episode 2',
    thumbnail: '/videos/Lowther for life episode 2.jpeg',
    videoUrl: 'https://www.youtube.com/embed/8zPOLnG-IFs'
  },
  {
    id: 3,
    title: 'Episode 3',
    thumbnail: '/videos/Lowther for life episode 3.webp',
    videoUrl: 'https://www.youtube.com/embed/ZiUOxCMU3A4'
  }
];

interface LowtherForLifeSectionProps {
  backgroundColor?: string;
}

export function LowtherForLifeSection({ backgroundColor = 'bg-white' }: LowtherForLifeSectionProps = {}) {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [hoveredEpisode, setHoveredEpisode] = useState<number | null>(null);

  const openVideo = (episode: Episode) => {
    setSelectedEpisode(episode);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setSelectedEpisode(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section data-surface="light" className={`py-24 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-[#c59862] mb-4">
                Lowther for Life
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the stories, craftsmanship, and passion behind Lowther through our video series.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {episodes.map((episode, index) => (
              <ScrollReveal key={episode.id} animation="scale" delay={index * 100}>
                <div
                  className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer bg-black"
                  onClick={() => openVideo(episode)}
                  onMouseEnter={() => setHoveredEpisode(episode.id)}
                  onMouseLeave={() => setHoveredEpisode(null)}
                >
                  {/* Loop video for episodes that have it */}
                  {episode.loopVideo && hoveredEpisode === episode.id ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    >
                      <source src={episode.loopVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={episode.thumbnail}
                      alt={episode.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-[#c59862] transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                      <Play className="w-8 h-8 text-black group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Episode title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-semibold text-lg">{episode.title}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Video Overlay */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-6xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`${selectedEpisode.videoUrl}?autoplay=1`}
              title={selectedEpisode.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

