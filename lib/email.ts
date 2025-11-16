// Email utility for sending follow-up emails
// Using Resend (https://resend.com) - modern, simple API

interface VehicleFollowUpEmailData {
  to: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  vehicle: string;
  variant?: string;
  registration: string;
}

export async function sendVehicleFollowUpEmail(data: VehicleFollowUpEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return { error: 'Email service not configured' };
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - StealthShield</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #e0e0e0; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 1px solid #2a2a2a;">
          <!-- Header -->
          <div style="background-color: #0f0f0f; padding: 30px; border-bottom: 1px solid #ff3333;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
              STEALTHSHIELD
            </h1>
            <p style="margin: 8px 0 0 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">
              Precision PPF Systems
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px;">
              Thanks for your order, ${data.customerName}!
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #b0b0b0; line-height: 1.6;">
              We're preparing your custom PPF kit. To ensure perfect fitment, please confirm the details below:
            </p>
            
            <!-- Order Details Box -->
            <div style="background-color: #0f0f0f; border-left: 3px solid #ff3333; padding: 20px; margin: 30px 0;">
              <div style="margin-bottom: 15px;">
                <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Order Number</span>
                <div style="color: #ffffff; font-size: 18px; font-weight: 700; margin-top: 5px;">
                  ${data.orderNumber}
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <span style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Order Date</span>
                <div style="color: #e0e0e0; margin-top: 5px;">
                  ${data.orderDate}
                </div>
              </div>
            </div>
            
            <!-- Vehicle Details Box -->
            <div style="background-color: #0f0f0f; border-left: 3px solid #ff3333; padding: 20px; margin: 30px 0;">
              <div style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
                Vehicle Details
              </div>
              
              <div style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                ${data.vehicle}
              </div>
              
              ${data.variant ? `
                <div style="color: #b0b0b0; margin-bottom: 8px;">
                  ${data.variant}
                </div>
              ` : ''}
              
              <div style="color: #ff3333; font-weight: 700;">
                ${data.registration}
              </div>
            </div>
            
            <div style="background-color: #ff3333/10; border: 1px solid #ff3333/30; padding: 20px; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-weight: 600;">
                ⚠️ Important: Vehicle Verification
              </p>
              <p style="margin: 0; color: #b0b0b0; line-height: 1.6; font-size: 14px;">
                If any of the above details are incorrect, or if your vehicle has aftermarket modifications (body kit, spoiler, custom bumpers), please reply to this email immediately.
              </p>
            </div>
            
            <p style="margin: 30px 0 0 0; color: #b0b0b0; line-height: 1.6;">
              Your kit will be precision-cut and shipped within 2-3 business days. You'll receive a shipping confirmation with tracking details.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #0f0f0f; padding: 30px; border-top: 1px solid #2a2a2a;">
            <p style="margin: 0 0 15px 0; color: #888; font-size: 14px;">
              Need help? We're here for you.
            </p>
            <p style="margin: 0; color: #ff3333; font-size: 14px;">
              <a href="mailto:info@stealthshieldppf.com" style="color: #ff3333; text-decoration: none;">
                info@stealthshieldppf.com
              </a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} StealthShield. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'StealthShield <info@stealthshieldppf.com>',
        to: [data.to],
        subject: `Order Confirmation: ${data.orderNumber} - Please Verify Vehicle Details`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send failed:', error);
      return { error: 'Failed to send email', details: error };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true, id: result.id };
    
  } catch (error) {
    console.error('Email error:', error);
    return { error: 'Email sending failed', details: error };
  }
}

