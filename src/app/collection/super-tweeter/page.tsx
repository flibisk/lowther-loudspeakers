"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LowtherForLifeSection } from "@/components/lowther-for-life-section";
import { ProductActionButtons } from "@/components/product-action-buttons";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useShopifyCollection } from "@/hooks/use-shopify-collection";
import {
  findVariantByOptions,
  formatPrice,
  type ShopifyProduct,
  type ShopifyVariant,
} from "@/lib/shopify-storefront";

const superTweeterProduct = {
  id: "super-tweeter",
  handle: "lowther-super-tweeter",
  title: "Lowther Supertweeter",
  price: "£0.00",
  image: "/images/drive-units/super-tweeter/gallery/Super Tweeter - Product Image.jpg",
  description:
    "Completing the top octave with precision and intent, the Lowther Supertweeter extends the bandwidth of our full-range instruments without adding artificial edge or glare.",
  details: [
    "Designed to take over precisely where the eight-inch Lowther driver naturally rolls off, the Supertweeter restores the final octave of information that locks the stereo image in place.",
    "Available with DX or PM magnet structures to match the energy, speed, and scale of the partnering driver.",
  ],
};

const magnetOptions = ["DX", "PM"];

const galleryImages = [
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front.jpg",
    alt: "Front view of the Lowther Supertweeter in British Racing Green",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front black version.jpg",
    alt: "Lowther Supertweeter finished in black",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter PM.jpg",
    alt: "Lowther Supertweeter with PM magnet assembly",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back.jpg",
    alt: "Rear view of the Lowther Supertweeter",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back - cable.jpg",
    alt: "Detail of the Lowther Supertweeter connectivity",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter on Voigt Horn.jpg",
    alt: "Lowther Supertweeter mounted on a Voigt Horn loudspeaker",
  },
];

const craftsmanshipHighlights = [
  {
    title: "Hand-built integration",
    description:
      "Each Supertweeter is hand-assembled in Northampton to mirror the tone and responsiveness of the partnering Lowther driver. Every diaphragm is precision formed, matched and tested in pairs for phase-coherent extension.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front.jpg",
  },
  {
    title: "Magnet systems to match your instrument",
    description:
      "Choose between DX or PM magnet assemblies to complement the energy and voicing of your system. Both options are engineered to preserve transient speed while delivering effortless air.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter PM.jpg",
  },
  {
    title: "Discreet, purposeful design",
    description:
      "Housed in a compact enclosure with a broad dispersion waveguide, the Supertweeter can be positioned directly above or behind the main driver, maintaining visual subtlety while expanding spatial realism.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back.jpg",
  },
];

const detailHighlights = [
  {
    title: "Matching the character of our full range drivers",
    description:
      "Made from the same materials and formed with the same approach as the cone and whizzer in our eight-inch instruments. The Supertweeter avoids the usual disconnect of a bolt-on HF unit and instead sounds like an organic continuation of the driver itself.",
  },
  {
    title: "Hearing above ten kilohertz",
    description:
      "In listening sessions at our Northampton studio—even with listeners whose hearing measured a roll-off above 10 kHz—the Supertweeter delivered stronger imaging, more natural decay and a deeper sense of space. The ear may not hear the tone, yet the brain registers the cues.",
  },
];

const testimonials = [
  "“Once the Supertweeter was switched off the music lost height. I could not hear the tone but I could feel the difference.”",
  "“I thought my hearing had dropped above ten kilohertz. The Supertweeter still improved the space around vocals and instruments.”",
  "“It is not about hearing a higher note. It is about restoring the final cues that help you locate every sound in the room.”",
  "“With the Supertweeter engaged the stereo image locks in. Without it everything feels slightly flatter.”",
  "“I did not expect it to matter at my age. It does.”",
  "“The highs are subtle. The effect is not.”",
];

