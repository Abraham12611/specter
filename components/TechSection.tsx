"use client"

import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const TECH_SPECS = [
  {
    title: "Dry Weight",
    copy: "Forged from T700 carbon-weave panels and titanium fixings, Specter SV tips the scales at a gravity-defying 1 190 kg (curb). 65 / 35 weight bias locks the chassis to corners like Velcro.",
    image: "/tech/dry-weight.png"
  },
  {
    title: "Engine",
    copy: "4.0-litre quad-turbo V8 with 180-degree flat-plane crank. Ceramic ball-bearing turbos spool in 0.18 s, breathing through active titanium ducts – red-line 9 200 rpm.",
    image: "/tech/engine.png"
  },
  {
    title: "Power",
    copy: "Calibrated in Track Mode the power unit delivers 1 100 bhp on E85 blend, sustained by 850-bar piezo injection and dual 350 kW axial-flux e-boosters.",
    image: "/tech/power.png"
  },
  {
    title: "Torque",
    copy: "Instantaneous 1 350 Nm combined at 1 500 rpm. Vector-split driveshafts meter force to each wheel every 2 ms for zero-slip launch.",
    image: "/tech/torque.png"
  },
  {
    title: "Chassis",
    copy: "Monocoque in aerospace-grade autoclaved carbon, 38-layer lay-up with Kevlar crash cones. Torsional rigidity 56 000 Nm/° while weighing under 86 kg bare.",
    image: "/tech/chassis.png"
  },
  {
    title: "Wheels",
    copy: "One-piece forged-magnesium cores cloaked in carbon barrels, centre-lock. Unsprung mass savings of –7.4 kg per corner sharpen every input.",
    image: "/tech/wheels.png"
  }
];

const TechSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll animation for the cards
      if (containerRef.current) {
        const numCards = TECH_SPECS.length;
        const cardWidth = containerRef.current.offsetWidth / numCards;
        gsap.to(containerRef.current, {
          x: () => `-${containerRef.current!.scrollWidth - window.innerWidth}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            horizontal: false, // vertical scroll triggers horizontal movement
          },
        });
      }

      // GSAP animations for the header
      if (headerRef.current) {
        const split = new SplitText(headerRef.current, { type: 'chars,words' });
        gsap.from(split.chars, {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power1.out',
        });
        const handleMouseEnter = () => {
          gsap.to(split.words, {
            color: '#B8FF35',
            textShadow: '0 0 10px rgba(184, 255, 53, 0.5)',
            duration: 0.3,
            stagger: 0.05,
            overwrite: true,
          });
        };
        const handleMouseLeave = () => {
          gsap.to(split.words, {
            color: '#E2E6EA',
            textShadow: 'none',
            duration: 0.3,
            stagger: 0.05,
            overwrite: true,
          });
        };
        headerRef.current.addEventListener('mouseenter', handleMouseEnter);
        headerRef.current.addEventListener('mouseleave', handleMouseLeave);
        return () => {
          headerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
          headerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
      // Cleanup ScrollTrigger
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tech-section"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Modal for full image */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-3xl w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={modalImage}
              alt="Tech Spec Full"
              fill
              style={{ objectFit: 'contain', borderRadius: '1.5rem' }}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
      {/* Background Image Container */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/specter-neon-sv-bg-.png"
          alt="Specter SV Background"
          fill
          quality={100}
          className="object-cover"
          style={{
            objectPosition: 'center 65%',
            opacity: 0.85
          }}
        />
      </div>

      {/* Section Header */}
      <div className="absolute top-8 left-8 z-50">
        <h2
          ref={headerRef}
          className="text-6xl md:text-7xl font-black uppercase tracking-tight leading-none bg-gradient-to-b from-white via-[#B8FF35] to-[#B8FF35] bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(184,255,53,0.5)]"
          style={{
            position: 'relative',
            WebkitTextStroke: '1px #B8FF35',
            filter: 'drop-shadow(0 2px 30px rgba(184,255,53,0.2))',
          }}
        >
          <span>Advanced</span>{" "}<span>Engineering</span>
        </h2>
      </div>

      {/* Tech Spec Cards Horizontal Carousel */}
      <div
        ref={containerRef}
        className="relative z-20 h-full flex items-center"
        style={{
          width: `calc(${TECH_SPECS.length} * 60vw)`,
          minWidth: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {TECH_SPECS.map((spec, index) => (
          <div
            key={spec.title}
            className="mx-8 flex-shrink-0 flex-grow-0 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-[16px] hover:scale-105 hover:shadow-[0_8px_40px_0_rgba(184,255,53,0.25)] hover:border-[#B8FF35] transition-all duration-300 ease-[cubic-bezier(.4,2,.6,1)] group transform-gpu"
            style={{
              width: '60vw',
              maxWidth: '700px',
              height: '70vh',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              boxShadow: '0 4px 32px 0 rgba(184,255,53,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.18)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Left: Text */}
            <div className="flex flex-col justify-center p-8 w-1/2">
              <h3 className="text-[2.5rem] font-black uppercase tracking-tight mb-4 bg-gradient-to-r from-[#B8FF35] via-white to-[#B8FF35] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#B8FF35] transition-colors duration-300">
                {spec.title}
              </h3>
              <p className="text-[#E2E6EA] text-lg leading-[160%] drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
                {spec.copy}
              </p>
            </div>
            {/* Right: Image */}
            <div className="relative w-1/2 h-full flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => setModalImage(spec.image)}
            >
              <Image
                src={spec.image}
                alt={spec.title}
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '0 1.5rem 1.5rem 0',
                  boxShadow: '0 0 32px 0 rgba(184,255,53,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.18)',
                  transition: 'transform 0.4s cubic-bezier(.4,2,.6,1)',
                }}
                className="rounded-lg group-hover:scale-110"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-[#B8FF35]/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechSection;