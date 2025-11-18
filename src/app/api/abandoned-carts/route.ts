import { NextRequest, NextResponse } from 'next/server';

/**
 * Abandoned Cart Storage API
 * Stores cart data server-side for cron job processing
 */

interface StoredCart {
  email: string;
  cartItems: Array<{
    title: string;
    quantity: number;
    price: string;
    image?: string;
  }>;
  cartTotal: string;
  timestamp: number;
  cartId?: string;
  emailSent?: boolean;
}

// In-memory store (in production, use a database like Upstash Redis)
// This is a simple solution - for production, consider using a proper database
const cartStore = new Map<string, StoredCart>();

// Clean up old carts (older than 7 days)
setInterval(() => {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  for (const [key, cart] of cartStore.entries()) {
    if (cart.timestamp < sevenDaysAgo) {
      cartStore.delete(key);
    }
  }
}, 24 * 60 * 60 * 1000); // Run daily

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, cartItems, cartTotal, cartId } = body;

    if (!email || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Email and cart items are required' },
        { status: 400 }
      );
    }

    // Store cart data
    const cartData: StoredCart = {
      email,
      cartItems,
      cartTotal,
      timestamp: Date.now(),
      cartId,
      emailSent: false,
    };

    // Use email + cartId as key, or just email if no cartId
    const key = cartId ? `${email}-${cartId}` : email;
    cartStore.set(key, cartData);

    console.log('Stored abandoned cart:', { email, itemCount: cartItems.length, key });

    return NextResponse.json({ 
      success: true,
      message: 'Cart data stored'
    });

  } catch (error) {
    console.error('Error storing abandoned cart:', error);
    return NextResponse.json(
      { success: false, message: 'Error storing cart data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all carts (for cron job to process)
  const carts = Array.from(cartStore.values());
  return NextResponse.json({ 
    success: true,
    carts,
    count: carts.length
  });
}

export async function PATCH(request: NextRequest) {
  // Mark a cart as email sent
  try {
    const body = await request.json();
    const { email, cartId, emailSent } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const key = cartId ? `${email}-${cartId}` : email;
    const cart = cartStore.get(key);

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.emailSent = emailSent !== undefined ? emailSent : true;
    cartStore.set(key, cart);

    return NextResponse.json({ 
      success: true,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Delete a specific cart (when checkout is completed)
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const cartId = searchParams.get('cartId');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const key = cartId ? `${email}-${cartId}` : email;
    cartStore.delete(key);

    return NextResponse.json({ 
      success: true,
      message: 'Cart data deleted'
    });
  } catch (error) {
    console.error('Error deleting abandoned cart:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting cart data' },
      { status: 500 }
    );
  }
}

