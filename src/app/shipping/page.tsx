import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/scroll-reveal';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Lowther Loudspeakers',
  description:
    'Learn about Lowther Loudspeakers’ worldwide shipping timelines, carriers, customs responsibilities, and return policy.',
  openGraph: {
    title: 'Shipping & Returns | Lowther Loudspeakers',
    description:
      'Discover how Lowther Loudspeakers fulfils worldwide orders, our delivery timelines, and how to arrange a return.',
  },
};

export default function ShippingAndReturnsPage() {
  return (
    <div className="bg-white text-neutral-900">
      <section data-surface="dark" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-[#c59862]/40 opacity-90" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <ScrollReveal animation="fade-up">
            <p className="text-sm uppercase tracking-[4px] text-white/70 mb-4">
              Delivering The Best Sound In The World
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">Shipping &amp; Returns</h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Everything we build is handcrafted in the United Kingdom. Here is how we fulfil and support orders for
              our customers around the globe.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section data-surface="light" className="py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 space-y-16">
          <ScrollReveal animation="fade-up">
            <article className="space-y-12 text-base leading-7 text-neutral-700">
              <section className="space-y-4">
                <h2 className="font-display text-2xl text-neutral-900">Shipping</h2>
                <p>
                  We typically ship within 5 days of placing your order for drive units; however, some orders may take up
                  to 10 days to process. Please note that we do not ship on Saturdays or Sundays.
                </p>
                <p>
                  All orders will arrive within 5 – 10 business days. We offer worldwide shipping, with the exception of
                  countries not serviced by DHL or Parcel Force. Every shipment is fully tracked via DHL or Parcel Force.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Lowther is not responsible for delays caused by customs clearance or taxation in overseas countries.
                  </li>
                  <li>Lowther is not responsible for lost packages due to an incorrect address supplied by the sender.</li>
                </ul>
                <p>
                  For more information or shipping enquiries, contact us at{' '}
                  <a href="mailto:hello@lowtherloudspeakers.com" className="text-[#c59862] underline underline-offset-4">
                    hello@lowtherloudspeakers.com
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl text-neutral-900">Returns</h2>
                <p>
                  Change of heart? No problem — we accept exchanges or refunds within 30 days after delivery, provided
                  your purchase is returned in saleable condition with all product packaging (boxes, bags, and
                  accessories).
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Ensure the item is safely wrapped in its cloth to avoid scratches during transit.</li>
                  <li>Any damage caused by negligence in the return process will be the customer’s responsibility.</li>
                  <li>
                    Goods will be refunded upon inspection on arrival (excluding the original delivery charge). Return
                    shipping charges are not refundable.
                  </li>
                  <li>
                    The item remains your responsibility until it reaches us. For your protection, we recommend using a
                    traceable delivery service.
                  </li>
                </ul>
                <p>
                  To determine the best return process, please contact us at{' '}
                  <a href="mailto:hello@lowtherloudspeakers.com" className="text-[#c59862] underline underline-offset-4">
                    hello@lowtherloudspeakers.com
                  </a>
                  .
                </p>
              </section>
            </article>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}


