export function HomepageFAQ() {
  return (
    <section aria-labelledby="faq-heading" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 id="faq-heading" className="font-display text-4xl lg:text-5xl mb-12 text-center" style={{ color: '#c59862' }}>
          Frequently asked questions
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              What is a Lowther Masterpiece?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Lowther Masterpieces are our handcrafted folded-horn loudspeakers, built to order in the veneers and style that suit your home.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              What makes horn loaded loudspeakers different?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Horn loaded designs use carefully shaped enclosures to control how sound leaves the driver, giving higher efficiency, scale, and realism from a single full-range unit.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Who are Lowther loudspeakers for?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              They are for listeners who value natural, lifelike reproduction and are willing to invest in carefully placed, handmade loudspeakers rather than mass-market systems.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Can I build my own Lowther speakers?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Yes. Our "Build your Lowther" plans and drive units are designed for home builders who want to create their own horn loaded loudspeakers using our designs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

