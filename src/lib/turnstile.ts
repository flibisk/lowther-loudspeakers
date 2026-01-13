/**
 * Server-side Turnstile verification
 * Use this in API routes to verify Turnstile tokens
 */

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(token: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('[TURNSTILE] Secret key not configured');
    return { success: false, error: 'Server configuration error' };
  }

  if (!token) {
    return { success: false, error: 'No verification token provided' };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data: TurnstileVerifyResponse = await response.json();
    
    if (data.success) {
      return { success: true };
    } else {
      console.error('[TURNSTILE] Verification failed:', data['error-codes']);
      return { success: false, error: 'Human verification failed. Please try again.' };
    }
  } catch (error) {
    console.error('[TURNSTILE] Verification error:', error);
    return { success: false, error: 'Verification request failed' };
  }
}
