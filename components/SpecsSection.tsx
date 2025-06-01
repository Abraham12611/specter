"use client"

import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AccordionItem {
  title: string;
  content: string[];
  isOpen: boolean;
}

const SpecsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([
    {
      title: "Dimensions",
      content: [
        "Overall Length: 4 650 mm",
        "Overall Width: 2 050 mm",
        "Overall Height: 1 150 mm",
        "Wheelbase: 2 700 mm",
        "Front Track: 1 650 mm / Rear Track: 1 640 mm"
      ],
      isOpen: true
    },
    {
      title: "Performance",
      content: [
        "0–100 km/h: 2.4 s",
        "Top Speed: 420 km/h",
        "Max Power: 1 100 bhp",
        "Max Torque: 1 350 Nm",
        "Drivetrain: AWD with torque-vectoring"
      ],
      isOpen: false
    },
    {
      title: "Chassis",
      content: [
        "Monocoque space-frame: carbon fiber & aluminum",
        "Suspension (F/R): push-rod double wishbone",
        "Dampers: adjustable twin-chamber coil-overs",
        "Steering: electric rack-and-pinion"
      ],
      isOpen: false
    },
    {
      title: "Brakes",
      content: [
        "Front: 410 mm carbon-ceramic discs, 6-piston calipers",
        "Rear: 390 mm carbon-ceramic discs, 4-piston calipers",
        "ABS: multi-level track-mode tuning",
        "Brake Cooling: inboard ducts + heat-extract vents"
      ],
      isOpen: false
    },
    {
      title: "Electrical System",
      content: [
        "Battery: 12 V Li-FePO₄ auxiliary",
        "Lighting: full LED with DRL signature",
        'Infotainment: 12" touch display, wireless CarPlay & Android Auto',
        "Ports: dual USB-C, 12 V socket"
      ],
      isOpen: false
    }
  ]);

  const toggleAccordion = (index: number) => {
    setAccordionItems(prev => prev.map((item, i) => ({
      ...item,
      isOpen: i === index ? !item.isOpen : false
    })));
  };

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: true,
      });

      // Animate elements on scroll
      gsap.from(".specs-header", {
        scrollTrigger: {
          trigger: ".specs-header",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(".specs-body", {
        scrollTrigger: {
          trigger: ".specs-body",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
      });

      gsap.from(".specs-graphic", {
        scrollTrigger: {
          trigger: ".specs-graphic",
          start: "top 80%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out"
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs-section"
      className="relative w-full min-h-screen bg-[#2A343D] py-20 px-10"
      style={{
        backgroundImage: 'url("/assets/half-car-photo-sketch.png")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6 relative">
        {/* Text Content */}
        <div className="col-span-4 specs-header">
          <h2 className="text-[24px] font-bold uppercase text-[#F6F7F8] mb-6">
            Specifications
          </h2>
          <p className="text-[16px] text-[#C0C5D1] leading-relaxed mb-8 specs-body">
            Experience the pinnacle of automotive engineering with the Specter SV.
            Every detail has been meticulously crafted to deliver unparalleled performance
            and driving dynamics.
          </p>
          <button className="cta-button px-8 py-3 text-[14px] font-bold uppercase text-[#F6F7F8] border-2 border-[#B8FF35] hover:bg-[#B8FF35] hover:text-[#0B0C0D] transition-all duration-150 hover:scale-105">
            Build Your Specter
          </button>
        </div>

        {/* Accordion */}
        <div className="col-span-4 col-start-8">
          {accordionItems.map((item, index) => (
            <div key={item.title} className="mb-4">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-4 px-6 bg-transparent border-b border-[#3A444D] accordion-title"
              >
                <span className="text-[18px] font-medium text-[#F6F7F8]">
                  {item.title}
                </span>
                {item.isOpen ? (
                  <ChevronDown className="w-5 h-5 text-[#B8FF35]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#B8FF35]" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  item.isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="py-4 px-6 bg-[#23282F] rounded-b-lg">
                  {item.content.map((line, i) => {
                    const [before, after] = line.split(/:(.+)/); // split at first colon
                    return (
                      <p key={i} className="text-[15px] mb-2 last:mb-0">
                        <span className="font-semibold text-[#B8FF35]">{before}{after !== undefined && ':'}</span>
                        {after !== undefined && (
                          <span className="text-[#C0C5D1]">{after}</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;