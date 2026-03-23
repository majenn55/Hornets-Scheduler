import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@hornets-scheduler.com',
    to,
    subject,
    html,
  });
}

export function inviteEmail(inviterName: string, entityName: string, type: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/invites/accept?token=${token}`;
  return {
    subject: `You've been invited to join ${entityName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Hornets Scheduler</h2>
        <p><strong>${inviterName}</strong> has invited you to join the ${type} <strong>${entityName}</strong>.</p>
        <a href="${url}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Accept Invitation
        </a>
        <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
      </div>
    `,
  };
}

export function familyInviteEmail(inviterName: string, familyName: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/family/join?token=${token}`;
  return {
    subject: `Join ${familyName} on Hornets Scheduler`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Hornets Scheduler</h2>
        <p><strong>${inviterName}</strong> has invited you to join the family account <strong>${familyName}</strong>.</p>
        <p>By joining, you'll be able to share schedules, view stats, and manage your family's sports activities together.</p>
        <a href="${url}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Join Family
        </a>
        <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
      </div>
    `,
  };
}
