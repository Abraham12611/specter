"use client"

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const TECH_SPECS = [
  {
    title: "Dry Weight",
    copy: "Forged from T700 carbon-weave panels and titanium fixings, Specter SV tips the scales at a gravity-defying **1 190 kg** (curb). 65 / 35 weight bias locks the chassis to corners like Velcro.",
    image: "/tech/dry-weight.png"
  },
  {
    title: "Engine",
    copy: "4.0-litre quad-turbo V8 with 180-degree flat-plane crank. Ceramic ball-bearing turbos spool in 0.18 s, breathing through active titanium ducts – red-line **9 200 rpm**.",
    image: "/tech/engine.png"
  },
  {
    title: "Power",
    copy: "Calibrated in Track Mode the power unit delivers **1 100 bhp** on E85 blend, sustained by 850-bar piezo injection and dual 350 kW axial-flux e-boosters.",
    image: "/tech/power.png"
  },
  {
    title: "Torque",
    copy: "Instantaneous **1 350 Nm** combined at 1 500 rpm. Vector-split driveshafts meter force to each wheel every 2 ms for zero-slip launch.",
    image: "/tech/torque.png"
  },
  {
    title: "Chassis",
    copy: "Monocoque in aerospace-grade autoclaved carbon, 38-layer lay-up with Kevlar crash cones. Torsional rigidity **56 000 Nm/°** while weighing under 86 kg bare.",
    image: "/tech/chassis.png"
  },
  {
    title: "Wheels",
    copy: "One-piece forged-magnesium cores cloaked in carbon barrels, centre-lock. Unsprung mass savings of **–7.4 kg per corner** sharpen every input.",
    image: "/tech/wheels.png"
  }
];

const TechSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for card animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 7}`, // 7 viewport heights for 6 cards + extra
          pin: true,
          scrub: 1,
          snap: {
            snapTo: "labels",
            duration: 0.4,
            ease: "power1.inOut"
          }
        }
      });

      // Animate each card
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        // Add labels for snapping
        tl.addLabel(`card${i}-start`)
          .from(card, {
            x: '-100%',
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          })
          .addLabel(`card${i}-visible`)
          .to(card, {
            x: '100%',
            opacity: 0,
            duration: 0.5,
            ease: 'expo.inOut'
          }, '+=0.5');
      });

      // GSAP animations for the header
      if (headerRef.current) {
        // Split the header text
        const split = new SplitText(headerRef.current, { type: 'chars,words' });

        // Intro animation for the header text
        gsap.from(split.chars, {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power1.out',
        });

        // Hover effect for the header text
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

        // Clean up event listeners
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
      <div className="absolute top-8 left-8 z-10">
        <h2 
          ref={headerRef} 
          className="text-6xl md:text-7xl font-black uppercase tracking-tight leading-none"
          style={{
            background: 'linear-gradient(180deg, #E2E6EA 0%, #B8FF35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(184, 255, 53, 0.3)'
          }}
        >
          <span>Advanced</span>{" "}<span>Engineering</span>
        </h2>
      </div>

      {/* Tech Spec Cards */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        {TECH_SPECS.map((spec, index) => (
          <div
            key={spec.title}
            ref={el => cardRefs.current[index] = el}
            className="absolute w-[65vw] max-w-[960px] aspect-[4/3] p-8 rounded-xl bg-white/[0.05] backdrop-blur-[12px] -webkit-backdrop-blur-[12px] transform-gpu"
            style={{
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform, opacity',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)'
            }}
          >
            <div className="h-full flex flex-col">
              <h3 className="text-[48px] font-black uppercase tracking-tight mb-6">{spec.title}</h3>
              <div className="relative flex-grow mb-6">
                <Image
                  src={spec.image}
                  alt={spec.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
              <p className="text-[#E2E6EA] text-lg leading-[160%]">{spec.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechSection;