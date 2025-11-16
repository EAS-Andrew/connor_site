import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendVehicleFollowUpEmail } from '@/lib/email';

// Verify the webhook came from Shopify
function verifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('SHOPIFY_WEBHOOK_SECRET not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmacHeader;
}

// Extract vehicle data from order attributes
function getVehicleDataFromOrder(order: any) {
  const attributes = order.note_attributes || [];
  
  return {
    registration: attributes.find((a: any) => a.name === 'registration')?.value,
    make: attributes.find((a: any) => a.name === 'make')?.value,
    model: attributes.find((a: any) => a.name === 'model')?.value,
    year: attributes.find((a: any) => a.name === 'year')?.value,
    variant: attributes.find((a: any) => a.name === 'variant')?.value,
  };
}

// Check if order has vehicle data (pre-cut kit)
function hasVehicleData(order: any): boolean {
  const vehicleData = getVehicleDataFromOrder(order);
  return !!(vehicleData.registration && vehicleData.make);
}

// Send follow-up email
async function sendFollowUpEmail(order: any) {
  const vehicleData = getVehicleDataFromOrder(order);
  
  const emailData = {
    to: order.email,
    customerName: order.customer?.first_name || 'Customer',
    orderNumber: order.name,
    orderDate: new Date(order.created_at).toLocaleDateString('en-GB'),
    vehicle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
    variant: vehicleData.variant,
    registration: vehicleData.registration,
  };

  console.log('Sending follow-up email:', emailData);
  
  const result = await sendVehicleFollowUpEmail(emailData);
  
  if (result.error) {
    console.error('Failed to send email:', result.error);
    throw new Error(`Email send failed: ${result.error}`);
  }
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for webhook verification
    const body = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
    
    // Verify webhook authenticity
    if (!hmacHeader || !verifyWebhook(body, hmacHeader)) {
      console.error('Webhook verification failed');
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 401 }
      );
    }

    // Parse the order data
    const order = JSON.parse(body);
    
    console.log('Received order webhook:', {
      orderId: order.id,
      orderName: order.name,
      email: order.email,
    });

    // Check if this is a pre-cut kit order with vehicle data
    if (hasVehicleData(order)) {
      console.log('Order has vehicle data, sending follow-up email...');
      await sendFollowUpEmail(order);
    } else {
      console.log('Order does not have vehicle data, skipping follow-up');
    }

    // Return success response to Shopify
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Shopify requires a 200 response within 5 seconds
export const maxDuration = 5;