const introParagraphs = [
  "Every Lowther full-range instrument reaches remarkable heights on its own. Yet all eight-inch units experience a natural roll-off above ten kilohertz. Even when you cannot consciously hear those top harmonics, your brain responds to them. The result is a clearer image, stronger spatial cues and a greater sense of ease in the music.",
  "The Lowther Supertweeter is designed to continue exactly where the full range driver falls away. It adds nothing artificial. It simply restores the final part of the spectrum that completes the experience.",
];

export default function SuperTweeterPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const { productMap } = useShopifyCollection("super-tweeter");

  const [selectedProduct, setSelectedProduct] = useState<typeof superTweeterProduct | null>(null);
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedMagnet, setSelectedMagnet] = useState<string>(magnetOptions[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const getDisplayPrice = () => {
    const shopifyMatch = productMap.get(superTweeterProduct.handle);
    if (shopifyMatch) {
      return formatPrice(
        shopifyMatch.priceRange.minVariantPrice.amount,
        shopifyMatch.priceRange.minVariantPrice.currencyCode,
      );
    }
    return superTweeterProduct.price;
  };

  const openProductDetail = () => {
    setSelectedProduct(superTweeterProduct);
    setSelectedMagnet(magnetOptions[0]);
    setQuantity(1);
    const match = productMap.get(superTweeterProduct.handle) ?? null;
    setSelectedShopifyProduct(match);
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedShopifyProduct(null);
    }, 600);
  };

  useEffect(() => {
    if (selectedProduct) {
      const match = productMap.get(selectedProduct.handle) ?? null;
      setSelectedShopifyProduct(match);
    }
  }, [productMap, selectedProduct]);

  const magnetOptionName = useMemo(() => {
    const variants = selectedShopifyProduct?.variants ?? [];
    if (!variants.length) return "Magnet";

    const optionNames = new Set<string>();
    for (const variant of variants) {
      for (const option of variant.selectedOptions) {
        optionNames.add(option.name);
      }
    }

    if (!optionNames.size) {
      return "Magnet";
    }

    const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const magnetName =
      Array.from(optionNames).find((name) => normalize(name).includes("magnet")) ??
      Array.from(optionNames)[0];

    return magnetName ?? "Magnet";
  }, [selectedShopifyProduct]);

  const getCurrentVariant = (): ShopifyVariant | undefined => {
    if (!selectedShopifyProduct) return undefined;
    const options = {
      [magnetOptionName]: selectedMagnet,
    };
    return findVariantByOptions(selectedShopifyProduct.variants, options);
  };

  const getOverlayPrice = () => {
    const variant = getCurrentVariant();
    if (variant) {
      return formatPrice(variant.price.amount, variant.price.currencyCode);
    }
    if (selectedShopifyProduct) {
      return formatPrice(
        selectedShopifyProduct.priceRange.minVariantPrice.amount,
        selectedShopifyProduct.priceRange.minVariantPrice.currencyCode,
      );
    }
    return superTweeterProduct.price;
  };

  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (selectedShopifyProduct) {
      const variant = getCurrentVariant();
      if (!variant) {
        alert("Please select a magnet option");
        return;
      }
      if (!variant.availableForSale) {
        alert("This configuration is currently unavailable");
        return;
      }
      await addItem(variant.id, quantity);
      alert(`Added ${quantity}× ${selectedProduct.title} to your bag!`);
      closeProductDetail();
      return;
    }

    window.open(process.env.NEXT_PUBLIC_SHOP_URL ?? "https://shop.lowtherloudspeakers.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/super-tweeter/hero/supertweeter-hero.jpg"
          alt="The Lowther Supertweeter"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">DRIVE UNITS</span>
          </div>

          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: "#c59862" }}>
            The Lowther Supertweeter
          </h1>

          <p className="text-xl leading-relaxed">
            Completing the top octave with precision and intent.
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Our Instruments", href: "/products" },
          { label: "The Lowther Supertweeter" },
        ]}
      />

      {/* Intro */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: "#c59862" }}>
                The missing layer of realism
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                {introParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                The Supertweeter in detail
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A compact enclosure with purposeful geometry, available in finishes that complement every Lowther loudspeaker.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <ScrollReveal key={image.src} animation="fade-up" delay={(index % 3) * 100}>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                Bring the final octave to your Lowther
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Configure the Supertweeter with DX or PM magnet assemblies to suit your instrument.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up">
            <div className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-lg shadow-sm p-8">
              <div className="relative w-full mb-6 max-w-xl mx-auto">
                <Image
                  src={superTweeterProduct.image}
                  alt={superTweeterProduct.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="w-full max-w-xl">
                <h3 className="font-display text-3xl mb-2" style={{ color: "#c59862" }}>
                  {superTweeterProduct.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {getDisplayPrice()}
                </p>
                <ProductActionButtons
                  product={{
                    id: superTweeterProduct.id,
                    handle: superTweeterProduct.handle,
                    title: superTweeterProduct.title,
                    price: getDisplayPrice(),
                    image: superTweeterProduct.image,
                  }}
                  onPrimary={openProductDetail}
                  onSecondary={openProductDetail}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Handcrafted */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                Handmade to live with our full range drivers
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From the diaphragm geometry to the magnet structures, every element of the Supertweeter is crafted to behave like an organic extension of a Lowther driver—never an afterthought.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up">
            <div className="space-y-12 text-center text-lg text-gray-700 leading-relaxed mb-16">
              {detailHighlights.map((detail) => (
                <div key={detail.title} className="space-y-3">
                  <h3 className="font-display text-3xl md:text-4xl" style={{ color: "#c59862" }}>
                    {detail.title}
                  </h3>
                  <p>{detail.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {craftsmanshipHighlights.map((item, index) => (
              <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 space-y-3 flex-1 flex flex-col">
                    <h3 className="font-display text-2xl" style={{ color: "#c59862" }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed flex-1">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                What listeners are hearing
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Subtle in presence, profound in impact—the Supertweeter restores spatial cues and harmonic information that transforms the listening experience.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((quote, index) => (
              <ScrollReveal key={quote} animation="fade-up" delay={(index % 2) * 100}>
                <blockquote className="bg-white border border-gray-200 rounded-lg p-8 text-gray-700 leading-relaxed shadow-sm">
                  {quote}
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <LowtherForLifeSection />

      {/* Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="h-full flex flex-col md:flex-row">
            <div
              className={`w-full md:w-1/2 relative bg-[#fafaf8] flex items-center justify-center p-12 transition-transform duration-[600ms] ease-out ${
                isProductOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="relative w-full h-full max-w-lg">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div
              className={`w-full md:w-1/2 relative overflow-y-auto transition-transform duration-[600ms] ease-out delay-100 ${
                isProductOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="p-12 max-w-2xl">
                <button
                  onClick={closeProductDetail}
                  className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-8 h-8" />
                </button>

                <div className="mb-12 space-y-6">
                  <div>
                    <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">DRIVE UNITS</p>
                    <h2 className="font-display text-5xl mb-4" style={{ color: "#c59862" }}>
                      {selectedProduct.title}
                    </h2>
                    <p className="text-xl text-gray-900 mb-2">
                      {getOverlayPrice()}
                      <span className="ml-2 text-sm text-gray-500 uppercase tracking-[2px]">
                        per unit
                      </span>
                    </p>
                  </div>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{selectedProduct.description}</p>
                    {selectedProduct.details.map((detail, index) => (
                      <p key={index}>{detail}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Magnet Option
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {magnetOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedMagnet(option)}
                          className={`py-3 px-4 text-sm border rounded transition-all ${
                            selectedMagnet === option
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      className="w-full py-3 px-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    onClick={handleAddToBag}
                    disabled={cartLoading}
                  >
                    {cartLoading ? "ADDING..." : "ADD TO BAG"}
                  </Button>
                  <Button
                    size="lg"
                    className="w-full bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    onClick={() => {
                      closeProductDetail();
                      window.location.href = "/book-appointment";
                    }}
                  >
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


