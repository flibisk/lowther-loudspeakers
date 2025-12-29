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
    notificationEmailsConfigured: !!process.env.FORM_NOTIFICATION_EMAILS,
    fromEmailConfigured: !!process.env.RESEND_FROM_EMAIL,
  };

  // Parse notification emails count
  const notificationEmailsEnv = process.env.FORM_NOTIFICATION_EMAILS;
  const notificationEmailsCount = notificationEmailsEnv
    ? notificationEmailsEnv.split(',').map(e => e.trim()).filter(Boolean).length
    : 2; // Default fallback count

  const ok = checks.resendConfigured && notificationEmailsCount > 0;

  return NextResponse.json({
    ok,
    resendConfigured: checks.resendConfigured,
    beehiivConfigured: checks.beehiivConfigured,
    notificationEmailsCount,
    notificationEmailsConfigured: checks.notificationEmailsConfigured,
    fromEmailConfigured: checks.fromEmailConfigured,
    timestamp: new Date().toISOString(),
  });
}

