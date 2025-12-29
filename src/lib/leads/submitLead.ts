import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  message?: string;
  phone?: string;
  location?: string;
  segment: string; // e.g., "Contact", "Commission Request", "Book Appointment"
  speakerInterest?: string; // For commission forms
  [key: string]: any; // Allow additional fields
}

export interface LeadSubmissionResult {
  ok: boolean;
  beehiivOk: boolean;
  emailOk: boolean;
  resendId?: string;
  error?: string;
}

/**
 * Shared server-side helper for lead submissions
 * 
 * This function:
 * 1. Validates the payload
 * 2. Sends email notification via Resend (PRIORITY - must succeed)
 * 3. Adds to Beehiiv (optional - can fail without breaking the submission)
 * 
 * Email is always sent to FORM_NOTIFICATION_EMAILS (comma-separated list)
 * Falls back to default emails if env var not set.
 */
export async function submitLead(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  const { name, email, message, phone, location, segment, speakerInterest, ...extraFields } = payload;

  // Validate required fields
  if (!name || !email || !segment) {
    return {
      ok: false,
      beehiivOk: false,
      emailOk: false,
      error: 'Missing required fields: name, email, and segment are required',
    };
  }

  // Check Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('[LEAD SUBMISSION] RESEND_API_KEY is not configured');
    return {
      ok: false,
      beehiivOk: false,
      emailOk: false,
      error: 'Email service not configured',
    };
  }

  // Get notification emails from env var (comma-separated)
  const notificationEmailsEnv = process.env.FORM_NOTIFICATION_EMAILS;
  const notificationEmails = notificationEmailsEnv
    ? notificationEmailsEnv.split(',').map(e => e.trim()).filter(Boolean)
    : ['social@lowtherloudspeakers.com', 'hello@lowtherloudspeakers.com']; // Safe fallback

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'mrbird@lowtherloudspeakers.com';

  // Build email HTML content
  const emailHtml = buildEmailHtml({
    segment,
    name,
    email,
    phone,
    location,
    message,
    speakerInterest,
    extraFields,
  });

  // Build email text content (plain text fallback)
  const emailText = buildEmailText({
    segment,
    name,
    email,
    phone,
    location,
    message,
    speakerInterest,
    extraFields,
  });

  // 1. Send email via Resend (PRIORITY - must succeed)
  let emailOk = false;
  let resendId: string | undefined;
  let emailError: string | undefined;

  try {
    console.log(`[LEAD SUBMISSION] Sending email for segment: ${segment}`, {
      from: fromEmail,
      to: notificationEmails,
      replyTo: email,
      segment,
      timestamp: new Date().toISOString(),
    });

    const { data, error } = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: notificationEmails,
      replyTo: email,
      subject: `New ${segment} Enquiry${speakerInterest ? ` - ${speakerInterest}` : ''}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('[LEAD SUBMISSION] Resend API error:', {
        error: error.message,
        statusCode: (error as any).statusCode,
        segment,
      });
      emailError = error.message;
      emailOk = false;
    } else if (data?.id) {
      console.log('[LEAD SUBMISSION] Email sent successfully:', {
        resendId: data.id,
        to: notificationEmails,
        segment,
      });
      emailOk = true;
      resendId = data.id;
    } else {
      console.error('[LEAD SUBMISSION] Resend returned no data and no error');
      emailError = 'Unknown error from Resend API';
      emailOk = false;
    }
  } catch (err: any) {
    console.error('[LEAD SUBMISSION] Error sending email:', {
      error: err.message,
      segment,
    });
    emailError = err.message;
    emailOk = false;
  }

  // If email failed, return error immediately (email is priority)
  if (!emailOk) {
    return {
      ok: false,
      beehiivOk: false,
      emailOk: false,
      error: emailError || 'Failed to send email notification',
    };
  }

  // 2. Add to Beehiiv (optional - can fail without breaking submission)
  let beehiivOk = false;
  const beehiivApiKey = process.env.BEEHIIV_API_KEY;
  const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (beehiivApiKey && beehiivPublicationId) {
    try {
      const beehiivPayload: any = {
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: 'website',
        utm_medium: segment.toLowerCase().replace(/\s+/g, '_'),
        utm_campaign: speakerInterest || segment,
        referring_site: 'lowtherloudspeakers.com',
        custom_fields: [
          { name: 'full_name', value: name },
          { name: 'lead_type', value: segment },
          ...(phone ? [{ name: 'phone', value: phone }] : []),
          ...(location ? [{ name: 'location', value: location }] : []),
          ...(speakerInterest ? [{ name: 'speaker_interest', value: speakerInterest }] : []),
        ],
      };

      console.log(`[LEAD SUBMISSION] Adding to Beehiiv for segment: ${segment}`);

      const beehiivResponse = await fetch(
        `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${beehiivApiKey}`,
          },
          body: JSON.stringify(beehiivPayload),
        }
      );

      if (beehiivResponse.ok) {
        const beehiivData = await beehiivResponse.json();
        console.log('[LEAD SUBMISSION] Successfully added to Beehiiv:', {
          email,
          segment,
        });
        beehiivOk = true;
      } else {
        const errorText = await beehiivResponse.text();
        console.error('[LEAD SUBMISSION] Beehiiv API error (non-fatal):', {
          status: beehiivResponse.status,
          error: errorText,
          segment,
        });
        beehiivOk = false;
      }
    } catch (beehiivError: any) {
      console.error('[LEAD SUBMISSION] Beehiiv integration error (non-fatal):', {
        error: beehiivError.message,
        segment,
      });
      beehiivOk = false;
    }
  } else {
    console.log('[LEAD SUBMISSION] Beehiiv not configured, skipping');
    beehiivOk = false;
  }

  // Return success (email succeeded, even if Beehiiv failed)
  return {
    ok: true,
    beehiivOk,
    emailOk: true,
    resendId,
  };
}

function buildEmailHtml(data: {
  segment: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message?: string;
  speakerInterest?: string;
  extraFields: Record<string, any>;
}): string {
  const { segment, name, email, phone, location, message, speakerInterest, extraFields } = data;

  // Build fields HTML
  const fieldsHtml = [
    `<div class="field">
      <div class="label">Full Name</div>
      <div class="value">${escapeHtml(name)}</div>
    </div>`,
    `<div class="field">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
    </div>`,
    phone ? `<div class="field">
      <div class="label">Phone Number</div>
      <div class="value"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></div>
    </div>` : '',
    location ? `<div class="field">
      <div class="label">Location</div>
      <div class="value">${escapeHtml(location)}</div>
    </div>` : '',
    speakerInterest ? `<div class="field">
      <div class="label">Speaker Interest</div>
      <div class="value">${escapeHtml(speakerInterest)}</div>
    </div>` : '',
    // Add any extra fields
    ...Object.entries(extraFields)
      .filter(([key]) => !['name', 'email', 'phone', 'location', 'message', 'segment', 'speakerInterest'].includes(key))
      .map(([key, value]) => `<div class="field">
        <div class="label">${escapeHtml(key.replace(/([A-Z])/g, ' $1').trim())}</div>
        <div class="value">${escapeHtml(String(value))}</div>
      </div>`),
    message ? `<div class="field">
      <div class="label">Message</div>
      <div class="value" style="white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>` : '',
  ].filter(Boolean).join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #c59862 0%, #b0874f 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-left: 4px solid #c59862;
            border-radius: 4px;
          }
          .label {
            font-weight: bold;
            color: #c59862;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: normal;">New ${escapeHtml(segment)} Enquiry</h1>
        </div>
        <div class="content">
          ${fieldsHtml}
          <div class="footer">
            <p>This enquiry was submitted through the Lowther Loudspeakers website.</p>
            <p>Form Type: ${escapeHtml(segment)}</p>
            <p>Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildEmailText(data: {
  segment: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message?: string;
  speakerInterest?: string;
  extraFields: Record<string, any>;
}): string {
  const { segment, name, email, phone, location, message, speakerInterest, extraFields } = data;

  const lines = [
    `New ${segment} Enquiry`,
    '',
    `Full Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    ...(location ? [`Location: ${location}`] : []),
    ...(speakerInterest ? [`Speaker Interest: ${speakerInterest}`] : []),
    ...Object.entries(extraFields)
      .filter(([key]) => !['name', 'email', 'phone', 'location', 'message', 'segment', 'speakerInterest'].includes(key))
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`),
    ...(message ? ['', 'Message:', message] : []),
    '',
    `Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`,
    `Form Type: ${segment}`,
  ];

  return lines.join('\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

