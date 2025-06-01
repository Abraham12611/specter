"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import { siteConfig } from "@/config/site";
import {
} from "@/components/icons";

const NAV_ITEMS = [
  { name: "Home", id: "hero-section" },
  { name: "Tech", id: "tech-section" },
  { name: "Gallery", id: "gallery-section" },
  { name: "Specs", id: "specs-section" },
  { name: "Purchase", id: "purchase-section" },
];

export const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLUListElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero-section");
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navbarRef.current || !navItemsRef.current || !logoRef.current) return;

    // Initial state
    gsap.set(navItemsRef.current.children, {
      opacity: 0,
      x: -50,
      rotationY: -90,
      transformOrigin: "left center"
    });

    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: -15
    });

    // Create timeline for navbar animation
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // Animate logo first
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    });

    // Then animate nav items with stagger
    tl.to(navItemsRef.current.children, {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Add hover effects to nav items
    const navItems = navItemsRef.current.children;
    Array.from(navItems).forEach((item) => {
      const link = item.querySelector('button');
      if (!link) return;

      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          x: 10,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
          gsap.to(link, {
            x: 0,
            opacity: 0.6,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });

    // Setup scroll triggers for each section with progress tracking
    const triggers = NAV_ITEMS.map(item => {
      return ScrollTrigger.create({
        trigger: `#${item.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setActiveSection(item.id);
          updateIndicator(item.id);
        },
        onEnterBack: () => {
          setActiveSection(item.id);
          updateIndicator(item.id);
        },
        onUpdate: (self) => {
          if (self.isActive) {
            const progress = self.progress;
            updateIndicatorProgress(item.id, progress);
          }
        }
      });
    });

    // Function to update indicator position and progress
    const updateIndicator = (sectionId: string) => {
      const activeItem = navItemsRef.current?.querySelector(`[data-section="${sectionId}"]`);
      if (activeItem && indicatorRef.current) {
        gsap.to(indicatorRef.current, {
          y: activeItem.offsetTop,
          height: activeItem.offsetHeight,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const updateIndicatorProgress = (sectionId: string, progress: number) => {
      const activeItem = navItemsRef.current?.querySelector(`[data-section="${sectionId}"]`);
      if (activeItem && indicatorRef.current) {
        gsap.to(indicatorRef.current, {
          height: activeItem.offsetHeight * (1 + progress * 0.2),
          duration: 0.1,
          ease: "none"
        });
      }
    };

    return () => {
      // Cleanup
      Array.from(navItems).forEach((item) => {
        const link = item.querySelector('button');
        if (link) {
          link.removeEventListener('mouseenter', () => {});
          link.removeEventListener('mouseleave', () => {});
        }
      });
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroUINavbar
      ref={navbarRef}
      className="fixed top-1/2 left-0 -translate-y-1/2 h-screen w-64 bg-transparent flex flex-col justify-center items-start p-6"
      isBlurred={false}
    >
      <NavbarContent
        className="flex flex-col items-start justify-center space-y-8 h-full"
      >
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <Image
              src="/seraphix_emblem.png"
              alt="Seraphix Glyph"
              width={56}
              height={56}
            />
          </Link>
        </NavbarBrand>

        <div className="relative w-full">
          {/* Indicator */}
          <div
            ref={indicatorRef}
            className="absolute left-0 w-1 bg-[#B8FF35] rounded-full transition-all duration-300"
            style={{
              boxShadow: '0 0 8px rgba(184, 255, 53, 0.5)',
              filter: 'blur(0.5px)'
            }}
          />

          <ul ref={navItemsRef} className="flex flex-col space-y-4 items-start w-full mt-[-5%]">
            {NAV_ITEMS.map((item) => (
              <NavbarItem key={item.name} className="w-full">
                <button
                  onClick={() => scrollToSection(item.id)}
                  data-section={item.id}
                  className={`relative group w-full text-left ${
                    activeSection === item.id ? 'active' : ''
                  }`}
                >
                  <span className={`text-foreground block transition-all duration-300 ${
                    activeSection === item.id ? 'opacity-100' : 'opacity-60'
                  }`}>
                    {item.name}
                  </span>
                </button>
              </NavbarItem>
            ))}
          </ul>
        </div>
      </NavbarContent>
    </HeroUINavbar>
  );
};
