import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const targetEmail = process.env.OWNER_EMAIL || "";
  
  if (!targetEmail) {
    console.error('Error: OWNER_EMAIL is not set in environment variables.');
    return NextResponse.json({ error: "Notification email recipient not configured." }, { status: 400 });
  }

  console.log(`ALERT: User clicked 'No' on the Valentine proposal! Notification for ${targetEmail} triggered.`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ValentineApp <onboarding@resend.dev>',
      to: targetEmail,
      subject: 'Proposal Update: Selected NO',
      html: '<p>The user has selected "No" on your Valentine proposal.</p>'
    });

    if (error) {
      console.error('Error sending email:', error);
      // Fallback in case of error during development/demo
      return NextResponse.json({ 
        message: "Email error (likely missing API key), but request logged.",
        error: error.message 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      message: "Notification sent successfully.",
      id: data?.id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
