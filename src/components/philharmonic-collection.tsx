import Image from "next/image";
import Link from "next/link";
import driveUnitsDatabase from "@/lib/data/drive-units-database.json";

export function PhilharmonicCollection() {
  // Get Philharmonic collection data
  const philharmonicCollection = driveUnitsDatabase.data.find(
    item => item.type === "collection" && item.id === "philharmonic-collection"
  );

  // Get Philharmonic instruments
  const philharmonicInstruments = driveUnitsDatabase.data.filter(
    item => item.type === "instrument" && item.collection === "philharmonic-collection"
  );

  // Map instruments to their display data
  const instruments = [
    {
      id: "field-coil",
      title: "The Field Coil",
      description: "Our most dynamic and responsive drive unit ever built",
      image: "/images/drive-units/philharmonic-collection/gallery/Field Coil - Store Section.png",
      href: "/drive-units/fieldcoil-philharmonic"
    },
    {
      id: "pm4a",
      title: "The PM4A", 
      description: "Unrivalled scale and detail - for absolute musical immersion",
      image: "/images/drive-units/philharmonic-collection/gallery/PM4A - Store Section.png",
      href: "/drive-units/pm4a-philharmonic"
    },
    {
      id: "pm7a",
      title: "The PM7A",
      description: "Natural, articulate, and profoundly emotional", 
      image: "/images/drive-units/philharmonic-collection/gallery/PM7A Store Section.png",
      href: "/drive-units/pm7a-philharmonic"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8">
              <h2 className="font-display text-4xl lg:text-5xl mb-6" style={{ color: '#c59862' }}>
                {philharmonicCollection?.title}
              </h2>
          <p className="text-black text-lg max-w-2xl mx-auto">
            At the core of every Lowther beats a heart of our legendary drive units.
          </p>
        </div>

        {/* Drive Unit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {instruments.map((instrument) => (
            <Link key={instrument.id} href="/collection/philharmonic" className="text-center group block">
              {/* Drive Unit Image */}
              <div className="mb-1 flex justify-center">
                <div className="relative max-w-sm w-full aspect-[4/3] transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={instrument.image}
                    alt={`${instrument.title} drive unit - Premium Lowther ${instrument.title} from Philharmonic Collection`}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Drive Unit Info */}
              <div className="space-y-3">
                <h3 className="text-[#c59862] text-2xl group-hover:text-[#b0874f] transition-colors duration-300">
                  {instrument.title}
                </h3>
                
                {/* Separator Line */}
                <div className="w-12 h-px bg-gray-300 mx-auto"></div>
                
                <p className="text-black text-base leading-relaxed">
                  {instrument.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/products" 
            className="text-black hover:text-[#c59862] transition-colors font-medium tracking-wider uppercase text-sm underline-animated"
          >
            EXPLORE ALL OUR COLLECTIONS
          </Link>
        </div>
      </div>
    </section>
  );
}
