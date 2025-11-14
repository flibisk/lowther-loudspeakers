"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LowtherForLifeSection } from "@/components/lowther-for-life-section";
import { ProductActionButtons } from "@/components/product-action-buttons";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useCurrency } from "@/contexts/currency-context";
import { useShopifyCollection } from "@/hooks/use-shopify-collection";
import {
  findVariantByOptions,
  formatPrice,
  getProduct,
  type ShopifyProduct,
  type ShopifyVariant,
} from "@/lib/shopify-storefront";

const superTweeterProduct = {
  id: "super-tweeter",
  handle: "lowther-supertweeter",
  title: "Lowther Super Tweeter",
  price: "£0.00",
  image: "/images/drive-units/super-tweeter/gallery/Super Tweeter - Product Image.jpg",
  description:
    "Completing the top octave with precision and intent, the Lowther Super Tweeter extends the bandwidth of our full-range instruments without adding artificial edge or glare.",
  details: [
    "Designed to take over precisely where the eight-inch Lowther driver naturally rolls off, the Super Tweeter restores the final octave of information that locks the stereo image in place.",
    "Available with DX or PM magnet structures to match the energy, speed, and scale of the partnering driver.",
  ],
};

const magnetOptions = ["Neodymium (DX)", "Alnico (PM)"];
const MAGNET_OPTION_NAME = "Magnet Type";

const galleryImages = [
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front.jpg",
    alt: "Front view of the Lowther Super Tweeter in British Racing Green",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front black version.jpg",
    alt: "Lowther Super Tweeter finished in black",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter PM.jpg",
    alt: "Lowther Super Tweeter with PM magnet assembly",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back.jpg",
    alt: "Rear view of the Lowther Super Tweeter",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back - cable.jpg",
    alt: "Detail of the Lowther Super Tweeter connectivity",
  },
  {
    src: "/images/drive-units/super-tweeter/gallery/Super Tweeter on Voigt Horn.jpg",
    alt: "Lowther Super Tweeter mounted on a Voigt Horn loudspeaker",
  },
];

const genericCraftsmanshipContent = [
  {
    title: "Hand-Wound Voice Coils",
    description:
      "At the heart of every Lowther lies a voice coil wound entirely by hand, to tolerances measured in microns. Copper, silver, or gold alloy wire is layered under exact tension to achieve balance beyond the reach of machines.",
    image: "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-coil-winding.jpg",
  },
  {
    title: "Assembled by Master Craftsmen",
    description:
      "Every component is brought together by craftsmen whose experience spans decades. Their skill and intuition, the ability to feel perfect alignment within a human hair's breadth, ensure flawless centring and effortless movement.",
    image: "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-handmade-to-order.jpg",
  },
  {
    title: "Cones Treated by Hand, Dried by Sunlight",
    description:
      "Our paper cones are individually brushed with proprietary treatments, then cured slowly in natural sunlight. This organic process creates a surface both rigid and alive, capturing musical textures with breathtaking speed and delicacy.",
    image:
      "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain - lowther paper cones curing in sunlight.jpg",
  },
  {
    title: "Tested to Ensure Perfection",
    description:
      "Every drive unit undergoes exhaustive acoustic and mechanical testing. From precise frequency analysis to the tactile inspection of cone travel, nothing leaves our bench until it meets the sonic ideal that defines Lowther.",
    image: "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-tested.jpg",
  },
  {
    title: "Superior Metalwork, Engineered for Magnetism",
    description:
      "Our metalwork is forged from premium lead-free steels. This geometry channels magnetic flux with maximum efficiency, forming the silent architecture beneath the Lowther signature: lightning-fast response and effortless dynamics.",
    image: "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-handmade-to-order2.jpg",
  },
  {
    title: "Choice of Magnets",
    description:
      "From traditional Alnico to modern Neodymium and the rare Permendur and Magmax of our Grand Opera instruments, each magnet composition shapes character and tone.",
    image:
      "/images/drive-units/philharmonic-collection/gallery/made-in-great-britain-higest-specifications-of-any-drive-units-in-the-world.jpg",
  },
];

const detailHighlights = [
  {
    title: "Matching the character of our full range drivers",
    description:
      "Made from the same materials and formed with the same approach as the cone and whizzer in our eight-inch instruments. The Super Tweeter avoids the usual disconnect of a bolt-on HF unit and instead sounds like an organic continuation of the driver itself.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter Front.jpg",
  },
  {
    title: "Magnet systems tuned for Lowther speed",
    description:
      "Choose between DX or PM magnet assemblies to complement the energy and voicing of your system. Both options preserve transient speed while delivering effortless air and integration.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter PM.jpg",
  },
  {
    title: "Place it where it works best",
    description:
      "A compact enclosure with a broad dispersion waveguide allows the Super Tweeter to sit above or behind the main driver, maintaining subtle visual presence while expanding spatial realism.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter on Voigt Horn.jpg",
  },
  {
    title: "Hearing above ten kilohertz",
    description:
      "In listening sessions at our Northampton studio—even with listeners whose hearing measured a roll-off above 10 kHz—the Super Tweeter delivered stronger imaging, more natural decay and a deeper sense of space. The ear may not hear the tone, yet the brain registers the cues.",
    image: "/images/drive-units/super-tweeter/gallery/Super Tweeter Back.jpg",
  },
];

