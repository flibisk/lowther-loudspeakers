'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function OurCraftPage() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/our-craft/hero/Lowther-Speaker-Making-hero.jpg"
          alt="The Lowther Handmade Craft"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <p className="font-sarabun text-sm tracking-[3px] uppercase">Brand</p>
          </div>
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            The Lowther Handmade Craft
          </h1>
          <p className="text-xl leading-relaxed">
            A legacy of Hifi engineering in every speaker.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'Our Craft' }
        ]}
      />

      {/* Content Section - Medium Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <h2 className="font-display text-5xl leading-tight mb-16 text-center" style={{ color: '#c59862' }}>
                Where Art Meets Engineering
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                For nearly a century, Lowther has cultivated rare skills that transform raw materials into musical instruments.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In our Norfolk workshop, surrounded by the rolling English countryside, every cabinet, cone and coil is shaped by hand.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Each creation reflects the values that have guided us since 1934: purity, precision and a deep respect for natural sound.
              </p>

              {/* Where Art Meets Engineering Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Where Art Meets Engineering.jpg"
                  alt="Where Art Meets Engineering"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Lowther loudspeakers are not products of automation. They are works of human artistry, refined through time and experience.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Like a violin or a fine timepiece, a Lowther is built to endure, to improve with age, and to be cherished for generations.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Philosophy of Craft
              </h2>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Every Lowther begins as an idea rooted in the geometry of sound.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Paul Voigt's original tractrix horn equations, conceived almost a century ago, still define our approach today.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                We do not chase novelty. We pursue truth. Each instrument is designed to reveal music as it was intended to be heard, with nothing added and nothing taken away.
              </p>

              {/* Philosophy of Craft Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Philosophy of Craft.jpg"
                  alt="Philosophy of Craft"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Our craftsmen build with an intimacy that machines cannot match. The slight variations of hand shaping, sanding and fitting bring life and individuality to each piece.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                This is not manufacturing. It is interpretation, an understanding between the craftsman and the material that results in something truly unique.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Cabinetry
              </h2>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The creation of a Lowther cabinet begins with exact mathematical drawings, followed by hundreds of hours of precision work.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Each horn follows Voigt's acoustic principles, guiding sound waves through carefully calculated curves that preserve musical integrity.
              </p>

              {/* Cabinetry Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Cabinetry.jpg"
                  alt="Cabinetry"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                We use only the finest Baltic Birch plywood, selected for grain, strength and tone. The bending of wood is performed using the same methods found in violin making.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                It is steamed until pliable, then shaped slowly by hand, held in place until it cools and sets naturally. No shortcuts, no composites, only pure materials shaped with care.
              </p>

              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Veneering is treated as an art form. Our clients choose from a curated collection of rare woods such as rosewood, olive, walnut and zebrano, each book matched to form a continuous grain pattern.
                Traditional hide glue and multiple hand rubbed layers of lacquer create depth, warmth and a surface that matures beautifully with time.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Drive Units
              </h2>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                At the heart of every Lowther lies its voice coil, hand wound to tolerances measured in microns.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                This component defines the Lowther sound, fast, pure and uncoloured.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Our craftsmen wind each coil by hand, using copper, silver or gold alloy wire depending on the collection.
                No machine can replicate the precise tension and layering that gives each Lowther its unmistakable signature.
              </p>

              {/* Drive Units Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Drive Units.jpg"
                  alt="Drive Units"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Our paper cones are treated individually with a proprietary solution and dried in natural sunlight.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                This process produces a cone that moves with exceptional speed and delicacy, revealing textures in instruments and voices that other materials cannot reproduce.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Every coil is then centred by hand, aligning the magnetic gap with an accuracy that depends entirely on the craftsman's eye and touch.
              </p>

              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Each step is deliberate, each decision audible. That is why we can produce only a handful of drive units each day, and why every one carries the character of its maker.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Metalwork
              </h2>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Lowther metalwork is engineered to a standard more akin to precision watchmaking than to loudspeaker production.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Every part that shapes the magnetic circuit is machined from solid lead free steel or Alnico, chosen for its unique magnetic qualities and harmonic warmth.
              </p>

              {/* Metalwork Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Metalwork.jpg"
                  alt="Metalwork"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In our Philharmonic and Grand Opera collections, the metalwork reaches its most advanced form.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Components are polished and chromium finished to military standard, then assembled by hand to tolerances measured in microns.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                The result is not just visual beauty but functional perfection, improving efficiency, detail and tonal refinement across the entire frequency range.
              </p>

              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                For the Grand Opera Collection, we use aerospace grade Permendur and Magmax alloys, materials usually found in particle accelerators and nuclear applications.
                These allow our instruments to reach levels of clarity and realism unmatched in the world of high fidelity.
              </p>

              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Legacy of the Atelier
              </h2>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In an age of disposable technology, Lowther stands apart.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Our Norfolk atelier preserves crafts that have almost vanished from the modern world.
                Every instrument is built to order, numbered, and tested by ear as well as by measurement.
              </p>

              {/* Legacy of the Atelier Image */}
              <div className="relative w-[calc(100%+4rem)] -mx-8 mb-16 overflow-hidden rounded-lg" style={{ height: '600px' }}>
                <Image
                  src="/images/our-craft/gallery/Legacy of the Atelier.jpg"
                  alt="Legacy of the Atelier"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The people who create Lowther loudspeakers are not factory workers. They are artisans who understand that the smallest detail can shape the character of sound.
              </p>
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Their work ensures that each Lowther leaves our workshop not simply as a product, but as an heirloom, a fusion of British tradition, engineering excellence and musical soul.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </article>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}

