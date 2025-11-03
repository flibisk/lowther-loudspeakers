import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateSpeakerCardAltText } from "@/lib/utils/alt-text-generator";

interface SpeakerCardProps {
  id: string;
  title: string;
  feeling: string;
  image: string;
  href: string;
}

export function SpeakerCard({ id, title, feeling, image, href }: SpeakerCardProps) {
  return (
    <div className="group">
      {/* Speaker Card with Image Background and Gradient Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={generateSpeakerCardAltText(title, feeling)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <h3 className="text-[#c59862] text-2xl mb-2">
            {title}
          </h3>
          <p className="text-white text-lg mb-6">
            {feeling}
          </p>
          <Button 
            variant="white" 
            size="lowther"
            asChild
          >
            <Link href={href}>
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
