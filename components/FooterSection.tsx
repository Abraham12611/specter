"use client";

import Image from 'next/image';

const FooterSection = () => (
  <footer className="w-full bg-[#101214] border-t border-[#23282F] px-0 py-0 mt-24">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between min-h-[220px] md:h-[340px]">
      {/* Left: Minimalistic Copy */}
      <div className="flex-1 flex flex-col justify-center items-start text-[#C0C5D1] text-[16px] font-medium px-8 py-10 md:py-0 md:pl-12 md:pr-0">
        <span className="mb-2 text-lg font-semibold text-[#F6F7F8] tracking-wide">© 2024 Specter SV</span>
        <span className="italic text-[#B8FF35] text-base mb-1">Crafted for the extraordinary.</span>
        <span className="text-xs text-[#7A848E]">All rights reserved.</span>
      </div>
      {/* Right: Car Image */}
      <div className="flex-1 relative flex items-stretch">
        <div className="relative w-full h-full">
          <Image
            src="/specter-back.png"
            alt="Specter SV Backshot"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-l-xl md:rounded-l-xl md:rounded-r-none border-l-4 border-[#23282F]"
            priority
          />
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;