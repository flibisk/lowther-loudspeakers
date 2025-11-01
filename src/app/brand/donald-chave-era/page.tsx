'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function DonaldChaveEraPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/donald-chave-era/hero/speaker-making-frame.avif"
          alt="Donald Chave Era"
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
            Donald Chave Era
          </h1>
          
          <p className="text-xl leading-relaxed">
            Carrying Voigt's Vision Forward
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'Donald Chave Era' }
        ]}
      />

      {/* Content Section - Medium Style */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-2xl leading-relaxed text-gray-900 font-light mb-16">
                When Paul Voigt left England in 1950, Lowther could easily have faded into obscurity. Instead, it entered a new chapter. Donald Chave, who had already been working closely with Voigt and Peter Lowther since the 1930s, stepped in to take the reins. At precisely the moment the company needed direction, Chave provided it.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Under his leadership, Lowther was not only preserved — it was transformed. Chave modernised Voigt's concepts with permanent magnets, expanded the range of drive units, designed new enclosures, and carried Lowther's reputation across the Atlantic. His work ensured that Lowther did not remain a brief pre-war experiment, but became a lasting name in high-fidelity sound.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Early Fascination with Sound
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Chave's story begins in unlikely surroundings. Born in 1908 into a family of naval tailors, his path toward audio was entirely self-made. As a teenager in the late 1920s he developed a passion for radio, building his first loudspeaker from plans by theorist Dr. N.W. McLachlan. He even installed this homemade system in a local cinema, an early sign of his drive to bridge theory with practical sound reproduction.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                By the early 1930s, Chave was selling radio parts when he met entrepreneur O.P. (Peter) Lowther. Together they began producing gramophones. Lowther, seeking a loudspeaker worthy of his luxury systems, introduced Chave to Paul Voigt. In 1934 the three men's work converged in the Lowther-Voigt Radiogram, combining Lowther's electronics with Voigt's horn loudspeakers. Chave, now Voigt's protégé, became chief engineer at Lowther.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                From Field Coil to Permanent Magnet
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In the mid-1930s, Voigt's Domestic Corner Horn had already set a new standard in home listening. Its drivers relied on heavy field-coil electromagnets to generate their flux. By 1938, Chave was working with Voigt to replace these with compact permanent magnets — a revolution waiting to happen.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                World War II paused civilian hi‑fi development, but the seeds had been planted. After the war, Voigt, disillusioned and facing prejudice for his German ancestry, decided to emigrate to Canada in 1950. Before leaving, he sold his shares in Lowther to Chave with a handshake. With that, the stewardship of Lowther passed into Chave's hands.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Chave's greatest technical legacy was the PM series — the Permanent Magnet drivers. Their development was a joint story. Voigt had already pioneered the twin-cone diaphragm and frame assembly, which became the heart of the PM units. But it was Chave who solved the magnet problem.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Voigt's experimental post-war driver used an open frame with a central Ticonal magnet slug. Chave instead designed an external shell magnet structure, a configuration that produced high flux density with better mechanical stability and became the basis of all production Lowther PM drivers.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Thus, the PM-2 of 1949–50 was both Voigt's and Chave's work: Voigt for the diaphragm and acoustic theory, Chave for the magnet system that made permanent-magnet Lowthers practical.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                A Rift with the Master
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Yet this triumph came at a cost. Voigt, who had been developing his own permanent-magnet concepts, felt sidelined when Chave forged ahead independently after his emigration. A rift grew between mentor and protégé. Through the 1950s, enthusiasts often debated whether a Lowther was truly a "Voigt" design.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                In time, however, Voigt himself conceded Chave's importance: "Mr. Chave is responsible for the transition from the Voigt excited-field [coil] to the Lowther PM. His work has merit, and it would not be proper for me to accept all of the credit."
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Radical Experiments: The Hegeman Collaboration
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Chave was not only a custodian; he was a risk-taker. In 1950 he teamed up with American engineer Stewart Hegeman to create the Lowther-Hegeman Reproducer — a vast folded horn with plaster-of-Paris internals, designed around the new PM4 driver. Standing four feet high, it was a system of breathtaking ambition, but also breathtaking cost — three times the price of a standard Lowther. Fewer than thirty were ever built.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Though commercially short-lived, the Reproducer demonstrated Chave's willingness to push boundaries, to test just how far the single-driver horn principle could be taken.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Broadening the Lowther World
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Through the 1950s and 60s, Chave broadened Lowther's scope. He introduced smaller, more accessible drivers such as the PM-6, which became a favourite of hobbyists. Recognising the need for an entry-level option, Chave later created the PM6C — a ceramic-magnet version of the PM6A. While he was clear it did not reach the refinement of the Alnico PM6A, it offered outstanding performance at lower cost, making the Lowther sound available to a wider audience.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Chave also developed 5-inch versions of some Lowther drive units. These compact drivers found a strong following among hobbyists for their adaptability in smaller cabinet designs. More significantly, they established Lowther as an OEM supplier, with manufacturers such as Tommy Horning continuing to use these 5-inch units in their own high-end loudspeakers to this day.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                At the same time, Chave refined cabinet design himself, producing the Acousta series of back-loaded horns. These gave Lowther's single drivers more bass extension without compromising their immediacy.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                An Ambassador for British Hi‑Fi
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Chave was more than an engineer; he was a passionate evangelist for Lowther. In the 1950s he travelled to the United States, forging connections with figures like David Hafler and Victor Brociner. In one encounter, Hafler remarked on the need for a new power tube. On his next visit, Chave introduced him to the freshly developed KT88, helping to launch what became a legendary valve.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                This ability to link industries — loudspeakers, amplifiers, and tubes — showed Chave's holistic view of hi‑fi. He was an ambassador not only for Lowther, but for British audio itself.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Character and Final Years
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Unlike Voigt, Chave rarely published under his own name. He worked behind the Lowther brand, letting the products speak for themselves. Those who met him recall a gentle, enthusiastic man. Audio historian Bruce Edgar, visiting him in 1982, described him as "a delightful old English gentleman" who had "lost none of his youthful enthusiasm for loudspeaker design".
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Chave remained active in Lowther until the very end. He died suddenly in 1984, while attending a hi‑fi show in Frankfurt — fittingly, in the midst of the world he had helped shape.
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                The Keeper of the Flame
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                If Voigt was the godfather of high fidelity, Chave was its keeper. He ensured that Voigt's principles — the full-range driver, the horn, the pursuit of coherence and immediacy — were not lost in the post-war tide of multi-way systems and brute-force amplification. He modernised them, spread them across the world, and gave them permanence.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-12">
                In the story of Lowther, Paul Voigt lit the torch. Donald Chave carried it for nearly forty years.
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

