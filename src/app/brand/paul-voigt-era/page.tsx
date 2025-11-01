'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function PaulVoigtEraPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/paul-voigt-era/hero/Paul-Voigt-with-Ida-1954-hero.jpg"
          alt="Paul Voigt Era"
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
            <span className="text-sm tracking-wider uppercase text-white/80">LOWTHER HERITAGE</span>
          </div>
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Paul Voigt
          </h1>
          
          <p className="text-xl leading-relaxed">
            The Godfather of High Fidelity
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'Paul Voigt Era' }
        ]}
      />

      {/* Content Section - Medium Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-2xl leading-relaxed text-gray-900 font-light mb-16">
                The story of Lowther, and in many ways the story of hi‑fi itself, begins with Paul Gustavus Alexander Helm Voigt. Born in 1901, Voigt was educated at Dulwich College and later University College, London, where he earned his degree in electrical engineering in 1922. Even as a student he was restless with ideas. His very first article, published in Wireless World in 1920, described how a bright-emitter vacuum tube could be used in a reflex circuit to amplify both radio-frequency and audio signals — an innovation at a time when wireless itself was barely established.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Early Career at Edison Bell
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Upon graduation, Voigt joined J. E. Hough Ltd., better known as Edison Bell, a company producing gramophones and records. There he threw himself into the problem that would define his life: how to reproduce sound with the same clarity with which it was first broadcast or recorded. He believed that a recording groove should be engraved with the same precision as a radio carrier wave was modulated by the BBC.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                To achieve this, Voigt designed every link in the audio chain: microphones, cutters, transformers, amplifiers, pickups, and loudspeakers. By agreement with Edison Bell, the patents remained his — nineteen in total during his time there. Among them was British Patent 238,310 for a moving-coil loudspeaker. Though the filing date narrowly followed the work of Rice and Kellogg in the United States, Voigt's design stood on its own merits, marking him as one of the first true pioneers of high-efficiency moving-coil loudspeakers.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                It was at Edison Bell too that Voigt began shaping the geometry that would make him famous: the tractrix horn. Originally developed for cinema use, the tractrix profile allowed smooth wave propagation, minimising distortion and imparting a natural, open character to reproduced sound.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                The Voigt Horn
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Among Voigt's most ambitious experiments were his tractrix cinema horns. Some were so large they had to be suspended from ceilings with wires, their cavernous mouths looming over audiences, yet delivering clarity and scale unknown at the time.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                A surviving Edison Bell blueprint from 1929 captures one of these designs: a four-foot horn, complete with its mounting foot and suspension system. Its elegant flare embodies the tractrix principle, a geometry that became Voigt's hallmark.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Nearly a century later, Lowther has revisited this very idea. The modern Voigt horn is both a homage and a continuation, proving that his acoustic geometry remains as relevant today as when it first hung in cinemas. In bringing the design into the present, Lowther affirms its belief that the very best ideas in sound are timeless.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                The Domestic Corner Horn
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In the early 1930s, Voigt's work turned toward domestic listening. He designed what became his signature loudspeaker: the Voigt Domestic Corner Horn. By placing the horn mouth into the corner of a room, Voigt used the walls themselves as extensions of the horn flare, achieving powerful bass from a relatively compact cabinet. Combined with his field-coil moving-coil drivers, the Corner Horn was capable of dynamics and clarity unknown in home listening before.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                When entrepreneur O.P. Lowther sought a superior loudspeaker for his luxury radiograms, it was Voigt he turned to. The partnership, formalised in 1934 as Lowther-Voigt Radio, produced the Lowther-Voigt Radiogram — a combination of Lowther's electronics and Voigt's loudspeaker designs. This was the true genesis of the Lowther name in audio.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Philosophy of Sound
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Voigt's surviving writings and interview reflections reveal a man more concerned with fidelity than fashion. He described the ideal loudspeaker not as a producer of sound but as a "hole in the wall" through which one simply heard reality. Power and loudness were secondary; what mattered was accuracy, coherence, and naturalness.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                He also anticipated what later became the full-range, single-driver philosophy: that one diaphragm, properly designed and horn-loaded, could cover the musical spectrum without crossovers or multiple drivers interrupting the signal. His twin-cone diaphragm with "whizzer" extension remains a cornerstone of Lowther design.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Departure and Later Life
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                After the Second World War, Voigt found the atmosphere in Britain increasingly difficult. Prejudice against his German ancestry, coupled with health issues, pushed him to emigrate. In 1950 he moved to Canada, where he taught electronics and later worked for the Canadian government in radio regulation. Though largely absent from the commercial loudspeaker market thereafter, he continued to think deeply about acoustics and even broader physical problems such as gravity and electricity, which he referred to as "the riddles of the fundamentals."
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Recognition and Legacy
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Though modest and never one to "blow his own horn," Voigt was widely respected. He became one of the first Fellows of the British Kinematograph Society in 1946, honoured again in 1969 at the Royal Institution for placing Britain "at the top of the table in high quality sound stakes". In 1974 he was awarded Honorary Membership of the Audio Engineering Society.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Tributes poured in after his death in 1981. Paul W. Klipsch, another horn-speaker pioneer, wrote that he wished he had known Voigt longer, recognising him as a man who had understood the advantages of horns earlier than most. Peter Walker of Quad described him as one of the few who had truly lifted Britain to the forefront of world audio.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                The Father of High Fidelity
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Voigt's contribution was not simply technical; it was philosophical. He set the terms of what hi‑fi would become: accuracy over artifice, efficiency over brute force, and elegance of design over complexity. His tractrix horns and corner enclosures were precursors to much of modern acoustic engineering. His belief in the full-range driver defined Lowther's identity.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-12">
                When we listen to a Lowther today, we are not only hearing music. We are hearing Voigt's vision of truth in sound, carried forward for nearly a century.
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

