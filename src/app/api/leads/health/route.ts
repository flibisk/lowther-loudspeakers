import { NextResponse } from 'next/server';

/**
 * Health endpoint for lead submission system
 * Checks that required environment variables are configured
 * (without exposing their values)
 */
export async function GET() {
  const checks = {
    resendConfigured: !!process.env.RESEND_API_KEY,
    beehiivConfigured: !!(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID),
    fromEmailConfigured: !!process.env.RESEND_FROM_EMAIL,
  };

  // Form notifications always go to peter@shinystudio.co.uk (hardcoded)
  const notificationEmail = 'peter@shinystudio.co.uk';

  const ok = checks.resendConfigured;

  return NextResponse.json({
    ok,
    resendConfigured: checks.resendConfigured,
    beehiivConfigured: checks.beehiivConfigured,
    notificationEmail,
    fromEmailConfigured: checks.fromEmailConfigured,
    timestamp: new Date().toISOString(),
  });
}
