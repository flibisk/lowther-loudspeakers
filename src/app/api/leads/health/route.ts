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

  // Form notifications always go to external addresses (hardcoded)
  const notificationEmails = ['peter@shinystudio.co.uk', 'lowtherloudspeakers@gmail.com'];

  const ok = checks.resendConfigured;

  return NextResponse.json({
    ok,
    resendConfigured: checks.resendConfigured,
    beehiivConfigured: checks.beehiivConfigured,
    notificationEmails,
    notificationEmailsCount: notificationEmails.length,
    fromEmailConfigured: checks.fromEmailConfigured,
    timestamp: new Date().toISOString(),
  });
}
