"use client"

import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  "/gallery/img1.png",
  "/gallery/img2.png",
  "/gallery/img-3.png",
  "/gallery/img-4.png",
  "/gallery/img5.png",
  "/gallery/img6.png",
  "/gallery/img7.png"
];

const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  useLayoutEffect(() => {
    if (!sectionRef.current || !carouselRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate the total width of the carousel
      const totalWidth = carouselRef.current!.scrollWidth - carouselRef.current!.offsetWidth;

      // Create the main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / 7,
            duration: 0.3,
            ease: "power1.inOut"
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.floor(progress * 7);
            if (newIndex !== activeImage) {
              setActiveImage(newIndex);
            }
          }
        }
      });

      // Animate the carousel
      tl.to(carouselRef.current, {
        x: -totalWidth,
        ease: "none"
      });

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery-section"
      className="relative w-full h-screen bg-[#0B0C0D] overflow-hidden"
    >
      {/* Big Screen Display */}
      <div className="absolute inset-0 w-full h-full z-0">
        {GALLERY_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              index === activeImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: index === activeImage ? 'scale(1)' : 'scale(0.95)',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)'
            }}
          >
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              quality={100}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Carousel Rail */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-[120px] z-10">
        <div
          ref={carouselRef}
          className="flex gap-4 h-full"
        >
          {GALLERY_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`relative flex-shrink-0 w-[calc(100%/7)] h-full border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                index === activeImage
                  ? 'border-[#B8FF35] scale-105'
                  : 'border-[#2A343D]'
              }`}
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              <Image
                src={src}
                alt={`Gallery thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;