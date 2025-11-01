"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section data-surface="light" className="min-h-screen w-full bg-white flex items-center">
      <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-6">
          <span className="text-sm tracking-wider uppercase text-neutral-500 block">Page not found (404)</span>
        </div>

        {/* Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl aspect-[4/3]">
            <Image
              src="/images/404-image-lowther.jpg"
              alt="404 not found artwork for Lowther Loudspeakers"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variant="white" size="lowther" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="black" size="lowther" asChild>
            <Link href="/catalogue">Explore Catalogue</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


