'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/shopify-storefront';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const { currency } = useCurrency();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItems(prev => new Set(prev).add(lineId));
    await updateItem(lineId, newQuantity);
    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(lineId);
      return next;
    });
  };

  const handleRemoveItem = async (lineId: string) => {
    setUpdatingItems(prev => new Set(prev).add(lineId));
    await removeItem(lineId);
    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(lineId);
      return next;
    });
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Overlay */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-display text-2xl" style={{ color: '#c59862' }}>
            Your Bag
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c59862] mb-4"></div>
              <p className="text-gray-600">Updating prices...</p>
            </div>
          ) : !cart || cart.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg text-gray-600 mb-2">Your bag is empty</p>
              <p className="text-sm text-gray-500">Add some Lowther products to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.lines.map((line) => {
                const isUpdating = updatingItems.has(line.id);
                
                return (
                  <div key={line.id} className="flex gap-4 pb-6 border-b border-gray-200">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={line.merchandise.image.altText || line.merchandise.product.title}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {line.merchandise.product.title}
                      </h3>
                      
                      {/* Variant Options */}
                      {line.merchandise.selectedOptions.length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          {line.merchandise.selectedOptions
                            .filter(opt => opt.name !== 'Title')
                            .map(opt => `${opt.name}: ${opt.value}`)
                            .join(' • ')}
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                            disabled={isUpdating || line.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(line.id)}
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-gray-900">Subtotal</span>
              <span className="font-display text-xl" style={{ color: '#c59862' }}>
                {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>

            {/* Tax Note */}
            <p className="text-xs text-gray-600">
              Taxes and shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <Button
              size="lg"
              className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'LOADING...' : 'PROCEED TO CHECKOUT'}
            </Button>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

