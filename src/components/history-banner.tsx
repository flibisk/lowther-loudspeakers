import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HistoryBanner() {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/History-banner.jpg"
          alt="Lowther History - From the 1930s to the 2020s, nearly 90 years of sound excellence"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-lg text-white">
            {/* Small line and tagline */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-px bg-white mr-3"></div>
              <span className="text-sm tracking-wider uppercase text-white/80">OUR BRAND</span>
            </div>
            
            {/* Main Title */}
            <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6" style={{ color: '#c59862' }}>
              From the 1930s to the 2020s
            </h2>
            
            {/* Description */}
            <p className="hidden 930:block text-lg leading-relaxed mb-8">
              For nearly 90 years, Lowther has been dedicated to the art of sound, developing a range of speaker cabinets and cultivating a passionate community of DIY enthusiasts. Our commitment to handmade excellence means that every speaker is crafted in Great Britain, using techniques honed over decades.
            </p>
            
            {/* Call to Action Button */}
            <Link href="/history">
              <Button 
                variant="white" 
                size="lowther"
              >
                OUR HISTORY
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
