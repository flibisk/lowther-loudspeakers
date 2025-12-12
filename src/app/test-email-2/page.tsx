'use client';

import { useState } from 'react';
import { buildNarrativeEmail, CartItem } from '@/lib/abandoned-cart/email-templates';
import { getNarrativesForCartItems } from '@/lib/abandoned-cart/match-narrative';
import { PRODUCT_NARRATIVES } from '@/lib/abandoned-cart/narratives';

export default function TestEmail2Page() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; narrativesFound?: number } | null>(null);
  
  // Customizable cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      title: 'DX2 Concert',
      quantity: 1,
      price: '£420.00',
    },
    {
      title: 'PM6A Concert',
      quantity: 1,
      price: '£1,200.00',
    },
  ]);

  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com');
  const cartUrl = `${siteUrl}/products`;

  // Get narratives for cart items
  const narratives = getNarrativesForCartItems(cartItems);

  // Generate email HTML
  const emailHtml = buildNarrativeEmail(narratives, cartUrl, cartItems);

  const handleSendTest = async () => {
    if (!email || !email.includes('@')) {
      setResult({ success: false, message: 'Please enter a valid email address' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-abandoned-cart-email-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, cartItems }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Failed to send test email. Please check the console.' 
      });
      console.error('Error sending test email:', error);
    } finally {
      setSending(false);
    }
  };

  const addCartItem = () => {
    setCartItems([...cartItems, { title: '', quantity: 1, price: '' }]);
  };

  const removeCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const updateCartItem = (index: number, field: keyof CartItem, value: string | number) => {
    const updated = [...cartItems];
    updated[index] = { ...updated[index], [field]: value };
    setCartItems(updated);
  };

  // Get list of all available product names for autocomplete
  const availableProducts = PRODUCT_NARRATIVES.map(n => n.name).sort();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Test Email 2: Product Narratives Email</h1>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Send test email to:
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
              />
              <button
                onClick={handleSendTest}
                disabled={sending || !email}
                className="px-6 py-2 bg-[#c59862] text-white rounded-md hover:bg-[#b0874f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </div>

          {result && (
            <div className={`p-4 rounded-md mb-4 ${
              result.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {result.message}
              {result.narrativesFound !== undefined && (
                <div className="mt-2 text-sm">
                  Narratives found: {result.narrativesFound}
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <strong>Test Cart Items (Customize to test different products):</strong>
              </label>
              <button
                onClick={addCartItem}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 rounded-md">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateCartItem(index, 'title', e.target.value)}
                      placeholder="Product name (e.g., PM6A Concert)"
                      list={`products-${index}`}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                    <datalist id={`products-${index}`}>
                      {availableProducts.map((product, i) => (
                        <option key={i} value={product} />
                      ))}
                    </datalist>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="Quantity"
                      min="1"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.price || ''}
                      onChange={(e) => updateCartItem(index, 'price', e.target.value)}
                      placeholder="Price (e.g., £1,200.00)"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>
                  {cartItems.length > 1 && (
                    <button
                      onClick={() => removeCartItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Narratives Matched:</strong>
            </p>
            {narratives.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {narratives.map((narrative, index) => (
                  <li key={index} className="text-green-700 font-medium">
                    ✓ {narrative.name} ({narrative.collection})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-600">⚠ No narratives found - check product names match narrative names</p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Cart URL:</strong> {cartUrl}
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Type product names to see autocomplete suggestions. Try: DX2 Concert, PM6A Concert, PM4A Sinfonia, Standard Dome, etc.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Email Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              srcDoc={emailHtml}
              className="w-full h-[800px] border-0"
              title="Email Preview"
            />
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Testing Options:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Customize cart items above to test different product combinations</li>
            <li>Use the form to send a test email to your inbox</li>
            <li>Or use the API directly: <code className="bg-blue-100 px-1 rounded">POST /api/test-abandoned-cart-email-2</code></li>
            <li>The preview updates automatically as you change cart items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
