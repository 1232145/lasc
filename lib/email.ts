import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP (free)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
  },
});

export async function sendRSVPConfirmation(name: string, email: string, eventTitle: string, eventDate: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your Gmail address
      to: email,
      subject: `RSVP Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">RSVP Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your RSVP! You're confirmed for:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${eventTitle}</h3>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
          </div>
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>LASC Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendContactConfirmation(name: string, email: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'LASC: Thanks for contacting us!',
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! We received your message and will get back to you as soon as we can.</p>
        <p>Best,<br/>LASC Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Contact confirmation email failed:', error);
    return { success: false, error };
  }
}

export async function notifyAdminOfContact(name: string, email: string, message: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // sending email to self
      subject: 'New Contact Form Submission',
      html: `
        <h3>New message from: ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Admin notification failed:', error);
    return { success: false, error };
  }
}

// Helper function to convert plain text to HTML paragraphs
function formatEmailBody(text: string): string {
  // Split by double newlines for paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Convert single newlines to <br> tags within paragraphs
      const withBreaks = para.replace(/\n/g, '<br>');
      return `<p style="margin: 0 0 1em 0;">${withBreaks}</p>`;
    });
  
  return paragraphs.join('');
}

export async function sendBulkEventEmail(
  recipients: Array<{ name: string; email: string }>,
  subject: string,
  body: string
) {
  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const recipient of recipients) {
    try {
      // Replace placeholders in body with recipient's name
      const personalizedBody = body.replace(/\{name\}/g, recipient.name);
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
            ${formatEmailBody(personalizedBody)}
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      results.push({ email: recipient.email, success: true, messageId: info.messageId });
      successCount++;
    } catch (error) {
      console.error(`Error sending email to ${recipient.email}:`, error);
      results.push({ email: recipient.email, success: false, error: String(error) });
      failureCount++;
    }
  }

  return {
    success: failureCount === 0,
    successCount,
    failureCount,
    total: recipients.length,
    results
  };
}