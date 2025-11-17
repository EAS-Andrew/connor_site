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

// Extract vehicle data from order line item properties
function getVehicleDataFromOrder(order: any) {
  // Check note_attributes first (cart-level attributes)
  const noteAttributes = order.note_attributes || [];
  if (noteAttributes.length > 0) {
    const registration = noteAttributes.find((a: any) => a.name === 'registration')?.value;
    if (registration) {
      return {
        registration,
        make: noteAttributes.find((a: any) => a.name === 'make')?.value,
        model: noteAttributes.find((a: any) => a.name === 'model')?.value,
        year: noteAttributes.find((a: any) => a.name === 'year')?.value,
        variant: noteAttributes.find((a: any) => a.name === 'variant')?.value,
      };
    }
  }

  // Fallback: check line item properties (where cart attributes actually go)
  const lineItems = order.line_items || [];
  if (lineItems.length > 0) {
    const properties = lineItems[0].properties || [];
    return {
      registration: properties.find((p: any) => p.name === 'registration')?.value,
      make: properties.find((p: any) => p.name === 'make')?.value,
      model: properties.find((p: any) => p.name === 'model')?.value,
      year: properties.find((p: any) => p.name === 'year')?.value,
      variant: properties.find((p: any) => p.name === 'variant')?.value,
    };
  }

  return {
    registration: undefined,
    make: undefined,
    model: undefined,
    year: undefined,
    variant: undefined,
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
      lineItemsCount: order.line_items?.length || 0,
      noteAttributesCount: order.note_attributes?.length || 0,
    });

    // Debug: Log first line item properties if they exist
    if (order.line_items && order.line_items.length > 0) {
      console.log('First line item properties:', order.line_items[0].properties);
    }

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