const testimonials = [
  "“Once the Super Tweeter was switched off the music lost height. I could not hear the tone but I could feel the difference.”",
  "“I thought my hearing had dropped above ten kilohertz. The Super Tweeter still improved the space around vocals and instruments.”",
  "“It is not about hearing a higher note. It is about restoring the final cues that help you locate every sound in the room.”",
  "“With the Super Tweeter engaged the stereo image locks in. Without it everything feels slightly flatter.”",
  "“I did not expect it to matter at my age. It does.”",
  "“The highs are subtle. The effect is not.”",
];

const introParagraphs = [
  "Every Lowther full-range instrument reaches remarkable heights on its own. Yet all eight-inch units experience a natural roll-off above ten kilohertz. Even when you cannot consciously hear those top harmonics, your brain responds to them. The result is a clearer image, stronger spatial cues and a greater sense of ease in the music.",
  "The Lowther Super Tweeter is designed to continue exactly where the full range driver falls away. It adds nothing artificial. It simply restores the final part of the spectrum that completes the experience.",
];

export default function SuperTweeterPage() {
  const { addItem, isLoading: cartLoading } = useCart();
  const { currency, region } = useCurrency();
  const { productMap } = useShopifyCollection("super-tweeter");

  const [selectedProduct, setSelectedProduct] = useState<typeof superTweeterProduct | null>(null);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedMagnet, setSelectedMagnet] = useState<string>(magnetOptions[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const collectionProduct = productMap.get(superTweeterProduct.handle);
    if (collectionProduct) {
      setShopifyProduct(collectionProduct);
      return;
    }

    async function fetchProduct() {
      try {
        const product = await getProduct(superTweeterProduct.handle, currency, region);
        if (!cancelled && product) {
          setShopifyProduct(product);
        }
      } catch {
        if (!cancelled) {
          setShopifyProduct(null);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productMap, currency, region]);

  const getDisplayPrice = () => {
    if (shopifyProduct) {
      return formatPrice(
        shopifyProduct.priceRange.minVariantPrice.amount,
        shopifyProduct.priceRange.minVariantPrice.currencyCode,
      );
    }
    return superTweeterProduct.price;
  };

  const openProductDetail = () => {
    setSelectedProduct(superTweeterProduct);
    setSelectedMagnet(magnetOptions[0]);
    setQuantity(1);
    setTimeout(() => setIsProductOpen(true), 50);
  };

  const closeProductDetail = () => {
    setIsProductOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 600);
  };

  const getCurrentVariant = (): ShopifyVariant | undefined => {
    if (!shopifyProduct) return undefined;
    const options = {
      [MAGNET_OPTION_NAME]: selectedMagnet,
    };
    return findVariantByOptions(shopifyProduct.variants, options);
  };

  const getOverlayPrice = () => {
    const variant = getCurrentVariant();
    if (variant) {
      return formatPrice(variant.price.amount, variant.price.currencyCode);
    }
    if (shopifyProduct) {
      return formatPrice(
        shopifyProduct.priceRange.minVariantPrice.amount,
        shopifyProduct.priceRange.minVariantPrice.currencyCode,
      );
    }
    return superTweeterProduct.price;
  };

  const handleAddToBag = async () => {
    if (!selectedProduct) return;

    if (shopifyProduct) {
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

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
  };

  const navigateGallery = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/drive-units/super-tweeter/hero/supertweeter-hero.jpg"
          alt="The Lowther Super Tweeter"
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
            The Lowther Super Tweeter
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
          { label: "The Lowther Super Tweeter" },
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
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <ScrollReveal key={image.src} animation="scale" delay={(index % 3) * 100}>
                <div
                  className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer group"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Overlay */}
      {isGalleryOpen && selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              navigateGallery("prev");
            }}
            className="absolute left-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="relative w-[90vw] h-[90vh]" onClick={(event) => event.stopPropagation()}>
            <Image
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              navigateGallery("next");
            }}
            className="absolute right-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Product */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                Bring the final octave to your Lowther
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Configure the Super Tweeter with DX or PM magnet assemblies to suit your instrument.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative w-full aspect-square">
                <Image
                  src={superTweeterProduct.image}
                  alt={superTweeterProduct.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-6 text-center lg:text-left">
                <h3 className="font-display text-4xl md:text-5xl" style={{ color: "#c59862" }}>
                  {superTweeterProduct.title}
                </h3>
                <p className="text-xl text-gray-600">
                  From {getDisplayPrice()}
                </p>
                <ProductActionButtons
                  product={{
                    id: superTweeterProduct.id,
                    handle: superTweeterProduct.handle,
                    title: superTweeterProduct.title,
                    price: `From ${getDisplayPrice()}`,
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                Handcrafted in Great Britain
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every Lowther drive unit is the result of meticulous hand assembly, decades of refinement, and an unwavering commitment to sonic excellence.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {genericCraftsmanshipContent.map((item, index) => (
              <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
                <div className="flex flex-col">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl mb-4" style={{ color: "#c59862" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#c59862" }}>
                The details that define the Super Tweeter
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {detailHighlights.map((detail, index) => (
              <ScrollReveal key={detail.title} animation="fade-up" delay={(index % 2) * 100}>
                <div className="flex flex-col">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={detail.image}
                      alt={detail.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl mb-4" style={{ color: "#c59862" }}>
                    {detail.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {detail.description}
                  </p>
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
                Subtle in presence, profound in impact—the Super Tweeter restores spatial cues and harmonic information that transforms the listening experience.
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
                      From {getOverlayPrice()}
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


