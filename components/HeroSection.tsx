"use client"

import Image from 'next/image';
import { Link } from "@heroui/link";
import { TwitterIcon, YouTubeIcon, InstagramIcon } from "@/components/icons";
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

// Register GSAP plugins
gsap.registerPlugin(SplitText, Flip);

const HUD_STATS = [
  { label: "Max Power", value: "1 100 bhp" },
  { label: "0-100 km/h", value: "2.4 s" },
  { label: "Top Speed", value: "420 km/h" },
  { label: "Weight", value: "1 190 kg" },
];

const HeroSection = () => {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const elementsRef = useRef<{
    logo: HTMLDivElement | null;
    headline: HTMLHeadingElement | null;
    subline: HTMLParagraphElement | null;
    cta: HTMLAnchorElement | null;
    hudStats: HTMLDivElement | null;
  }>({
    logo: null,
    headline: null,
    subline: null,
    cta: null,
    hudStats: null
  });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error("Error playing video:", error);
        setShowVideo(false);
        startStaggerReveal();
      });

      const handleVideoEnd = () => {
        setShowVideo(false);
        startStaggerReveal();
      };

      video.addEventListener('ended', handleVideoEnd);
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  const startStaggerReveal = () => {
    // Split text animations
    if (headlineRef.current) {
      const splitHeadline = new SplitText(headlineRef.current, { type: "chars,words" });
      const chars = splitHeadline.chars;

      gsap.fromTo(chars,
        {
          opacity: 0,
          y: 50,
          rotationX: -90,
          transformOrigin: "0% 50% -50",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.02,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Add hover effect after reveal
            chars.forEach(char => {
              const originalColor = char.style.color || "#F6F7F8";

              char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                  y: -10,
                  scale: 1.2,
                  color: "#B8FF35",
                  duration: 0.3,
                  ease: "power2.out"
                });
              });

              char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                  y: 0,
                  scale: 1,
                  color: originalColor,
                  duration: 0.3,
                  ease: "power2.out"
                });
              });
            });
          }
        }
      );
    }

    if (sublineRef.current) {
      const splitSubline = new SplitText(sublineRef.current, { type: "chars,words" });
      const chars = splitSubline.chars;

      gsap.fromTo(chars,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.01,
          ease: "power2.out",
          delay: 0.5,
          onComplete: () => {
            // Add hover effect after reveal
            chars.forEach(char => {
              const originalColor = char.style.color || "#6A737C";

              char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                  y: -5,
                  scale: 1.1,
                  color: "#B8FF35",
                  duration: 0.2,
                  ease: "power2.out"
                });
              });

              char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                  y: 0,
                  scale: 1,
                  color: originalColor,
                  duration: 0.2,
                  ease: "power2.out"
                });
              });
            });
          }
        }
      );
    }

    // Animate other elements
    const elements = [
      elementsRef.current.logo,
      elementsRef.current.cta,
      elementsRef.current.hudStats
    ].filter(Boolean);

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 50,
        visibility: 'hidden'
      },
      {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        duration: 0.6,
        stagger: 0.3,
        ease: 'cubic-bezier(0.33, 1, 0.68, 1)',
        onStart: () => {
          elements.forEach(el => {
            if (el) {
              el.style.visibility = 'visible';
              el.setAttribute('aria-hidden', 'false');
            }
          });
        },
        onComplete: () => {
          // Animate HUD Stats with creative effects
          if (elementsRef.current.hudStats) {
            const stats = elementsRef.current.hudStats.querySelectorAll('div');
            stats.forEach((stat, index) => {
              const value = stat.querySelector('span:first-child');
              const label = stat.querySelector('span:last-child');

              // Initial state
              gsap.set([value, label], {
                opacity: 0,
                y: 20,
                rotationX: -90,
                transformOrigin: "50% 50% -50"
              });

              // Animate in with stagger
              gsap.to([value, label], {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: index * 0.2,
                ease: "back.out(1.7)",
                onComplete: () => {
                  // Add hover effects
                  stat.addEventListener('mouseenter', () => {
                    gsap.to(stat, {
                      scale: 1.05,
                      x: -10,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                    gsap.to(value, {
                      color: "#B8FF35",
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  });

                  stat.addEventListener('mouseleave', () => {
                    gsap.to(stat, {
                      scale: 1,
                      x: 0,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                    gsap.to(value, {
                      color: "#F6F7F8",
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  });
                }
              });
            });
          }
        }
      }
    );
  };

  return (
    <section
      id="hero-section"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Video/Image */}
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            opacity: 0.85,
            objectPosition: 'center 65%'
          }}
          playsInline
          muted
        >
          <source src="/lv_0_20250527183347.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/spectre-sv.png"
          alt="Specter SV Silhouette"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
          style={{
            objectPosition: 'center 65%',
            opacity: 0.85,
          }}
        />
      )}

      {/* Vignette Blend Layer */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      ></div>

      {/* Content Container */}
      <div ref={contentRef} className="relative z-20 container mx-auto h-full grid grid-cols-12 gap-20">
        {/* Logo */}
        <div
          ref={(el) => { elementsRef.current.logo = el }}
          className="col-span-2 fixed top-8 left-8 z-50"
          style={{ visibility: 'hidden' }}
          aria-hidden="true"
        >
        </div>

        {/* Stage (Copy Block) */}
        <div className="col-span-8 flex flex-col justify-end pb-16">
          {/* Copy Block */}
          <div className="mb-8">
            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-primary text-9xl font-black leading-none tracking-[-1px] relative cursor-default"
              style={{ visibility: showVideo ? 'hidden' : 'visible' }}
            >
              SPECTER
              <span className="relative inline-block">
                SV
                <span className="absolute bottom-0 left-0 w-full h-5 bg-[#B8FF35] rounded-sm z-[-1]"></span>
              </span>
            </h1>
            {/* Subline */}
            <p
              ref={sublineRef}
              className="text-[#6A737C] text-xl font-medium mt-2 max-w-sm cursor-default"
              style={{ visibility: showVideo ? 'hidden' : 'visible' }}
            >
              The shadow that outruns light.
            </p>
          </div>

          {/* CTA */}
          <Link
            ref={(el) => { elementsRef.current.cta = el }}
            href="#"
            className="w-52 h-14 border border-[#B8FF35] text-primary font-bold text-sm uppercase flex items-center justify-center rounded-full transition-all duration-150 hover:bg-[#B8FF35] hover:text-[#0B0C0D] hover:scale-105"
            style={{ visibility: 'hidden' }}
            aria-hidden="true"
          >
            ENTER SHOWROOM
          </Link>
        </div>

        {/* Social Icons */}
        <div className="col-span-2 relative">
          <div className="fixed top-8 right-8 flex flex-col space-y-7 z-50">
            {["Twitter", "YouTube", "Instagram"].map((iconName) => (
              <div key={iconName} className="text-primary text-2xl opacity-60 hover:opacity-100 transition-all duration-150 transform hover:scale-110">
                {iconName === 'Twitter' && <TwitterIcon size={24} />}
                {iconName === 'YouTube' && <YouTubeIcon size={24} />}
                {iconName === 'Instagram' && <InstagramIcon size={24} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUD Stats Panel */}
      <div
        ref={(el) => { elementsRef.current.hudStats = el }}
        className="absolute -right-7 top-1/2 transform -translate-y-1/2 mt-10 p-6 rounded-xl flex flex-col space-y-7 z-40"
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
      >
        {HUD_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-primary text-4xl font-bold">{stat.value}</span>
            <span className="text-[#6A737C] text-base font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;