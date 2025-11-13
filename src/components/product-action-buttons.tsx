"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";

interface WishlistProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
}

interface ProductActionButtonsProps {
  product: WishlistProduct;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoadingLabel?: string;
}

export function ProductActionButtons({
  product,
  onPrimary,
  onSecondary,
  primaryLabel = "BUY NOW",
  secondaryLabel = "LEARN MORE",
  primaryDisabled = false,
  primaryLoadingLabel,
}: ProductActionButtonsProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  const handleWishlist = () => {
    if (saved) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        size="lg"
        className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
        onClick={onPrimary}
        disabled={primaryDisabled}
      >
        {primaryDisabled && primaryLoadingLabel ? primaryLoadingLabel : primaryLabel}
      </Button>
      <div className="flex items-center gap-3 w-full">
        <Button
          size="lg"
          className="flex-1 h-12 bg-white hover:bg-black text-black hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
        <button
          type="button"
          title={saved ? 'Remove from wish list' : 'Save to wish list'}
          aria-label={saved ? 'Remove from wish list' : 'Save to wish list'}
          className={`group relative flex h-12 w-12 items-center justify-center rounded border transition-all duration-200 ${
            saved
              ? 'bg-[#c59862] border-[#c59862] text-white hover:bg-[#b78955]'
              : 'bg-white border-[#c59862] text-[#c59862] hover:bg-[#c59862] hover:text-white'
          }`}
          onClick={handleWishlist}
        >
          <Heart
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            strokeWidth={saved ? 0 : 1.6}
            fill={saved ? 'currentColor' : 'none'}
          />
          <span className="sr-only">
            {saved ? 'Remove from wish list' : 'Save to wish list'}
          </span>
          <span className="wishlist-tooltip pointer-events-none absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] font-medium uppercase tracking-[2px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
            {saved ? 'Saved' : 'Save to wish list'}
          </span>
        </button>
      </div>
    </div>
  );
}
