import { Resend } from 'resend';
import supabase from './supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  email: string;
  firstName: string;
  lastName: string;
  amount?: number;
}

interface EmailEvent {
  email_id: string;
  recipient: string;
  email_type: 'beta' | 'waitlist';
  status: 'sent' | 'delivered' | 'opened' | 'clicked';
  metadata?: Record<string, any>;
}

async function trackEmailEvent(event: EmailEvent) {
  try {
    const { error } = await supabase
      .from('email_events')
      .insert([event]);

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking email event:', error);
  }
}

export async function sendBetaConfirmationEmail({ email, firstName, lastName, amount }: EmailData) {
  try {
    const trackingId = `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trackingPixel = `${process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking/pixel/${trackingId}`;
    const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking/click/${trackingId}?destination=https://sickdaysportsclub.com`;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Sick Day Sports Club <info@sickdaysportsclub.com>',
      to: email,
      subject: 'Welcome to Sick Day Sports Club Beta!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a7729;">Welcome to Sick Day Sports Club Beta!</h1>
          <p>Hi ${firstName},</p>
          <p>Thanks for joining our beta program! We're excited to have you on board.</p>
          ${amount ? `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;">Your card has been securely saved, and we'll charge the $${amount} deposit when we launch.</p>
            <p style="margin: 10px 0 0 0; font-size: 0.9em;">Don't worry - we'll notify you before processing the payment.</p>
          </div>
          ` : ''}
          <p>What's next?</p>
          <ul>
            <li>We'll keep you updated on our progress</li>
            <li>You'll be among the first to access our platform</li>
            <li>Your feedback will help shape the future of outdoor adventure booking</li>
          </ul>
          <p>If you have any questions, just reply to this email.</p>
          <p>Best regards,<br>The Sick Day Sports Club Team</p>
          <p><a href="${clickTrackingUrl}">Visit our website</a></p>
          <img src="${trackingPixel}" alt="" width="1" height="1" style="display: none;" />
        </div>
      `,
      tags: [{ name: 'email_id', value: trackingId }],
    });

    if (error) throw error;

    // Track email sent event
    await trackEmailEvent({
      email_id: trackingId,
      recipient: email,
      email_type: 'beta',
      status: 'sent',
      metadata: { amount }
    });

    return emailData;
  } catch (error) {
    console.error('Error sending beta confirmation email:', error);
    throw error;
  }
}

export async function sendWaitlistConfirmationEmail({ email, firstName, lastName }: EmailData) {
  try {
    const trackingId = `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trackingPixel = `${process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking/pixel/${trackingId}`;
    const clickTrackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking/click/${trackingId}?destination=https://sickdaysportsclub.com`;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Sick Day Sports Club <info@sickdaysportsclub.com>',
      to: email,
      subject: 'Welcome to the Sick Day Sports Club Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a7729;">Welcome to the Waitlist!</h1>
          <p>Hi ${firstName},</p>
          <p>Thanks for joining our waitlist! We're excited to have you interested in Sick Day Sports Club.</p>
          <p>What's next?</p>
          <ul>
            <li>We'll keep you updated on our progress</li>
            <li>You'll be among the first to know when we launch</li>
            <li>You'll get early access to our platform</li>
          </ul>
          <p>If you have any questions, just reply to this email.</p>
          <p>Best regards,<br>The Sick Day Sports Club Team</p>
          <p><a href="${clickTrackingUrl}">Visit our website</a></p>
          <img src="${trackingPixel}" alt="" width="1" height="1" style="display: none;" />
        </div>
      `,
      tags: [{ name: 'email_id', value: trackingId }],
    });

    if (error) throw error;

    // Track email sent event
    await trackEmailEvent({
      email_id: trackingId,
      recipient: email,
      email_type: 'waitlist',
      status: 'sent'
    });

    return emailData;
  } catch (error) {
    console.error('Error sending waitlist confirmation email:', error);
    throw error;
  }
} 