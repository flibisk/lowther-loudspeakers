'use client';

import { useState } from 'react';
import { buildNarrativeEmail, CartItem } from '@/lib/abandoned-cart/email-templates';
import { getNarrativesForCartItems } from '@/lib/abandoned-cart/match-narrative';

export default function TestEmail2Page() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; narrativesFound?: number } | null>(null);

  // Sample cart items for testing (with products that have narratives)
  const testCartItems: CartItem[] = [
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
  ];

  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com');
  const cartUrl = `${siteUrl}/products`;

  // Get narratives for cart items
  const narratives = getNarrativesForCartItems(testCartItems);

  // Generate email HTML
  const emailHtml = buildNarrativeEmail(narratives, cartUrl, testCartItems);

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
        body: JSON.stringify({ email }),
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

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Test Cart Items:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {testCartItems.map((item, index) => (
                <li key={index}>
                  {item.quantity} × {item.title} - {item.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Narratives Matched:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {narratives.length > 0 ? (
                narratives.map((narrative, index) => (
                  <li key={index}>{narrative.name}</li>
                ))
              ) : (
                <li className="text-red-600">No narratives found - check matching logic</li>
              )}
            </ul>
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
            <li>Or use the API directly: <code className="bg-blue-100 px-1 rounded">POST /api/test-abandoned-cart-email-2</code></li>
            <li>Or GET: <code className="bg-blue-100 px-1 rounded">/api/test-abandoned-cart-email-2?email=your-email@example.com</code></li>
            <li>The preview above shows how the email will look with matched narratives</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

