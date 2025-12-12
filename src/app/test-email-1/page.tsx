'use client';

import { useState } from 'react';
import { buildQueueEmail, CartItem } from '@/lib/abandoned-cart/email-templates';

export default function TestEmail1Page() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Customizable cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      title: 'PM6A Concert',
      quantity: 1,
      price: '£1,200.00',
    },
    {
      title: 'Lowther Standard Dome',
      quantity: 1,
      price: '£60.00',
    },
  ]);

  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com');
  const cartUrl = `${siteUrl}/products`;

  // Generate email HTML
  const emailHtml = buildQueueEmail(cartUrl, cartItems);

  const handleSendTest = async () => {
    if (!email || !email.includes('@')) {
      setResult({ success: false, message: 'Please enter a valid email address' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-abandoned-cart-email', {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Test Email 1: Build Queue Email</h1>
          
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
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <strong>Test Cart Items (Customize to test different products):</strong>
              </label>
              <button
                onClick={() => setCartItems([...cartItems, { title: '', quantity: 1, price: '' }])}
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
                      onChange={(e) => {
                        const updated = [...cartItems];
                        updated[index] = { ...updated[index], title: e.target.value };
                        setCartItems(updated);
                      }}
                      placeholder="Product name"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...cartItems];
                        updated[index] = { ...updated[index], quantity: parseInt(e.target.value) || 1 };
                        setCartItems(updated);
                      }}
                      placeholder="Quantity"
                      min="1"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={item.price || ''}
                      onChange={(e) => {
                        const updated = [...cartItems];
                        updated[index] = { ...updated[index], price: e.target.value };
                        setCartItems(updated);
                      }}
                      placeholder="Price (e.g., £1,200.00)"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>
                  {cartItems.length > 1 && (
                    <button
                      onClick={() => setCartItems(cartItems.filter((_, i) => i !== index))}
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
            <p className="text-sm text-gray-600">
              <strong>Cart URL:</strong> {cartUrl}
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
            <li>Use the form above to send a test email to your inbox</li>
            <li>Or use the API directly: <code className="bg-blue-100 px-1 rounded">POST /api/test-abandoned-cart-email</code></li>
            <li>Or GET: <code className="bg-blue-100 px-1 rounded">/api/test-abandoned-cart-email?email=your-email@example.com</code></li>
            <li>The preview above shows how the email will look</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

